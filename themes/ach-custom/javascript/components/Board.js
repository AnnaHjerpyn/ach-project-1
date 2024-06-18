import React, {useEffect, useState} from 'react';
import Grid from "./Grid";
import getGuess from "../functions/getGuess";
import Keyboard from "./Keyboard";
import ToastMessage from "./ToastMessage";

function Board({solution, boardID}) {
    const {currentGuess, guesses, turn, isCorrect, handleKeyup, usedKeys, handleKeyInput} = getGuess(solution);
    const [message, setMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        if (isCorrect || turn >= 6) {
            console.log("Turn:", turn);
            setGameOver(true);
            setMessage(isCorrect ? 'You guessed the correct word!' : 'You have used all your guesses.');
            setShowToast(true);
        }
    }, [isCorrect, turn]);

    useEffect(() => {
        async function checkDatabase() {
            try {
                const response = await fetch('/word-bank/checkDatabase', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({Word: currentGuess, BoardID: boardID})
                });

                const data = await response.json();

                if (!response.ok) {
                    console.log('Server response:', data);
                    throw new Error('Failed to check.');
                }

                // If the word is valid, add it as a new guess
                if (data.isValidWord) {
                    const formatted = formatGuess();
                    addNewGuess(formatted);
                } else {
                    // If the word is not valid, show a message
                    setMessage('Word is not in the list.');
                    setShowToast(true);
                }

                console.log('Server response:', data);
            } catch (error) {
                console.error('Error fetching response:', error);
                setMessage('Error fetching response.');
                setShowToast(true);
            }
        }

        function handleEnterKey(event) {
            if (event.key === 'Enter' && !gameOver) {
                console.log("Turn:", turn);
                checkDatabase();
            }
        }

        window.addEventListener('keydown', handleEnterKey);
        return () => window.removeEventListener('keydown', handleEnterKey);
    }, [currentGuess, boardID, gameOver, guesses.length]);

    useEffect(() => {
        window.addEventListener('keyup', handleKeyup);
        return () => window.removeEventListener('keyup', handleKeyup);
    }, [handleKeyup]);

    return (
        <>
            <h1>Board ID: {boardID}</h1>
            <div className="board-container">
                <Grid guesses={guesses} currentGuess={currentGuess} turn={turn}/>
            </div>
            <Keyboard usedKeys={usedKeys} handleKeyInput={handleKeyInput}/>
            {showToast && <ToastMessage message={message}/>}
        </>
    );
}

export default Board;
