import React from 'react';
import '../../css/src/Components/_modal.scss';

const WelcomeModal = ({message, onConfirm, onCancel}) => {
    return (
        <div className="contentWelcome">
            <div className="contentWelcomeContainer">
                <div className="contentWelcomeMain">
                    <div className="title">
                        Hi Wordler
                    </div>
                    <h2 className="subtitle">
                        {message}
                    </h2>
                    <div className="buttonContainer">
                        <button onClick={onConfirm}>Restart Game</button>
                        <button onClick={onCancel}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeModal;
