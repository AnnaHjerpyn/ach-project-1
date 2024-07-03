import React, { useState, useEffect } from 'react';
import '../themes/ach-custom/css/src/Components/_app.scss';
import { createRoot } from 'react-dom/client';
import Board from '../themes/ach-custom/javascript/components/Board';
import ThemeToggle from './ThemeToggle';
import { ThemeProvider } from './ThemeContext';
import WelcomeModal from "../themes/ach-custom/javascript/components/WelcomeModal";

const root = createRoot(document.getElementById('root'));

function App() {
    const [solution, setSolution] = useState('');
    const [boardID, setBoardID] = useState('');
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);
    const [finishedGame, setFinishedGame] = useState(false);
    const [totalGuesses, setTotalGuesses] = useState(0);
    const [gameKey, setGameKey] = useState(0);

    const fetchBoard = async () => {
        let boardID = sessionStorage.getItem('boardID');

        if (!boardID) {
            const response = await fetch('/home/board', { method: 'POST' });
            if (response.ok) {
                const data = await response.json();
                sessionStorage.setItem('boardID', data.boardID);
                setSolution(data.solution);
                setBoardID(data.boardID);
            } else {
                console.error('Failed to create a new board');
            }
        } else {
            const response = await fetch(`/home/getBoard/${boardID}`);
            if (response.ok) {
                const data = await response.json();
                console.log('Fetched board data:', data);
                if (data.finished) {
                    setFinishedGame(true);
                }
                setShowWelcomeModal(true);
                setTotalGuesses(data.guesses.length);
                setSolution(data.solution);
                setBoardID(data.boardID);
            } else {
                console.error('Failed to fetch board');
            }
        }
    };

    const handleRestart = async () => {
        sessionStorage.removeItem('boardID');
        setSolution('');
        setBoardID('');
        setShowWelcomeModal(false);
        setGameKey(prevKey => prevKey + 1);
        await fetchBoard();
    };

    useEffect(() => {
        fetchBoard();
    }, []);

    return (
        <ThemeProvider>
            <div className="App">
                <nav className="navbar navbar-expand-sm fixed-top">
                    <div className="container-fluid">
                        <div className="spacer"></div>
                        <h1>Wordle</h1>
                        <ThemeToggle />
                    </div>
                </nav>
                <Board key={gameKey} boardID={boardID} onRestart={handleRestart} />

                {showWelcomeModal && (
                    <WelcomeModal
                        onConfirm={handleRestart}
                        onCancel={() => setShowWelcomeModal(false)}
                        totalGuesses={totalGuesses}
                        finishedGame={finishedGame}
                    />
                )}
            </div>
        </ThemeProvider>
    );
}

export default App;
