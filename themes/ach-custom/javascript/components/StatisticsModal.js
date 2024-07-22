import React from 'react';
import {useTheme} from '../../../../src/ThemeContext';
import '../../css/src/Components/_modal.scss';
import '../../css/src/Components/_help.scss';


const StatisticsModal = ({isOpen, onClose}) => {
    const {isDarkMode} = useTheme();

    if (!isOpen) return null;

    return (
        <div className={`modal ${isDarkMode ? 'dark-theme' : ''}`} data-theme={isDarkMode ? 'dark' : 'light'}>
            <div className={`modal-content ${isDarkMode ? 'dark-theme-content' : ''}`}
                 data-theme={isDarkMode ? 'dark' : 'light'}>
                <button className={`close-button ${isDarkMode ? 'dark-theme-close' : ''}`} onClick={onClose}>
                    &times;
                </button>
                <h2>Statistics</h2>
            </div>
        </div>
    );
};

export default StatisticsModal;
