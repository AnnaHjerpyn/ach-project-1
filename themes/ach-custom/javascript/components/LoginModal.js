import React, { useState } from 'react';
import { useTheme } from '../../../../src/ThemeContext';
import '../../css/src/Components/_modal.scss';
import '../../css/src/Components/_login.scss';

const LoginModal = ({ isOpen, onClose, onLogin }) => {
    const { isDarkMode } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginMode, setIsLoginMode] = useState(true);

    if (!isOpen) return null;

    const handleLogin = async () => {
        try {
            const response = await fetch('/home/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Email: email, Password: password }),
            });

            if (response.ok) {
                onLogin();
            } else {
                alert('Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const handleRegister = async () => {
        try {
            const response = await fetch('/home/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Email: email, Password: password }),
            });

            if (response.ok) {
                alert('Registration successful. Please log in.');
                setIsLoginMode(true);
            } else {
                alert('Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Registration error:', error);
        }
    };

    return (
        <div className={`modal ${isDarkMode ? 'dark-theme' : ''}`} data-theme={isDarkMode ? 'dark' : 'light'}>
            <div className={`modal-content ${isDarkMode ? 'dark-theme-content' : ''}`} data-theme={isDarkMode ? 'dark' : 'light'}>
                <button className={`close-button ${isDarkMode ? 'dark-theme-close' : ''}`} onClick={onClose}>
                    &times;
                </button>
                <h2>{isLoginMode ? 'Login' : 'Create Account'}</h2>
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
                <button onClick={isLoginMode ? handleLogin : handleRegister}>
                    {isLoginMode ? 'Login' : 'Create Account'}
                </button>
                <p>
                    {isLoginMode ? (
                        <span>
                            Don't have an account?{' '}
                            <button className="toggle-button" onClick={() => setIsLoginMode(false)}>
                                Create Account
                            </button>
                        </span>
                    ) : (
                        <span>
                            Already have an account?{' '}
                            <button className="toggle-button" onClick={() => setIsLoginMode(true)}>
                                Login
                            </button>
                        </span>
                    )}
                </p>
            </div>
        </div>
    );
};

export default LoginModal;
