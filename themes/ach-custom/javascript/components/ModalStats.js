import React from 'react';
import '../../css/src/Components/_modal.scss';

const ModalStats = ({isOpen, onClose, onRestart, stats}) => {
    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    &times;
                </button>
                <h2>Wordle</h2>
                {/*<div className="stats">*/}
                {/*    <p>Correct Word: {stats.correctWord}</p>*/}
                {/*    <p>Total Guesses: {stats.totalGuesses}</p>*/}
                {/*    <p>Correct Guesses: {stats.correctGuesses}</p>*/}
                {/*</div>*/}
                {/*<div className="guess-distribution">*/}

                {/*</div>*/}
                <button className="shareButton" onClick={onRestart}>
                    Restart
                </button>
            </div>
        </div>
    );
};

export default ModalStats;
