import React, {useState, useEffect} from 'react';
import Grid from './Grid';
import Keyboard from './Keyboard';
import ToastMessage from './ToastMessage';
import {checkDatabase, updateBoardWithGuess} from '../wordSubmit';
import getGuess from '../functions/getGuess';

function Board({boardID}) {
    const [solution, setSolution] = useState("");
    const {
        currentGuess, guesses, setGuesses, turn, isCorrect, handleKeyup, usedKeys, handleKeyInput, addNewGuess, formatGuess
    } = getGuess(solution, boardID);
    const [message, setMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    // Fetch solution when boardID changes
    useEffect(() => {
        async function fetchBoardData() {
            try {
                const response = await fetch(`/home/getBoard/${boardID}`);
                const data = await response.json();
                setSolution(data.solution);

                // // TODO: Do I populate the guesses here
                // for (let i = 0; i < data.guessCount; i++) {
                //     let oldGuess = data.guesses[i];
                //     console.log(oldGuess);
                // }
                let oldGuesses = [...Array(6)];
                for (let i = 0; i < data.guessCount; i++) {
                    oldGuesses[i] = data.guesses[i];
                }
                setGuesses(oldGuesses);
            } catch (error) {
                console.error('Failed to fetch board data:', error);
            }
        }

        if (boardID) {
            fetchBoardData();
        }
    }, [boardID]);

    useEffect(() => {
        async function updateBoard() {
            try {
                // Check if the game is over
                if (isCorrect || turn >= 6) {
                    setGameOver(true);
                    setMessage('You guessed the correct word!');
                    setShowToast(true);
                } else if (currentGuess.length === 5) {
                    // Now proceed with the normal update logic
                    const data = await checkDatabase(currentGuess, boardID);
                    if (data.isValidWord) {
                        // Update board with valid guess status
                        await updateBoardWithGuess(boardID, currentGuess);
                    } else {
                        // Handle invalid word case
                        setMessage('Word is not in list');
                        setShowToast(true);
                    }
                }
            } catch (error) {
                // Handle errors
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
    }, [isCorrect, turn, boardID, currentGuess, guesses, gameOver]);


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
