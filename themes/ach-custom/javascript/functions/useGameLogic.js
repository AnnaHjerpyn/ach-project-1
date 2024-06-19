import {useEffect, useState} from 'react';
import {checkDatabase, updateBoardWithGuess } from '../wordSubmit';
import getGuess from '../functions/getGuess';

export function useGameLogic(boardID) {
    const [solution, setSolution] = useState("");
    const {
        currentGuess, guesses, turn, isCorrect, handleKeyup, usedKeys, handleKeyInput, addNewGuess
    } = getGuess(solution);
    const [message, setMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        if (isCorrect || turn >= 6) {
            setGameOver(true);
            setMessage(isCorrect ? 'You guessed the correct word!' : 'You have used all your guesses.');
            setShowToast(true);

            if (boardID) {
                updateBoardWithGuess(boardID, 1).catch(console.error);
            }
        }
    }, [isCorrect, turn, boardID]);

    useEffect(() => {
        async function handleDatabaseCheck() {
            try {
                const data = await checkDatabase(currentGuess, boardID);
                if (!data.isCorrect) {
                    await updateBoardWithGuess(boardID, currentGuess);
                } else {
                    setMessage('Word is not in the list.');
                    setShowToast(true);
                }
            } catch (error) {
                setMessage(error.message);
                setShowToast(true);
            }
        }

        function handleEnterKey(event) {
            if (event.key === 'Enter' && !gameOver) {
                handleDatabaseCheck();
            }
        }

        window.addEventListener('keydown', handleEnterKey);
        return () => window.removeEventListener('keydown', handleEnterKey);
    }, [currentGuess, boardID, gameOver, guesses.length]);

    useEffect(() => {
        window.addEventListener('keyup', handleKeyup);
        return () => window.removeEventListener('keyup', handleKeyup);
    }, [handleKeyup]);

    return {
        boardID, solution, guesses, currentGuess, turn, isCorrect, usedKeys, handleKeyInput, message, showToast
    };
}
