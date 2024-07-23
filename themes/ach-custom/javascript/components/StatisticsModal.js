import React from 'react';
import { useTheme } from '../../../../src/ThemeContext';
import '../../css/src/Components/_modal.scss';
import '../../css/src/Components/_help.scss';

const StatisticsModal = ({ isOpen, onClose, statistics }) => {
    const { isDarkMode } = useTheme();

    if (!isOpen) return null;

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
                            <span className="statistics-label">Games Played:</span>
                            <span className="statistics-value">{statistics.totalGamesPlayed}</span>
                        </li>
                        <li className="statistics-item">
                            <span className="statistics-label">Total Wins:</span>
                            <span className="statistics-value">{statistics.totalWins}</span>
                        </li>
                        <li className="statistics-item">
                            <span className="statistics-label">Win %:</span>
                            <span className="statistics-value">{statistics.winPercentage}%</span>
                        </li>
                        <li className="statistics-item">
                            <span className="statistics-label">Current Streak:</span>
                            <span className="statistics-value">{statistics.currentStreak}</span>
                        </li>
                        <li className="statistics-item">
                            <span className="statistics-label">Max Streak:</span>
                            <span className="statistics-value">{statistics.maxStreak}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default StatisticsModal;
