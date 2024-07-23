import React, { useState } from 'react';
import { useTheme } from '../../../../src/ThemeContext';
import '../../css/src/Components/_modal.scss';
import '../../css/src/Components/_login.scss';

const LoginModal = ({ isOpen, onClose, onLogin }) => {
    const { isDarkMode } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    if (!isOpen) return null;

    const handleLogin = async () => {
        try {
            const response = await fetch('/home/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                onLogin(); // Notify parent component to fetch stats after successful login
            } else {
                // Handle login errors
                alert('Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <div className={`modal ${isDarkMode ? 'dark-theme' : ''}`} data-theme={isDarkMode ? 'dark' : 'light'}>
            <div className={`modal-content ${isDarkMode ? 'dark-theme-content' : ''}`} data-theme={isDarkMode ? 'dark' : 'light'}>
                <button className={`close-button ${isDarkMode ? 'dark-theme-close' : ''}`} onClick={onClose}>
                    &times;
                </button>
                <h2>Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin}>Login</button>
            </div>
        </div>
    );
};

export default LoginModal;
