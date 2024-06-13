import React, {useEffect, useState} from 'react';
import Grid from "./Grid";
import getGuess from "../functions/getGuess";
import Keyboard from "./Keyboard";
import ToastMessage from "./Toast";
import {fetchRandomWord} from "../wordSubmit";

function Board() {
    const [solution, setSolution] = useState(null);
    const {currentGuess, guesses, turn, isCorrect, handleKeyup, usedKeys, handleKeyInput} = getGuess(solution);
    const {message} = useState("win");

    useEffect(() => {
        // Fetch a random word when the component mounts
        fetchRandomWord()
            .then(word => setSolution(word))
            .catch(error => console.error('Error fetching random word:', error));
    }, []);

    useEffect(() => {
        window.addEventListener('keyup', handleKeyup);
        return () => window.removeEventListener('keyup', handleKeyup);
    }, [handleKeyup]);

    useEffect(() => {
        console.log(guesses, turn, isCorrect);
    }, [guesses, turn, isCorrect]);

    return (
        <>
            <div className="board-container">
                <Grid guesses={guesses} currentGuess={currentGuess} turn={turn}/>
            </div>
            <Keyboard usedKeys={usedKeys} handleKeyInput={handleKeyInput}/>
        </>
    );
}

export default Board;
