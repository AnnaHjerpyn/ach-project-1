import React, {useState, useEffect, useCallback} from 'react';
import Grid from './Grid';
import Keyboard from './Keyboard';
import ToastMessage from './ToastMessage';
import ModalStats from './ModalStats';
import {checkDatabase, updateBoardWithGuess} from '../wordSubmit';
import getGuess from '../functions/getGuess';

function Board({boardID, onRestart}) {
    const [solution, setSolution] = useState('');
    const [gameOver, setGameOver] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [gameStats, setGameStats] = useState({});
    const [message, setMessage] = useState('');
    const [showToast, setShowToast] = useState(false);

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
    } = getGuess(solution, boardID);

    useEffect(() => {
        const fetchBoardData = async () => {
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
            } catch (error) {
                console.error('Failed to fetch board data:', error);
                setMessage('Failed to load board data.');
                setShowToast(true);
            }
        };

        if (boardID) {
            fetchBoardData();
        }
    }, [boardID]);

    const updateBoard = useCallback(async () => {
        try {
            if (isCorrect || turn >= 6) {
                setGameOver(true);
                setShowModal(true);
                setGameStats({
                    correctWord: solution, totalGuesses: turn + 1, correctGuesses: isCorrect ? 1 : 0,
                });
                setMessage(isCorrect ? 'Congratulations!' : `${solution}`);
                setShowToast(true);
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
    }, [boardID, currentGuess, isCorrect, turn, solution]);

    useEffect(() => {
        const handleEnterKey = (event) => {
            if (event.key === 'Enter' && !gameOver) {
                updateBoard();
            }
        };

        if (!gameOver) {
            window.addEventListener('keydown', handleEnterKey);
            window.addEventListener('keyup', handleKeyup);
        }

        return () => {
            window.removeEventListener('keydown', handleEnterKey);
            window.removeEventListener('keyup', handleKeyup);
        };
    }, [gameOver, updateBoard, handleKeyup]);

    const closeModal = () => {
        setShowModal(false);
        onRestart();
    };

    return (<>
            <div className="board-container">
                <Grid
                    guesses={guesses}
                    currentGuess={currentGuess}
                    turn={turn}
                    isValidWord={isValidWord}
                    isCorrect={isCorrect}
                />
            </div>
            <Keyboard usedKeys={usedKeys} handleKeyInput={handleKeyInput}/>
            {showToast && <ToastMessage message={message}/>}
            <ModalStats isOpen={showModal} stats={gameStats} onClose={closeModal} onRestart={closeModal}/>
        </>);
}

export default Board;
