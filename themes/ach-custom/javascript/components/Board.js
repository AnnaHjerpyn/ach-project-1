import React, {useEffect, useState} from 'react';
import Grid from "./Grid";
import getGuess from "../functions/getGuess";
import Keyboard from "./Keyboard";
import ToastMessage from "./ToastMessage";

function Board({solution}) {

    const {currentGuess, guesses, turn, isCorrect, handleKeyup, usedKeys, handleKeyInput} = getGuess(solution);
    const [message, setMessage] = useState("");
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        window.addEventListener('keyup', handleKeyup);
        return () => window.removeEventListener('keyup', handleKeyup);
    }, [handleKeyup]);

    useEffect(() => {
        async function checkDatabase() {
            try {
                const response = await fetch('/word-bank/checkDatabase', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ Word: currentGuess })
                });

                const data = await response.json();

                if (!response.ok) {
                    console.log('Server response:', data);
                    throw new Error('Failed to check.');
                }

                console.log('Server response:', data);
            } catch (error) {
                console.error('Error fetching response:', error);
            }
        }

        function handleEnterKey(event) {
            if (event.key === 'Enter') {
                checkDatabase();
            }
        }

        // Add event listener for keydown events (for Enter key)
        window.addEventListener('keydown', handleEnterKey);
        return () => window.removeEventListener('keydown', handleEnterKey);
    }, [currentGuess]); // dependency makes it run only when currentGuess changes


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
