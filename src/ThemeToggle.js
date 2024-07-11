import React from 'react';
import {useTheme} from './ThemeContext';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMoon, faSun} from '@fortawesome/free-solid-svg-icons';


const ThemeToggle = () => {
    const {isDarkMode, toggleTheme} = useTheme();

    if (isDarkMode) {
        return (
            <FontAwesomeIcon
                icon={faSun}
                onClick={toggleTheme}
                style={{
                    cursor: 'pointer',
                    color: isDarkMode ? 'white' : 'black',
                    width: '32px',
                    height: '32px'
                }}
            />
        );
    } else {
        return (
            <FontAwesomeIcon
                icon={faMoon}
                onClick={toggleTheme}
                style={{
                    cursor: 'pointer',
                    color: isDarkMode ? 'white' : 'black',
                    width: '32px',
                    height: '32px'
                }}
            />
        );
    }
};

export default ThemeToggle;
