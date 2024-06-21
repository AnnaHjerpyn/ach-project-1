import React from 'react';
import '../../css/src/Components/_modal.scss';

const ModalStats = ({ isOpen, onClose, stats }) => {
    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Game Statistics</h2>
                <p>Correct Word: {stats.correctWord}</p>
                <p>Total Guesses: {stats.totalGuesses}</p>
                <p>Correct Guesses: {stats.correctGuesses}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default ModalStats;
