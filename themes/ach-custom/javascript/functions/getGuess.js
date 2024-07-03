import {useCallback, useState} from 'react';
import {checkDatabase, updateBoardWithGuess} from "../wordSubmit";

const getGuess = (solution, boardID) => {

    const [inKeypad, setKeypad] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [turn, setTurn] = useState(0);
    const [isCorrect, setIsCorrect] = useState(false);
    const [currentGuess, setCurrentGuess] = useState('');
    const [guesses, setGuesses] = useState([...Array(6)].map(() => [])); // each guess is an array of objects {key, color}
    const [history, setHistory] = useState([]); // array of strings
    const [usedKeys, setUsedKeys] = useState({}); // {a: 'grey', b: 'green', c: 'yellow'} etc
    const [isValidWord, setIsValidWord] = useState(true); // Initial state for isValidWord
    const [message, setMessage] = useState(''); // Sets the toast's message for user
    const [showToast, setShowToast] = useState(false); // Handles showing the toast message
    const [showModal, setShowModal] = useState(false); // Show Modal based on if the guess is correct

    const formatGuess = useCallback(() => {
        let formattedGuess = [...currentGuess].map((letter, i) => {
            let color = 'grey';

            // Check if the letter is in the correct position
            if (letter === solution[i]) {
                color = 'green';
            } else if (solution.includes(letter)) {
                // Check if the letter exists in solution but is not in the correct position
                color = 'yellow';
            }

            // Check if the letter has already been marked as green in previous turns
            for (let j = 0; j < turn; j++) {
                if (guesses[j][i]?.key === letter && guesses[j][i]?.color === 'green') {
                    color = 'green';
                    break;
                }
            }

            return { key: letter, color };
        });

        return formattedGuess;
    }, [currentGuess, solution, turn, guesses]);

    const addNewGuess = useCallback(async () => {
        const isWinningGuess = currentGuess === solution;
        const formattedGuess = formatGuess();

        if (isWinningGuess) {
            setIsCorrect(true);
            setTimeout(() => setShowModal(true), 2500)
            setGameOver(true);
            return;
        }

        if (turn === 5 && !isCorrect) {
            setTimeout(() => setShowModal(true), 2500)
            setMessage(solution);
            setShowToast(true);
        }

        setGuesses((prevGuesses) => {
            let newGuesses = [...prevGuesses];
            newGuesses[turn] = formattedGuess;
            return newGuesses;
        });

        setHistory((prevHistory) => [...prevHistory, currentGuess]);
        setTurn((prevTurn) => prevTurn + 1);

        setUsedKeys((prevUsedKeys) => {
            let newUsedKeys = { ...prevUsedKeys };
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
    }, [currentGuess, turn, solution, formatGuess, isCorrect]);

    const handleKeyInput = useCallback(async (key) => {
        if (key === 'Enter') {
            if (turn > 5) {
                setIsValidWord(false);
                setMessage('Already guessed 6 times.'); // Set toast message
                setShowToast(true); // Display the toast
                return;
            }
            if (history.includes(currentGuess)) {
                setIsValidWord(false);
                setMessage('Word has already been used'); // Set toast message
                setShowToast(true); // Display the toast
                return;
            }
            if (currentGuess.length !== 5) {
                setIsValidWord(false);
                setMessage('Not enough letters'); // Set toast message
                setShowToast(true); // Display the toast
                return;
            }

            const data = await checkDatabase(currentGuess, boardID);

            if (!data.isValidWord) {
                setIsValidWord(false); // Set isValidWord to false for invalid word
                setMessage('Word is not in list'); // Set toast message
                setShowToast(true); // Display the toast
                return;
            } else if (data.isValidWord && !inKeypad) {
                setIsValidWord(true);
                await updateBoardWithGuess(boardID, currentGuess);
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
        setKeypad(true);
        handleKeyInput(event.key);
    }, [handleKeyInput]);

    return {
        turn,
        currentGuess,
        guesses,
        setIsCorrect,
        isCorrect,
        usedKeys,
        handleKeyup,
        handleKeyInput,
        addNewGuess,
        formatGuess,
        setGuesses,
        setHistory,
        setTurn,
        setUsedKeys,
        setIsValidWord,
        isValidWord,
        message,
        setMessage,
        showToast,
        setShowToast,
        setShowModal,
        showModal,
        gameOver,
    };
};

export default getGuess;
