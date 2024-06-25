import React, {useState, useEffect} from 'react';
import Grid from './Grid';
import Keyboard from './Keyboard';
import ToastMessage from './ToastMessage';
import ModalStats from './ModalStats';
import {checkDatabase, updateBoardWithGuess} from '../wordSubmit';
import getGuess from '../functions/getGuess';

function Board({boardID, onRestart}) {
    const [solution, setSolution] = useState('');
    const [gameOver, setGameOver] = useState(false);
    const [gameStats, setGameStats] = useState({});

    const {
        currentGuess,
        guesses,
        setGuesses,
        turn,
        isCorrect,
        handleKeyup,
        usedKeys,
        handleKeyInput,
        setHistory,
        setTurn,
        setIsCorrect,
        setUsedKeys,
        setIsValidWord,
        isValidWord,
        message,
        showToast,
        setMessage,
        setShowToast,
        showModal,
        setShowModal,
    } = getGuess(solution, boardID);

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
                        return {key: char, color: color};
                    });
                }

                setGuesses(oldGuesses);
                setHistory(data.guesses || []);
                setTurn(data.guessCount || 0);
                setUsedKeys(data.usedKeys || {});
                setIsValidWord(true);
                setIsCorrect(false); // Maybe need to reset it here?
            } catch (error) {
                console.error('Failed to fetch board data:', error);
            }
        }

        if (boardID) {
            fetchBoardData();
        }
    }, [boardID, setGuesses, setHistory, setTurn, setIsCorrect, setUsedKeys, setIsValidWord]);

    useEffect(() => {
        async function updateBoard() {
            try {
                if (isCorrect || turn >= 6) {
                    setGameOver(true);
                    setShowModal(true);
                    setGameStats({
                        correctWord: solution, totalGuesses: turn + 1, correctGuesses: isCorrect ? 1 : 0,
                    });
                } else if (currentGuess.length === 5) {
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
        onRestart();
    };

    return (<>
        <div className="board-container">
            <Grid guesses={guesses} currentGuess={currentGuess} turn={turn} isValidWord={isValidWord}
                  isCorrect={isCorrect}/>
        </div>
        <Keyboard usedKeys={usedKeys} handleKeyInput={handleKeyInput}/>
        {showToast && <ToastMessage message={message}/>}
        <ModalStats isOpen={showModal} stats={gameStats} onClose={closeModal} onRestart={closeModal}/>
    </>);
}

export default Board;
