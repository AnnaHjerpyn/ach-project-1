// src/components/Board.js

import React from 'react';
import Grid from "./Grid";
import Keyboard from "./Keyboard";
import ToastMessage from "./ToastMessage";
import {useGameLogic} from '../functions/useGameLogic';

function Board() {
    const {
        boardID, guesses, currentGuess, turn, isCorrect, usedKeys, handleKeyInput, message, showToast
    } = useGameLogic();

    return (<>
            <h1>Board ID: {boardID}</h1>
            <div className="board-container">
                <Grid guesses={guesses} currentGuess={currentGuess} turn={turn}/>
            </div>
            <Keyboard usedKeys={usedKeys} handleKeyInput={handleKeyInput}/>
            {showToast && <ToastMessage message={message}/>}
        </>);
}

export default Board;
