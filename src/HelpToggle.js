import React, {useState} from 'react';
import {useTheme} from './ThemeContext';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faQuestionCircle} from '@fortawesome/free-solid-svg-icons';
import HTPModal from "../themes/ach-custom/javascript/components/HTPModal";


const HelpToggle = () => {

    const {isDarkMode} = useTheme();
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <>
            <FontAwesomeIcon
                icon={faQuestionCircle}
                onClick={handleOpen}
                style={{
                    cursor: 'pointer',
                    color: isDarkMode ? 'white' : 'black',
                    width: '32px',
                    height: '32px'
                }}
            />

            <HTPModal isOpen={open} onClose={handleClose}/>
        </>
    );

};

export default HelpToggle;
