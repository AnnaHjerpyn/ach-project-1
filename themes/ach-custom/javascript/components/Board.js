import React, { useState, useEffect } from 'react';
import Grid from './Grid';
import Keyboard from './Keyboard';
import ToastMessage from './ToastMessage';
import ModalStats from './ModalStats';
import { checkDatabase, updateBoardWithGuess } from '../wordSubmit';
import getGuess from '../functions/getGuess';
import useDebounce from '../functions/useDebounce';
import '../../css/src/Components/_board.scss';


function Board({ boardID, onRestart }) {
    const [solution, setSolution] = useState('');
    //const [isCorrect, setIsCorrect] = useState(false);
    const [inputDisabled, setInputDisabled] = useState(false); // State to disable input

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
        gameOver,
        isCorrect,
    } = getGuess(solution, boardID);

    const debouncedGuess = useDebounce(currentGuess, 100);

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
            } catch (error) {
                console.error('Failed to fetch board data:', error);
            }
        }

        if (boardID) {
            fetchBoardData();
        }
    }, [boardID, setGuesses, setHistory, setTurn, setUsedKeys, setIsValidWord]);

    useEffect(() => {
        async function updateBoard() {
            try {
                // if (currentGuess === solution) {
                //     setIsCorrect(true);
                // }
                if (isCorrect || turn > 5) {
                    setMessage(solution);
                    setShowToast(true);
                }
                if (currentGuess.length === 5) {
                    const data = await checkDatabase(currentGuess, boardID);
                    if (data.isValidWord) {
                        setIsValidWord(true);
                        await updateBoardWithGuess(boardID, currentGuess);
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
    }, [isCorrect, turn, boardID, currentGuess, guesses, gameOver, handleKeyup]);

    const closeModal = () => {
        setShowModal(false);
        setInputDisabled(true);
    };

    const restartGame = () => {
        onRestart();
    };

    return (
        <>
            <div className="board-container">
                <Grid guesses={guesses} debouncedGuess={debouncedGuess} turn={turn} isValidWord={isValidWord} isCorrect={isCorrect} currentGuess={currentGuess} />
            </div>
            <Keyboard usedKeys={usedKeys} handleKeyInput={handleKeyInput} disabled={inputDisabled} />
            {showToast && <ToastMessage message={message} />}
            <ModalStats isOpen={showModal} onClose={closeModal} onRestart={restartGame} />
        </>
    );
}

export default Board;
