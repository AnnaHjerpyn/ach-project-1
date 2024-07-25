import React, { useState } from 'react';
import { useTheme } from './ThemeContext';
import { BarChartFill } from 'react-bootstrap-icons';
import StatisticsModal from "../themes/ach-custom/javascript/components/StatisticsModal";

const StatsToggle = ({userStatistics}) => {
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
            <BarChartFill
                onClick={handleOpen}
                style={{
                    cursor: 'pointer',
                    color: isDarkMode ? 'white' : 'black',
                    width: '32px',
                    height: '32px'
                }}
            />
            <StatisticsModal
                isOpen={open}
                onClose={handleClose}
                statistics={userStatistics}
            />
        </>
    );
};

export default StatsToggle;
