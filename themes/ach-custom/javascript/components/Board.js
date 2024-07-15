import React, { useState, useEffect } from 'react';
import Grid from './Grid';
import Keyboard from './Keyboard';
import ToastMessage from './ToastMessage';
import ModalStats from './ModalStats';
import { checkDatabase, updateBoardWithGuess } from '../functions/wordSubmit';
import getGuess from '../functions/getGuess';
import useDebounce from '../functions/useDebounce';
import '../../css/src/Components/_board.scss';

function Board({ boardID, onRestart }) {
    const [solution, setSolution] = useState('');
    const [inputDisabled, setInputDisabled] = useState(false);
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

                let oldGuesses = [...Array(6)].map(() => Array(5).fill({ key: '', color: '' }));
                for (let i = 0; i < data.guesses.length; i++) {
                    oldGuesses[i] = data.guesses[i].split('').map((char, index) => {
                        const color = data.usedKeys[i][index];
                        return { key: char, color: color };
                    });
                }

                setGuesses(oldGuesses);
                setHistory(data.guesses || []);
                setTurn(data.guessCount || 0);
                // Need to reformat the array returned by the backend
                const transformedUsedKeys = {};
                data.guesses.forEach((guess, i) => {
                    guess.split('').forEach((char, index) => {
                        const color = data.usedKeys[i][index];
                        // If a letter entry doesn't already exist with a color, add color
                        if (!transformedUsedKeys[char]) {
                            transformedUsedKeys[char] = color;
                        // Make sure green is takes over all precedence || yellow takes precedence over the grey
                        } else
                            if (color === 'green' || (color === 'yellow' && transformedUsedKeys[char] !== 'green')) {
                            transformedUsedKeys[char] = color;
                        }
                    });
                });

                setUsedKeys(transformedUsedKeys);
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
            <ModalStats isOpen={showModal} onClose={closeModal} onRestart={restartGame} isCorrect={isCorrect} solution={solution} />
        </>
    );
}

export default Board;
