import React, {useEffect, useState} from 'react';
import '../../css/src/Components/_welcome.scss';
import icon from '../../../../public/assets/favicon/32px-Wordle_Logo-v3.svg.png';

const WelcomeModal = ({onConfirm, onCancel, finishedGame, totalGuesses, onRestart}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [header, setHeader] = useState('');
    const [message, setMessage] = useState('');
    const [buttonText, setButtonText] = useState('');
    const [gameOver, setGameOver] = useState(false);

    if (finishedGame) { setGameOver(true) } // if i didn't add this it would display the 0 value

    // Restart button handler
    const handleConfirm = () => {
        setIsVisible(false);
        // Restart the game
        if (finishedGame || totalGuesses === 6) {
            setTimeout(onRestart, 1000);
        }
        setTimeout(finishedGame ? onConfirm : onCancel, 1000);
    };

    // Cancel button handler
    const handleCancel = () => {
        setIsVisible(false);
        setTimeout(onCancel, 1000);
    };

    useEffect(() => {
        if (finishedGame || totalGuesses === 6) {
            setHeader('Hi Wordler');
            setMessage('Great job on the puzzle! Do you want to play again?');
            setButtonText('Restart Game');
        } else if (!finishedGame && totalGuesses > 0) {
            setHeader('Welcome Back!');
            setMessage(`You've made ${totalGuesses} of 6 guesses. Keep it up!`);
            setButtonText('Continue');
        } else {
            setHeader('Wordle');
            setMessage(`Get 6 chances to guess a 5-letter word.`);
            setButtonText('Play Game');
        }
    }, [finishedGame, totalGuesses]);

    return (
        <div className={`contentWelcome ${!isVisible ? 'fade-out' : ''}`}>
            <div className="contentWelcomeContainer">
                <div className="contentWelcomeMain">
                    <img src={icon} alt="Icon" className="icon"/>
                    <div className="title">{header}</div>
                    <div className="subtitle">{message}</div>
                    <div className="buttonContainer">
                        <button className="button" onClick={handleConfirm}>{buttonText}</button>
                        {gameOver && (
                            <button className="button secondary" onClick={handleCancel}>Cancel</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeModal;
