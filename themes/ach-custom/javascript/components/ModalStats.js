import React from 'react';

const ModalStats = ({isOpen, onClose, stats}) => {
    if (!isOpen) return null;

    return (
        <div className="modal fade">
            <div className="modal-dialog">
                <div className="modal-content">
                    <h2>Game Statistics</h2>
                    <p>Correct Word: {stats.correctWord}</p>
                    <p>Total Guesses: {stats.totalGuesses}</p>
                    <p>Correct Guesses: {stats.correctGuesses}</p>
                    <div className="modal-footer">
                        <button onClick={onClose} type="button" className="btn btn-secondary"
                                data-bs-dismiss="modal">Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalStats;
