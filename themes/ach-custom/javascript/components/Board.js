import React, {useEffect, useState} from 'react';
import Grid from "./Grid";
import getGuess from "../functions/getGuess";
import Keyboard from "./Keyboard";
import ToastMessage from "./ToastMessage";

function Board({solution}) {
    const {currentGuess, guesses, turn, isCorrect, handleKeyup, usedKeys, handleKeyInput } = getGuess(solution);
    const [message, setMessage] = useState("");
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        window.addEventListener('keyup', handleKeyup);
        return () => window.removeEventListener('keyup', handleKeyup);
    }, [handleKeyup]);

    useEffect(() => {
        if (isCorrect) {
            setMessage("Congratulations! You guessed the word!");
            setShowToast(true);
        } else if (turn === guesses.length) {
            setMessage("Invalid word. Try again!");
            setShowToast(true);
        }
    }, [guesses, turn, isCorrect]);

    return (
        <>
            <div className="board-container">
                <Grid guesses={guesses} currentGuess={currentGuess} turn={turn} />
            </div>
            <Keyboard usedKeys={usedKeys} handleKeyInput={handleKeyInput}/>
            {showToast && <ToastMessage message={message} />}
        </>
    );
}

export default Board;
