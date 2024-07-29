import React, { useState } from 'react';
import { useTheme } from './ThemeContext';
import LoginModal from '../themes/ach-custom/javascript/components/LoginModal';
import { PersonFill } from 'react-bootstrap-icons';

const LoginToggle = ({ onLogin }) => {
    const { isDarkMode } = useTheme();
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <PersonFill
                onClick={handleOpen}
                style={{
                    cursor: 'pointer',
                    color: isDarkMode ? 'white' : 'black',
                    width: '32px',
                    height: '32px'
                }}
            />
            <LoginModal
                isOpen={open}
                onClose={handleClose}
                onLogin={() => {
                    handleClose();
                    onLogin();
                }}
            />
        </>
    );
};

export default LoginToggle;
