import React, { useEffect, useState } from 'react';
import '../themes/ach-custom/css/src/Components/_app.scss';
import Board from '../themes/ach-custom/javascript/components/Board';
import ThemeToggle from './ThemeToggle';
import { ThemeProvider } from './ThemeContext';
import WelcomeModal from '../themes/ach-custom/javascript/components/WelcomeModal';
import HelpToggle from './HelpToggle';
import StatsToggle from './StatsToggle';
import LoginModal from '../themes/ach-custom/javascript/components/LoginModal';
import LoginToggle from "./LoginToggle";

function App() {
    const [boardID, setBoardID] = useState('');
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);
    const [finishedGame, setFinishedGame] = useState(false);
    const [totalGuesses, setTotalGuesses] = useState(0);
    const [gameKey, setGameKey] = useState(0);
    const [userStatistics, setUserStatistics] = useState({});
    const [userID, setUserID] = useState(0);
    const [showLoginModal, setShowLoginModal] = useState(false); // State for login modal

    const fetchBoard = async () => {
        let boardID = sessionStorage.getItem('boardID');

        if (!boardID) {
            const response = await fetch('/home/board', { method: 'POST' });
            if (response.ok) {
                const data = await response.json();
                sessionStorage.setItem('boardID', data.boardID);
                setBoardID(data.boardID);
            } else {
                console.error('Failed to create a new board');
            }
        } else {
            const response = await fetch(`/home/getBoard/${boardID}`);
            if (response.ok) {
                const data = await response.json();
                if (data.finished) {
                    setFinishedGame(true);
                }
                setShowWelcomeModal(true);
                setTotalGuesses(data.guesses.length);
                setBoardID(data.boardID);
            } else {
                console.error('Failed to fetch board');
            }
        }
    };

    const fetchUserStatistics = async () => {
        let userID = sessionStorage.getItem('userID');

        if (!userID) {
            const response = await fetch('/statistic/statistics', { method: 'POST' });
            if (response.ok) {
                const data = await response.json();
                sessionStorage.setItem('userID', data.userID);
                setUserID(data.userID);
                setUserStatistics(data);
            } else {
                console.error('Failed to create a new board');
            }
        } else {
            const response = await fetch('/statistic/statistics');
            if (response.ok) {
                const data = await response.json();
                setUserStatistics(data);
            } else {
                console.error('Failed to fetch the user\'s statistics.');
            }
        }
    };

    const handleRestart = async () => {
        sessionStorage.removeItem('boardID');
        setBoardID('');
        setShowWelcomeModal(false);
        setFinishedGame(false);
        setGameKey(prevKey => prevKey + 1);
        await fetchBoard();
        await fetchUserStatistics();
    };

    const handleLogin = () => {
        setShowLoginModal(false); // Close the login modal
        fetchUserStatistics(); // Fetch user statistics after login
    };

    useEffect(() => {
        fetchBoard();
        fetchUserStatistics();
    }, []);

    return (
        <ThemeProvider>
            {showWelcomeModal && (
                <WelcomeModal
                    onConfirm={handleRestart}
                    onRestart={handleRestart}
                    onCancel={() => setShowWelcomeModal(false)}
                    totalGuesses={totalGuesses}
                    finishedGame={finishedGame}
                />
            )}
            {showLoginModal && (
                <LoginModal
                    isOpen={showLoginModal}
                    onClose={() => setShowLoginModal(false)}
                    onLogin={handleLogin}
                />
            )}
            <div className="App">
                <nav className="navbar navbar-expand-sm fixed-top">
                    <div className="container-fluid">
                        <div className="spacer"></div>
                        <h1>Wordle</h1>
                        <div className="toggles">
                            <ThemeToggle />
                            <StatsToggle userStatistics={userStatistics} />
                            <HelpToggle />
                            <LoginToggle onLogin={handleLogin} />
                        </div>
                    </div>
                </nav>
                <Board key={gameKey} boardID={boardID} onRestart={handleRestart} />
            </div>
        </ThemeProvider>
    );
}

export default App;
