import React, { useState } from 'react';
import { useTheme } from './ThemeContext';
import { BarChartFill } from 'react-bootstrap-icons';
import StatisticsModal from "../themes/ach-custom/javascript/components/StatisticsModal";

const StatsToggle = () => {
    const { isDarkMode } = useTheme();
    const [open, setOpen] = useState(false);
    const [statistics, setStatistics] = useState({});

    const handleOpen = () => {
        fetch('/statistic/getUserStatistics')
            .then(response => response.json())
            .then(data => {
                setStatistics(data);
                setOpen(true);
            })
            .catch(error => console.error('Failed to fetch user statistics', error));
    }

    const handleClose = () => {
        setOpen(false);
    }

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

            <StatisticsModal isOpen={open} onClose={handleClose} statistics={statistics} />
        </>
    );
};

export default StatsToggle;
