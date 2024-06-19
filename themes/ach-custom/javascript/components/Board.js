import React from 'react';
import Grid from "./Grid";
import Keyboard from "./Keyboard";
import ToastMessage from "./ToastMessage";
import {useGameLogic} from '../functions/useGameLogic';
import {boar} from "yarn/lib/cli";

function Board({boardID}) {

    const {
        guesses, currentGuess, turn, isCorrect, usedKeys, handleKeyInput, message, showToast
    } = useGameLogic(boardID);

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
