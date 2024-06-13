import React from 'react';
import { useTheme } from './ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';

const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <FontAwesomeIcon
            icon={faLightbulb}
            onClick={toggleTheme}
            style={{
                cursor: 'pointer',
                color: isDarkMode ? 'white' : 'black',
                width: '32px',
                height: '32px'
            }}
        />
    );
};

export default ThemeToggle;
