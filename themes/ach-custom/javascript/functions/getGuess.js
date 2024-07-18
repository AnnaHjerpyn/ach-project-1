import { useCallback, useState } from 'react';
import { checkDatabase, updateBoardWithGuess } from "./wordSubmit";

const getGuess = (boardID) => {
    const [inKeypad, setKeypad] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [turn, setTurn] = useState(0);
    const [isCorrect, setIsCorrect] = useState(false);
    const [currentGuess, setCurrentGuess] = useState('');
    const [guesses, setGuesses] = useState([...Array(6)].map(() => []));
    const [history, setHistory] = useState([]);
    const [usedKeys, setUsedKeys] = useState({});
    const [isValidWord, setIsValidWord] = useState(true);
    const [message, setMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const fetchFormattedGuess = useCallback(async () => {
        try {
            const response = await fetch('/home/format', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    BoardID: boardID,            // Send board ID so it can compare to solution
                    currentGuess: currentGuess   // Send the current guess to be formatted
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data.formattedGuess;
        } catch (error) {
            console.error('Error fetching formatted guess:', error);
            return []; // Return empty array !!
        }
    }, [boardID, currentGuess]);

    const addNewGuess = useCallback(async () => {
        const data = await checkDatabase(currentGuess, boardID);

        const formattedGuess = await fetchFormattedGuess();

        if (data.isCorrect) {
            setIsCorrect(true);
            setTimeout(() => setShowModal(true), 2500)
            setGameOver(true);
            return;
        }

        if (turn === 5 && !isCorrect) {
            setTimeout(() => setShowModal(true), 2500)
            setMessage(data.message);
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

        setCurrentGuess(''); // Clears the current guess

    }, [currentGuess, turn, fetchFormattedGuess, isCorrect, boardID]);

    const handleKeyInput = useCallback(async (key) => {
        // Handle key input logic
        if (key === 'Enter') {
            // Check the database with current guess
            const data = await checkDatabase(currentGuess, boardID);

            if (history.includes(currentGuess.toLowerCase())){
                setIsValidWord(false);
                setMessage("Word has already been used");
                setShowToast(true);
                return;
            }

            if (!data.isValidWord || turn > 5) {
                setIsValidWord(false);
                setMessage(data.message);
                setShowToast(true);
                return;
            } else if (data.isValidWord && !inKeypad) {
                setIsValidWord(true);
                await updateBoardWithGuess(boardID, currentGuess);
            }

            addNewGuess(); // Adds a guess if it makes through the validation !

        } else if (key === 'Backspace') {
            // Removes the current guess letters when user presses 'Backspace'
            setCurrentGuess((prev) => prev.slice(0, -1));
        } else if (/^[A-Za-z]$/.test(key)) {
            // As the user enters in letters, adds to the current guess until length of 5
            if (currentGuess.length < 5) {
                setCurrentGuess((prev) => prev + key);
            }
        }
    }, [turn, currentGuess, history, addNewGuess, boardID, setIsValidWord, setMessage, setShowToast, inKeypad]);

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
        fetchFormattedGuess
    };
};

export default getGuess;
