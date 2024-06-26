import React, { useState, useEffect } from 'react';
import Grid from './Grid';
import Keyboard from './Keyboard';
import ToastMessage from './ToastMessage';
import ModalStats from './ModalStats';
import { checkDatabase, updateBoardWithGuess } from '../wordSubmit';
import getGuess from '../functions/getGuess';
import useDebounce from '../functions/useDebounce';

function Board({ boardID, onRestart }) {
    const [solution, setSolution] = useState('');
    const [gameOver, setGameOver] = useState(false);
    const [gameStats, setGameStats] = useState({});
    const [isCorrect, setIsCorrect] = useState(false);

    const {
        currentGuess,
        guesses,
        setGuesses,
        turn,
        handleKeyup,
        usedKeys,
        handleKeyInput,
        setHistory,
        setTurn,
        setUsedKeys,
        setIsValidWord,
        isValidWord,
        message,
        showToast,
        setMessage,
        setShowToast,
        showModal,
        setShowModal,
    } = getGuess(solution, boardID, isCorrect);

    const debouncedGuess = useDebounce(currentGuess, 50);

    useEffect(() => {
        async function fetchBoardData() {
            try {
                const response = await fetch(`/home/getBoard/${boardID}`);
                const data = await response.json();
                setSolution(data.solution);

                let oldGuesses = [...Array(6)].map(() => Array(5).fill(''));
                for (let i = 0; i < data.guesses.length; i++) {
                    oldGuesses[i] = data.guesses[i].split('').map((char) => {
                        const color = data.usedKeys[char];
                        return { key: char, color: color };
                    });
                }

                setGuesses(oldGuesses);
                setHistory(data.guesses || []);
                setTurn(data.guessCount || 0);
                setUsedKeys(data.usedKeys || {});
                setIsValidWord(true);
                setIsCorrect(false);
            } catch (error) {
                console.error('Failed to fetch board data:', error);
            }
        }

        if (boardID) {
            fetchBoardData();
        }
    }, [boardID, setGuesses, setHistory, setTurn, setUsedKeys, setIsValidWord, setIsCorrect]);

    useEffect(() => {
        async function updateBoard() {
            try {
                if (debouncedGuess === solution) {
                    setIsCorrect(true);
                    console.log(isCorrect);
                }
                if (isCorrect || turn > 5) {
                    setGameOver(true);
                    setShowModal(true);
                    setMessage(solution);
                    setShowToast(true);
                    setGameStats({
                        correctWord: solution,
                        totalGuesses: turn + 1,
                        correctGuesses: isCorrect ? 1 : 0,
                    });
                }
                if (debouncedGuess.length === 5) {
                    const data = await checkDatabase(debouncedGuess, boardID);
                    if (data.isValidWord) {
                        setIsValidWord(true);
                        await updateBoardWithGuess(boardID, debouncedGuess);
                    } else {
                        setMessage('Word is not in list');
                        setShowToast(true);
                        setIsValidWord(false);
                    }
                }
            } catch (error) {
                console.error('Failed to update board:', error);
                setMessage('Failed to update board.');
                setShowToast(true);
            }
        }

        function handleEnterKey(event) {
            if (event.key === 'Enter' && !gameOver) {
                updateBoard();
            }
        }

        if (!gameOver) {
            window.addEventListener('keydown', handleEnterKey);
            window.addEventListener('keyup', handleKeyup);
        }

        return () => {
            window.removeEventListener('keydown', handleEnterKey);
            window.removeEventListener('keyup', handleKeyup);
        };
    }, [isCorrect, turn, boardID, debouncedGuess, guesses, gameOver, handleKeyup]);

    const closeModal = () => {
        setShowModal(false);
        onRestart();
    };

    return (
        <>
            <div className="board-container">
                <Grid guesses={guesses} currentGuess={debouncedGuess} turn={turn} isValidWord={isValidWord}
                      isCorrect={isCorrect} />
            </div>
            <Keyboard usedKeys={usedKeys} handleKeyInput={handleKeyInput} />
            {showToast && <ToastMessage message={message} />}
            <ModalStats isOpen={showModal} stats={gameStats} onClose={closeModal} onRestart={closeModal} />
        </>
    );
}

export default Board;
