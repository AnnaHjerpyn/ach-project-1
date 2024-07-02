import React, { useContext } from 'react';
import '../../css/src/Components/_modal.scss';
import { useTheme } from '../../../../src/ThemeContext';
import icon from "../../../../public/assets/favicon/32px-Wordle_Logo-v3.svg.png";

const ModalStats = ({ isOpen, onClose, onRestart }) => {
    const { isDarkMode } = useTheme();

    if (!isOpen) return null;

    return (
        <div className={`modal ${isDarkMode ? 'dark-theme' : ''}`}>
            <div className={`modal-content ${isDarkMode ? 'dark-theme-content' : ''}`}>
                <button className={`close-button ${isDarkMode ? 'dark-theme-close' : ''}`} onClick={onClose}>
                    &times;
                </button>
                {/*<img src={icon} alt="Icon" className="icon"/>*}*/}
                <h2>Wordle</h2>
                <button className={`restart-button ${isDarkMode ? 'dark-theme-button' : ''}`} onClick={onRestart}>
                    Restart
                </button>
            </div>
        </div>
    );
};

export default ModalStats;
