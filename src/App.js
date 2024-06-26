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
    const [showRestartModal, setShowRestartModal] = useState(false);
    const [gameState, setGameState] = useState(null);
    const [welcomeMessage, setWelcomeMessage] = useState('Great job on the puzzle! Do you want to start a new game?');
    const [buttonText, setButtonText] = useState('Restart Game');

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
                if (data.finished) { // Game is seen as solved or finished
                    setShowRestartModal(true);
                }
                setSolution(data.solution);
                setBoardID(data.boardID);
            } else {
                console.error('Failed to fetch board');
            }
        }
    };

    const handleRestart = async () => {
        sessionStorage.removeItem('boardID');
        sessionStorage.removeItem('gameState');
        setSolution('');
        setBoardID('');
        setShowRestartModal(false);
        await fetchBoard();
    };

    useEffect(() => {
        fetchBoard();
        const savedGameState = sessionStorage.getItem('gameState');
        if (savedGameState) {
            const gameStateObj = JSON.parse(savedGameState);
            setGameState(gameStateObj);
            setWelcomeMessage(`Welcome back! You have used ${gameStateObj.guesses.length} out of 6 guesses.`);
            setButtonText('Continue');
            setShowRestartModal(true);
        }
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
                <Board boardID={boardID} onRestart={handleRestart} />

                {showRestartModal && (
                    <WelcomeModal
                        message={welcomeMessage}
                        onConfirm={handleRestart}
                        onCancel={() => setShowRestartModal(false)}
                        buttonText={buttonText}
                    />
                )}
            </div>
        </ThemeProvider>
    );
}

export default App;
