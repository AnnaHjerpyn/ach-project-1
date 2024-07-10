import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    // Need to handle dark and light mode

    useEffect(() => {
        // Theme exists
        const currentTheme = isDarkMode ? 'dark' : 'light';
        document.body.setAttribute('data-theme', currentTheme);
        sessionStorage.setItem('theme', currentTheme);
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
