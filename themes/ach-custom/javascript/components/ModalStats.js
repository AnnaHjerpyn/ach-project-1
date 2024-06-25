import PropTypes from 'prop-types';
import React from 'react';
import '../../css/src/Components/_modal.scss';

const ModalStats = ({ isOpen, onClose, stats, onRestart }) => {
    if (!isOpen) return null;

    return (
        <div className="modal fade show" role="dialog" style={{ display: 'block' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Game Statistics</h5>
                        <button type="button" className="close" onClick={onClose}>
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="statistics-section">
                            <div className="stat">
                                <h3>{stats.gamesPlayed}</h3>
                                <p>Played</p>
                            </div>
                            <div className="stat">
                                <h3>{stats.winPercentage}%</h3>
                                <p>Win %</p>
                            </div>
                            <div className="stat">
                                <h3>{stats.currentStreak}</h3>
                                <p>Current Streak</p>
                            </div>
                            <div className="stat">
                                <h3>{stats.maxStreak}</h3>
                                <p>Max Streak</p>
                            </div>
                        </div>
                        <h5>Guess Distribution</h5>
                        <div className="guess-distribution">
                            {stats.guessDistribution.map((count, index) => (
                                <div key={index} className="guess-bar">
                                    <span className="guess-label">{index + 1}</span>
                                    <div className="guess-fill" style={{ width: `${count}%` }}>
                                        <span className="guess-count">{count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={onRestart}>Restart Game</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

ModalStats.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    stats: PropTypes.shape({
        gamesPlayed: PropTypes.number,
        winPercentage: PropTypes.number,
        currentStreak: PropTypes.number,
        maxStreak: PropTypes.number,
        guessDistribution: PropTypes.arrayOf(PropTypes.number),
    }).isRequired,
    onRestart: PropTypes.func.isRequired,
};

export default ModalStats;
