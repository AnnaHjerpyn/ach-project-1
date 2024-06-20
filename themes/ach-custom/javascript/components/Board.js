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
    const [isValidWord, setValidWord] = useState("");

    // Fetch solution when boardID changes
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

    // Update board logic based on game state changes
    useEffect(() => {
        async function updateBoard() {
            try {
                // Check if the game is over
                if (isCorrect) {
                    setGameOver(true);
                    setMessage(isCorrect ? 'You guessed the correct word!' : 'You have used all your guesses.');
                    setShowToast(true);
                } else if (currentGuess.length === 5) {
                    // Check if the current guess length is 5
                    try {
                        const data = await checkDatabase(currentGuess, boardID);
                        console.log(data.isValidWord);
                        if (data.isValidWord) {
                            // Update local state with the new guess
                            addNewGuess();
                            // Update board with valid guess status
                            await updateBoardWithGuess(boardID, {guess: currentGuess, status: 'valid'});
                        } else {
                            // Handle invalid word case
                            setMessage('Word is not in the list.');
                            setShowToast(true);
                        }
                    } catch (error) {
                        // Handle database check error
                        setMessage(error.message);
                        setShowToast(true);
                    }
                }
            } catch (error) {
                // Handle updateBoard error
                console.error('Failed to update board:', error);
                setMessage('Failed to update board.');
                setShowToast(true);
            }
        }

        // Event listener for Enter key
        function handleEnterKey(event) {
            if (event.key === 'Enter' && !gameOver) {
                updateBoard();
            }
        }

        window.addEventListener('keydown', handleEnterKey);
        return () => {
            window.removeEventListener('keydown', handleEnterKey);
        };
    }, [isCorrect, turn, boardID, currentGuess, addNewGuess, gameOver]);

    // Event listener for keyup
    useEffect(() => {
        window.addEventListener('keyup', handleKeyup);
        return () => window.removeEventListener('keyup', handleKeyup);
    }, [handleKeyup]);

    return (
        <>
            <div className="board-container">
                <Grid guesses={guesses} currentGuess={currentGuess} turn={turn}/>
            </div>
            <Keyboard usedKeys={usedKeys} handleKeyInput={handleKeyInput}/>
            {showToast && <ToastMessage message={message}/>}
        </>
    );
}

export default Board;
