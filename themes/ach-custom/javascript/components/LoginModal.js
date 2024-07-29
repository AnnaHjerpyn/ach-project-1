import React, {useState} from 'react';
import {useTheme} from '../../../../src/ThemeContext';
import '../../css/src/Components/_modal.scss';
import '../../css/src/Components/_login.scss';

const LoginModal = ({isOpen, onClose, onLogin}) => {
    const {isDarkMode} = useTheme();
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [remember, setRemember] = useState(false);
    const [isLoginMode, setIsLoginMode] = useState(true);

    if (!isOpen) return null;

    const handleLogin = async () => {
        try {
            const response = await fetch('/login/doLogin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    login_email: email,
                    login_password: password1,
                    remember: remember,
                }),
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
            const response = await fetch('/login/doRegister', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    register_email: email,
                    register_password1: password1,
                    register_password2: password2,
                }),
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
            <div className={`modal-content ${isDarkMode ? 'dark-theme-content' : ''}`}
                 data-theme={isDarkMode ? 'dark' : 'light'}>
                <button className={`close-button ${isDarkMode ? 'dark-theme-close' : ''}`} onClick={onClose}>
                    &times;
                </button>
                <div className="login-header">{isLoginMode ? 'Login' : 'Create Account'}</div>
                <div className="login-form">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password1}
                        onChange={(e) => setPassword1(e.target.value)}
                    />
                    {!isLoginMode && <input
                        type="password"
                        placeholder="Retype Password"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                    />}
                    <button onClick={isLoginMode ? handleLogin : handleRegister}>
                        {isLoginMode ? 'Login' : 'Create Account'}
                    </button>
                    {isLoginMode && <label>
                        <input type="checkbox" onClick={() => setRemember(!remember)}/> Remember me
                    </label>}
                </div>
                <p>
                    {isLoginMode ? (
                        <span className="login-title">
                            Don't have an account?{' '}
                            <span className="login-button" onClick={() => setIsLoginMode(false)}>
                                Create Account
                            </span>
                        </span>
                    ) : (
                        <span className="login-title">
                            Already have an account?{' '}
                            <span className="login-button" onClick={() => setIsLoginMode(true)}>
                                Login
                            </span>
                        </span>
                    )}
                </p>
            </div>
        </div>
    );
};

export default LoginModal;
