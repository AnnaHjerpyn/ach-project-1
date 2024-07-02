import React, {useState} from 'react';
import '../../css/src/Components/_welcome.scss';
import icon from '../../../../public/assets/favicon/32px-Wordle_Logo-v3.svg.png';

const WelcomeModal = ({onConfirm, onCancel, finishedGame, totalGuesses}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [message, setMessage] = useState('');
    const [buttonText, setButtonText] = useState('');

    // Restart button handler
    const handleConfirm = () => {
        setIsVisible(false);
        setTimeout(onConfirm, 1000);
    };

    // Cancel button handler
    const handleCancel = () => {
        setIsVisible(false);
        setTimeout(onCancel, 1000);
    };

    const renderModalContent = () => {

        // Handles when the game is finished
        if (finishedGame) {
            setMessage("Great job on the puzzle! Do you want to play again?")
            setButtonText("Restart")
        } else {
            setMessage(`You've made ${totalGuesses} of 6 guesses. Keep it up!`)
            setButtonText("Continue")
        }

        return (
            <div className={`contentWelcome ${!isVisible ? 'fade-out' : ''}`}>
                <div className="contentWelcomeContainer">
                    <div className="contentWelcomeMain">
                        <img src={icon} alt="Icon" className="icon"/>
                        <div className="title">Hi Wordler</div>
                        <div className="subtitle">{message}</div>
                        <div className="buttonContainer">
                            <button className="button" onClick={handleConfirm}>{buttonText}</button>
                            {finishedGame &&
                                <button className="button secondary" onClick={handleCancel}>Cancel</button>}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return renderModalContent();
};

export default WelcomeModal;
