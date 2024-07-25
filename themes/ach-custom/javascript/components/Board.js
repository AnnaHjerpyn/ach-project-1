import React, {useEffect, useState} from 'react';
import Grid from './Grid';
import Keyboard from './Keyboard';
import ToastMessage from './ToastMessage';
import WLModal from './WLModal';
import {checkDatabase, updateBoardWithGuess, updateUserStatistics} from '../functions/databaseRequests';
import getGuess from '../functions/getGuess';
import useDebounce from '../functions/useDebounce';
import '../../css/src/Components/_board.scss';

function Board({boardID, onRestart}) {
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
    } = getGuess(boardID);

    const debouncedGuess = useDebounce(currentGuess, 100);

    useEffect(() => {
        async function fetchBoardData() {
            try {
                const response = await fetch(`/home/getBoard/${boardID}`);
                const data = await response.json();

                let oldGuesses = [...Array(6)].map(() => Array(5).fill({key: '', color: ''}));
                for (let i = 0; i < data.guesses.length; i++) {
                    oldGuesses[i] = data.guesses[i].split('').map((char, index) => {
                        const color = data.usedKeys[i][index];
                        return {key: char, color: color};
                    });
                }

                setGuesses(oldGuesses);
                setHistory(data.guesses || []);
                setTurn(data.guessCount || 0);
                const transformedUsedKeys = {};
                data.guesses.forEach((guess, i) => {
                    guess.split('').forEach((char, index) => {
                        const color = data.usedKeys[i][index];
                        if (!transformedUsedKeys[char]) {
                            transformedUsedKeys[char] = color;
                        } else if (color === 'green' || (color === 'yellow' && transformedUsedKeys[char] !== 'green')) {
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
                if (isCorrect || turn === 5) {
                    const data = await checkDatabase(currentGuess, boardID);
                    await updateUserStatistics(isCorrect);
                    setMessage(data.message);
                    setShowToast(true);
                }

                if (currentGuess.length === 5) {
                    setIsValidWord(true);
                    await updateBoardWithGuess(boardID, currentGuess);
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
                <Grid guesses={guesses} debouncedGuess={debouncedGuess} turn={turn} isValidWord={isValidWord}
                      isCorrect={isCorrect} currentGuess={currentGuess}/>
            </div>
            <Keyboard usedKeys={usedKeys} handleKeyInput={handleKeyInput} disabled={inputDisabled}/>
            {showToast && <ToastMessage message={message}/>}
            <WLModal isOpen={showModal} onClose={closeModal} onRestart={restartGame} isCorrect={isCorrect}/>
        </>
    );
}

export default Board;
