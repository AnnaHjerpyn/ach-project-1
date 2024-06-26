import React, { useContext } from 'react';
import '../../css/src/Components/_modal.scss';
import { useTheme } from '../../../../src/ThemeContext';

const ModalStats = ({ isOpen, onClose, onRestart, stats }) => {
    const { isDarkMode } = useTheme();

    if (!isOpen) return null;

    return (
        <div className={`modal ${isDarkMode ? 'dark-theme' : ''}`}>
            <div className={`modal-content ${isDarkMode ? 'dark-theme-content' : ''}`}>
                <button className={`close-button ${isDarkMode ? 'dark-theme-close' : ''}`} onClick={onClose}>
                    &times;
                </button>
                <h2>Congratulations</h2>
                {/* <div className="stats">
                    <p>Correct Word: {stats.correctWord}</p>
                    <p>Total Guesses: {stats.totalGuesses}</p>
                    <p>Correct Guesses: {stats.correctGuesses}</p>
                </div>
                <div className="guess-distribution">
                    {stats.guesses.map((guess, index) => (
                        <div key={index} className="guess-bar">
                            <span className="guess-label">{index + 1}</span>
                            <div className="guess-fill" style={{ width: `${guess}%` }}>
                                <span className="guess-count">{guess}</span>
                            </div>
                        </div>
                    ))}
                </div> */}
                <button className={`restart-button ${isDarkMode ? 'dark-theme-button' : ''}`} onClick={onRestart}>
                    Restart
                </button>
            </div>
        </div>
    );
};

export default ModalStats;
