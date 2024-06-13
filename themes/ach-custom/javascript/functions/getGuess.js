import React, { useState, useCallback, useEffect } from 'react';
import { fetchRandomWord, submitGuess } from '../wordSubmit';

const getGuess = () => {
    const [turn, setTurn] = useState(0);
    const [currentGuess, setCurrentGuess] = useState('');
    const [guesses, setGuesses] = useState([...Array(6)]); // each guess is an array
    const [history, setHistory] = useState([]); // each guess is a string
    const [isCorrect, setIsCorrect] = useState(false);
    const [usedKeys, setUsedKeys] = useState({}); // {a: 'grey', b: 'green', c: 'yellow'} etc
    const [solution, setSolution] = useState('');

    // Fetch random word when the component mounts
    useEffect(() => {
        const fetchSolution = async () => {
            try {
                const randomWord = await fetchRandomWord();
                setSolution(randomWord);
            } catch (error) {
                console.error('Error fetching solution:', error);
            }
        };

        fetchSolution();
    }, []);

    const formatGuess = useCallback(() => {
        let solutionArray = [...solution];
        let formattedGuess = [...currentGuess].map((l) => {
            return { key: l, color: 'grey' };
        });

        // find any green letters
        formattedGuess.forEach((l, i) => {
            if (solution[i] === l.key) {
                formattedGuess[i].color = 'green';
                solutionArray[i] = null;
            }
        });

        // find any yellow letters
        formattedGuess.forEach((l, i) => {
            if (solutionArray.includes(l.key) && l.color !== 'green') {
                formattedGuess[i].color = 'yellow';
                solutionArray[solutionArray.indexOf(l.key)] = null;
            }
        });

        return formattedGuess;
    }, [currentGuess, solution]);

    const addNewGuess = useCallback(async (formattedGuess) => {
        if (currentGuess === solution) {
            setIsCorrect(true);
        }
        setGuesses((prevGuesses) => {
            let newGuesses = [...prevGuesses];
            newGuesses[turn] = formattedGuess;
            return newGuesses;
        });
        setHistory((prevHistory) => {
            return [...prevHistory, currentGuess];
        });
        setTurn((prevTurn) => {
            return prevTurn + 1;
        });
        setUsedKeys((prevUsedKeys) => {
            formattedGuess.forEach((l) => {
                const currentColor = prevUsedKeys[l.key];

                if (l.color === 'green') {
                    prevUsedKeys[l.key] = 'green';
                    return;
                }
                if (l.color === 'yellow' && currentColor !== 'green') {
                    prevUsedKeys[l.key] = 'yellow';
                    return;
                }
                if (l.color === 'grey' && currentColor !== ('green' || 'yellow')) {
                    prevUsedKeys[l.key] = 'grey';
                    return;
                }
            });

            return prevUsedKeys;
        });
        setCurrentGuess('');

        try {
            const response = await submitGuess(currentGuess);
            console.log(response.message); // handle the response as needed
        } catch (error) {
            console.error('Error submitting guess:', error);
        }
    }, [currentGuess, turn, solution]);

    const handleKeyInput = useCallback((key) => {
        if (key === 'Enter') {
            if (turn > 5) {
                console.log('Already guessed 6 times.');
                return;
            }
            if (history.includes(currentGuess)) {
                console.log('Word has already been used.');
                return;
            }
            if (currentGuess.length !== 5) {
                console.log('No more than 5 letters');
                return;
            }
            const formatted = formatGuess();
            addNewGuess(formatted);
        } else if (key === 'Backspace') {
            setCurrentGuess((prev) => prev.slice(0, -1));
        } else if (/^[A-Za-z]$/.test(key)) {
            if (currentGuess.length < 5) {
                setCurrentGuess((prev) => prev + key);
            }
        }
    }, [turn, currentGuess, history, formatGuess, addNewGuess]);

    const handleKeyup = useCallback((event) => {
        handleKeyInput(event.key);
    }, [handleKeyInput]);

    return { turn, currentGuess, guesses, isCorrect, usedKeys, handleKeyup, handleKeyInput };
};

export default getGuess;
