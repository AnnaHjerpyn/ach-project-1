import React, { useState } from 'react';
import '../../css/src/Components/_welcome.scss';
import icon from '../../../../public/assets/favicon/32px-Wordle_Logo-v3.svg.png';

const WelcomeModal = ({ message, onConfirm, onCancel, buttonText }) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleConfirm = () => {
        setIsVisible(false);
        setTimeout(onConfirm, 1000);
    };

    const handleCancel = () => {
        setIsVisible(false);
        setTimeout(onCancel, 1000);
    };

    return (
        <div className={`contentWelcome ${!isVisible ? 'fade-out' : ''}`}>
            <div className="contentWelcomeContainer">
                <div className="contentWelcomeMain">
                    <img src={icon} alt="Icon" className="icon" />
                    <div className="title">Hi Wordler</div>
                    <div className="subtitle">{message}</div>
                    <div className="buttonContainer">
                        <button className="button" onClick={handleConfirm}>{buttonText}</button>
                        <button className="button secondary" onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeModal;
