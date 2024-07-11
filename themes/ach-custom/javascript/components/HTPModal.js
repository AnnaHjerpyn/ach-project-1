import React from 'react';
import {useTheme} from '../../../../src/ThemeContext';
import '../../css/src/Components/_modal.scss';
import '../../css/src/Components/_help.scss';


const HTPModal = ({isOpen, onClose}) => {
    const {isDarkMode} = useTheme();

    if (!isOpen) return null;

    return (
        <div className={`modal ${isDarkMode ? 'dark-theme' : ''}`} data-theme={isDarkMode ? 'dark' : 'light'}>
            <div className={`modal-content ${isDarkMode ? 'dark-theme-content' : ''}`}
                 data-theme={isDarkMode ? 'dark' : 'light'}>
                <button className={`close-button ${isDarkMode ? 'dark-theme-close' : ''}`} onClick={onClose}>
                    &times;
                </button>
                <h2>How To Play</h2>
                <div className="subheading">
                    Guess the Wordle in 6 tries.
                </div>
                <section className="help">
                    <ul className="instructions">
                        <li>Each guess must be a valid 5-letter word.</li>
                        <li>The color of the tiles will change to show how close your guess was to the word.</li>
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default HTPModal;
