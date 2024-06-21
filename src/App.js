import React, { useState, useEffect } from 'react';
import '../themes/ach-custom/css/src/Components/_app.scss';
import { createRoot } from 'react-dom/client';
import Board from '../themes/ach-custom/javascript/components/Board';
import ThemeToggle from './ThemeToggle';
import { ThemeProvider } from './ThemeContext';
import ModalStats from '../themes/ach-custom/javascript/components/ModalStats';

const root = createRoot(document.getElementById('root'));

function App() {
    const [solution, setSolution] = useState('');
    const [boardID, setBoardID] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [gameStats, setGameStats] = useState({});

    useEffect(() => {
        async function fetchBoard() {
            let boardID = sessionStorage.getItem('boardID');
            console.log('Current boardID from URL:', boardID);

            if (!boardID) {
                const response = await fetch('/home/board', {
                    method: 'POST',
                });
                if (!response.ok) {
                    console.error('Failed to create a new board');
                    // Handle error state or feedback to the user
                    return;
                }
                const data = await response.json();
                sessionStorage.setItem('boardID', data.boardID);
                console.log('New board created with ID:', data.boardID);
                setSolution(data.solution);
                setBoardID(data.boardID);
            } else {
                const response = await fetch(`/home/getBoard/${boardID}`);
                if (!response.ok) {
                    console.error('Failed to fetch board');
                    // Handle error state or feedback to the user
                    return;
                }
                const data = await response.json();
                console.log('Fetched board data:', data);
                if (data.finished) {
                    setGameStats({
                        correctWord: data.correctWord,
                        totalGuesses: data.totalGuesses,
                        correctGuesses: data.correctGuesses,
                    });
                    setShowModal(true);
                    // TODO: Handle starting a new game if needed
                    //newGame(data.boardID);
                }
                setSolution(data.solution);
                setBoardID(data.boardID);
            }
        }

        function newGame(boardID) {
            sessionStorage.removeItem('boardID');
            setBoardID('');
            setSolution('');
            fetchBoard();
        }

        fetchBoard();
    }, []);

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <ThemeProvider>
            <div className="App">
                <h1>Wordle</h1>
                <ThemeToggle />
                <h1>Board ID: {boardID}</h1>
                <Board solution={solution} boardID={boardID} />
                {showModal && <ModalStats isOpen={showModal} stats={gameStats} onClose={closeModal} />}
            </div>
        </ThemeProvider>
    );
}

export default App;
