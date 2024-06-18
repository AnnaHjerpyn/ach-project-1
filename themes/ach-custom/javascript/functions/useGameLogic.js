import {useEffect, useState} from 'react';
import {createBoard, checkDatabase, updateBoardWithGuess, updateGameState} from '../wordSubmit';
import getGuess from '../functions/getGuess';

export function useGameLogic() {
    const [solution, setSolution] = useState("");
    const [boardID, setBoardID] = useState(null);
    const {
        currentGuess, guesses, turn, isCorrect, handleKeyup, usedKeys, handleKeyInput, addNewGuess
    } = getGuess(solution);
    const [message, setMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        async function initializeBoard() {
            try {
                const data = await createBoard();
                setSolution(data.solution);
                setBoardID(data.boardID);
            } catch (error) {
                setMessage(error.message);
                setShowToast(true);
            }
        }

        initializeBoard();
    }, []);

    useEffect(() => {
        if (isCorrect || turn >= 6) {
            setGameOver(true);
            setMessage(isCorrect ? 'You guessed the correct word!' : 'You have used all your guesses.');
            setShowToast(true);

            if (boardID) {
                updateGameState(boardID, 1).catch(console.error);
            }
        }
    }, [isCorrect, turn, boardID]);

    useEffect(() => {
        async function handleDatabaseCheck() {
            try {
                const data = await checkDatabase(currentGuess, boardID);
                if (data.isValidWord) {
                    const formatted = formatGuess(currentGuess, solution);
                    addNewGuess(formatted);
                    await updateBoardWithGuess(boardID, formatted);
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
