import React, { useState, useEffect } from 'react';
import '../themes/ach-custom/css/src/Components/_app.scss';
import { createRoot } from 'react-dom/client';
import Board from '../themes/ach-custom/javascript/components/Board';
import ThemeToggle from './ThemeToggle';
import { ThemeProvider } from './ThemeContext';
import RestartModal from "../themes/ach-custom/javascript/components/RestartModal";

const root = createRoot(document.getElementById('root'));

function App() {
    const [solution, setSolution] = useState('');
    const [boardID, setBoardID] = useState('');
    const [showRestartModal, setShowRestartModal] = useState(false);

    const fetchBoard = async () => {
        let boardID = sessionStorage.getItem('boardID');
        console.log('Current boardID from URL:', boardID);

        if (!boardID) {
            const response = await fetch('/home/board', { method: 'POST' });
            if (response.ok) {
                const data = await response.json();
                sessionStorage.setItem('boardID', data.boardID);
                console.log('New board created with ID:', data.boardID);
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
        setSolution('');
        setBoardID('');
        setShowRestartModal(false);
        await fetchBoard();
    };

    const handleRestartClick = () => {
        if (solution !== '') {
            setShowRestartModal(true);
        } else {
            handleRestart();
        }
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
                <Board boardID={boardID} onRestart={handleRestartClick} />

                {showRestartModal && (
                    <RestartModal
                        message="Do you want to start a new game?"
                        onConfirm={handleRestart}
                        onCancel={() => setShowRestartModal(false)}
                    />
                )}
            </div>
        </ThemeProvider>
    );
}

export default App;
