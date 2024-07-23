import React from 'react';
import { useTheme } from '../../../../src/ThemeContext';
import '../../css/src/Components/_modal.scss';
import '../../css/src/Components/_help.scss';
import icon from '../../../../public/assets/favicon/32px-Wordle_Logo-v3.svg.png';

const StatisticsModal = ({ isOpen, onClose, statistics = {} }) => {
    const { isDarkMode } = useTheme();

    if (!isOpen) return null;

    const guessDistribution = statistics.guessDistribution || [0, 0, 0, 0, 0, 0];

    return (
        <div className={`modal ${isDarkMode ? 'dark-theme' : ''}`} data-theme={isDarkMode ? 'dark' : 'light'}>
            <div className={`modal-content ${isDarkMode ? 'dark-theme-content' : ''}`} data-theme={isDarkMode ? 'dark' : 'light'}>
                <button className={`close-button ${isDarkMode ? 'dark-theme-close' : ''}`} onClick={onClose}>
                    &times;
                </button>
                <div className="statistics-content">
                    <h2 className="statistics-header">Statistics</h2>
                    <ul className="statistics-list">
                        <li className="statistics-item">
                            <span className="statistics-value">{statistics.totalGamesPlayed ?? 'N/A'}</span>
                            <span className="statistics-label">Played</span>
                        </li>
                        <li className="statistics-item">
                            <span className="statistics-value">{statistics.winPercentage ?? 'N/A'}</span>
                            <span className="statistics-label">Win %</span>
                        </li>
                        <li className="statistics-item">
                            <span className="statistics-value">{statistics.currentStreak ?? 'N/A'}</span>
                            <span className="statistics-label">Current Streak</span>
                        </li>
                        <li className="statistics-item">
                            <span className="statistics-value">{statistics.maxStreak ?? 'N/A'}</span>
                            <span className="statistics-label">Max Streak</span>
                        </li>
                    </ul>
                    <h2 className="statistics-header">Guess Distribution</h2>
                    <div className="guess-distribution">
                        {guessDistribution.map((count, index) => (
                            <div className="graph-container" key={index}>
                                <div className="guess">{index + 1}</div>
                                <div className="graph">
                                    <div className="graph-bar" style={{ width: `${count}%` }}>
                                        <div className="num-guesses">{statistics.totalWins}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticsModal;
