import React, {useState, useEffect} from 'react';
import Grid from './Grid';
import Keyboard from './Keyboard';
import ToastMessage from './ToastMessage';
import {checkDatabase, updateBoardWithGuess} from '../wordSubmit';
import getGuess from '../functions/getGuess';

function Board({boardID}) {
    const [solution, setSolution] = useState("");
    const {
        currentGuess, guesses, turn, isCorrect, handleKeyup, usedKeys, handleKeyInput, addNewGuess
    } = getGuess(solution);
    const [message, setMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        async function fetchSolution() {
            try {
                const response = await fetch(`/home/getBoard/${boardID}`);
                const data = await response.json();
                setSolution(data.solution);
            } catch (error) {
                console.error('Failed to fetch solution:', error);
            }
        }

        if (boardID) {
            fetchSolution();
        }
    }, [boardID]);

    useEffect(() => {
        if (isCorrect || turn >= 6) {
            setGameOver(true);
            setMessage(isCorrect ? 'You guessed the correct word!' : 'You have used all your guesses.');
            setShowToast(true);

            if (boardID) {
                updateBoardWithGuess(boardID, isCorrect ? 'correct' : 'finished').catch(console.error);
            }
        }
    }, [isCorrect, turn, boardID]);

    useEffect(() => {
        async function handleDatabaseCheck() {
            if (currentGuess.length === 5) {
                try {
                    const data = await checkDatabase(currentGuess, boardID);
                    if (data.valid) {
                        addNewGuess();
                        await updateBoardWithGuess(boardID, {guess: currentGuess, status: 'valid'});
                    } else {
                        setMessage('Word is not in the list.');
                        setShowToast(true);
                    }
                } catch (error) {
                    setMessage(error.message);
                    setShowToast(true);
                }
            }
        }

        function handleEnterKey(event) {
            if (event.key === 'Enter' && !gameOver) {
                handleDatabaseCheck();
            }
        }

        window.addEventListener('keydown', handleEnterKey);
        return () => window.removeEventListener('keydown', handleEnterKey);
    }, [currentGuess, boardID, gameOver, addNewGuess]);

    useEffect(() => {
        window.addEventListener('keyup', handleKeyup);
        return () => window.removeEventListener('keyup', handleKeyup);
    }, [handleKeyup]);

    return (<>
            <div className="board-container">
                <Grid guesses={guesses} currentGuess={currentGuess} turn={turn}/>
            </div>
            <Keyboard usedKeys={usedKeys} handleKeyInput={handleKeyInput}/>
            {showToast && <ToastMessage message={message}/>}
        </>);
}

export default Board;
