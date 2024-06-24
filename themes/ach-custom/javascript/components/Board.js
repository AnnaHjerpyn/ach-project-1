import React, {useState, useEffect} from 'react';
import Grid from './Grid';
import Keyboard from './Keyboard';
import ToastMessage from './ToastMessage';
import {checkDatabase, updateBoardWithGuess} from '../wordSubmit';
import getGuess from '../functions/getGuess';

function Board({boardID}) {
    const [solution, setSolution] = useState('');
    const [gameOver, setGameOver] = useState(false);

    const {
        currentGuess,
        guesses,
        setGuesses,
        turn,
        isCorrect,
        handleKeyup,
        usedKeys,
        handleKeyInput,
        setHistory,
        setTurn,
        setIsCorrect,
        setUsedKeys,
        setIsValidWord,
        isValidWord,
        message,
        showToast,
        setMessage,
        setShowToast
    } = getGuess(solution, boardID);

    // Fetch solution and previous guesses when boardID changes
    useEffect(() => {
        async function fetchBoardData() {
            try {
                const response = await fetch(`/home/getBoard/${boardID}`);
                const data = await response.json();
                setSolution(data.solution);

                // Populate the guesses here
                let oldGuesses = [...Array(6)].map(() => Array(5).fill(''));
                // Mapping that for Grid <3
                for (let i = 0; i < data.guesses.length; i++) {
                    oldGuesses[i] = data.guesses[i].split('').map((char) => {
                        const color = data.usedKeys[char];
                        return {
                            key: char, color: color,
                        };
                    });
                }

                setGuesses(oldGuesses);

                // Set history, turn, and used keys
                setHistory(data.guesses || []);
                setTurn(data.guessCount || 0);
                setIsCorrect(data.finished || false);
                setUsedKeys(data.usedKeys || {});
                setIsValidWord(true);
            } catch (error) {
                console.error('Failed to fetch board data:', error);
            }
        }

        if (boardID) {
            fetchBoardData();
        }
    }, [boardID, setGuesses, setHistory, setTurn, setIsCorrect, setUsedKeys, setIsValidWord, setMessage, setShowToast]);

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
                        // Set valid word to true
                        setIsValidWord(true);
                        // Update board with valid guess status
                        await updateBoardWithGuess(boardID, currentGuess);
                    } else {
                        // Handle invalid word case
                        setMessage('Word is not in list');
                        setShowToast(true);
                        setIsValidWord(false); // Set isValidWord to false for invalid word
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

    return (<>
        <div className="board-container">
            <Grid guesses={guesses} currentGuess={currentGuess} turn={turn} isValidWord={isValidWord}/>
        </div>
        <Keyboard usedKeys={usedKeys} handleKeyInput={handleKeyInput}/>
        {showToast && <ToastMessage message={message}/>}
    </>);
}

export default Board;
