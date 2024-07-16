import React from 'react';
import {useTheme} from '../../../../src/ThemeContext';
import icon from "../../../../public/assets/favicon/32px-Wordle_Logo-v3.svg.png";
import '../../css/src/Components/_modal.scss';

const ModalStats = ({isOpen, onClose, onRestart, isCorrect}) => {
    const {isDarkMode} = useTheme();

    if (!isOpen) return null;

    if (isCorrect) {
        return (
            <div className={`modal ${isDarkMode ? 'dark-theme' : ''}`} data-theme={isDarkMode ? 'dark' : 'light'}>
                <div className={`modal-content ${isDarkMode ? 'dark-theme-content' : ''}`}
                     data-theme={isDarkMode ? 'dark' : 'light'}>
                    <button className={`close-button ${isDarkMode ? 'dark-theme-close' : ''}`} onClick={onClose}>
                        &times;
                    </button>
                    <img src={icon} alt="Icon" className="icon"/>
                    <h1>Congratulations!</h1>
                    <p>You guessed the word</p>
                    <button className={`restart-button ${isDarkMode ? 'dark-theme-button' : ''}`} onClick={onRestart}>
                        Restart
                    </button>
                </div>
            </div>
        );
    } else {
        return (
            <div className={`modal ${isDarkMode ? 'dark-theme' : ''}`} data-theme={isDarkMode ? 'dark' : 'light'}>
                <div className={`modal-content ${isDarkMode ? 'dark-theme-content' : ''}`}
                     data-theme={isDarkMode ? 'dark' : 'light'}>
                    <button className={`close-button ${isDarkMode ? 'dark-theme-close' : ''}`} data-theme={isDarkMode ? 'dark' : 'light'} onClick={onClose}>
                        &times;
                    </button>
                    <img src={icon} alt="Icon" className="icon"/>
                    <h1>Almost had it!</h1>
                    <p>The word was: </p>
                    <button className={`restart-button ${isDarkMode ? 'dark-theme-button' : ''}`} onClick={onRestart}>
                        Restart
                    </button>
                </div>
            </div>
        );
    }
};

export default ModalStats;
