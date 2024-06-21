import {useState, useCallback} from 'react';
import {checkDatabase} from "../wordSubmit";

const getGuess = (solution, boardID) => {
    const [turn, setTurn] = useState(0);
    const [currentGuess, setCurrentGuess] = useState('');
    const [guesses, setGuesses] = useState([...Array(6)]); // each guess is an array
    const [history, setHistory] = useState([]); // each guess is a string
    const [isCorrect, setIsCorrect] = useState(false);
    const [usedKeys, setUsedKeys] = useState({}); // {a: 'grey', b: 'green', c: 'yellow'} etc
    const [isValidWord, setIsValidWord] = useState(true); // Initial state for isValidWord
    const [message, setMessage] = useState('');
    const [showToast, setShowToast] = useState(false);

    const formatGuess = useCallback(() => {
        let solutionArray = [...solution];
        let formattedGuess = [...currentGuess].map((l) => {
            return {key: l, color: 'grey'};
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

    const addNewGuess = useCallback(() => {
        const formattedGuess = formatGuess();

        if (currentGuess === solution) {
            setIsCorrect(true);
        }

        setGuesses((prevGuesses) => {
            let newGuesses = [...prevGuesses];
            newGuesses[turn] = formattedGuess;
            return newGuesses;
        });

        setHistory((prevHistory) => [...prevHistory, currentGuess]);
        setTurn((prevTurn) => prevTurn + 1);

        setUsedKeys((prevUsedKeys) => {
            let newUsedKeys = {...prevUsedKeys};
            formattedGuess.forEach((l) => {
                const currentColor = newUsedKeys[l.key];

                if (l.color === 'green') {
                    newUsedKeys[l.key] = 'green';
                    return;
                }
                if (l.color === 'yellow' && currentColor !== 'green') {
                    newUsedKeys[l.key] = 'yellow';
                    return;
                }
                if (l.color === 'grey' && currentColor !== ('green' || 'yellow')) {
                    newUsedKeys[l.key] = 'grey';
                }
            });
            return newUsedKeys;
        });

        setCurrentGuess('');
    }, [currentGuess, turn, solution, formatGuess]);

    const handleKeyInput = useCallback(async (key) => {
        setIsValidWord(true); // Reset isValidWord to true before checking

        if (key === 'Enter') {
            if (turn > 5) {
                console.log('Already guessed 6 times.');
                return;
            }
            if (history.includes(currentGuess)) {
                console.log('Word has already been used');
                return;
            }
            if (currentGuess.length !== 5) {
                console.log('No more than 5 letters');
                return;
            }

            const data = await checkDatabase(currentGuess, boardID);

            if (!data.isValidWord) {
                console.log('Word is not in list');
                setIsValidWord(false); // Set isValidWord to false for invalid word
                setMessage('Word is not in list'); // Set toast message
                setShowToast(true); // Display the toast
                return;
            }

            addNewGuess();
        } else if (key === 'Backspace') {
            setCurrentGuess((prev) => prev.slice(0, -1));
        } else if (/^[A-Za-z]$/.test(key)) {
            if (currentGuess.length < 5) {
                setCurrentGuess((prev) => prev + key);
            }
        }
    }, [turn, currentGuess, history, addNewGuess, boardID, setIsValidWord, setMessage, setShowToast]);

    const handleKeyup = useCallback((event) => {
        handleKeyInput(event.key);
    }, [handleKeyInput]);

    return {
        turn,
        currentGuess,
        guesses,
        isCorrect,
        usedKeys,
        handleKeyup,
        handleKeyInput,
        addNewGuess,
        formatGuess,
        setGuesses,
        setHistory,
        setTurn,
        setIsCorrect,
        setUsedKeys,
        setIsValidWord,
        isValidWord,
        message,
        setMessage,
        showToast,
        setShowToast
    };
};

export default getGuess;
