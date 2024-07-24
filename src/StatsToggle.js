import React, { useState } from 'react';
import { useTheme } from './ThemeContext';
import { BarChartFill } from 'react-bootstrap-icons';
import StatisticsModal from "../themes/ach-custom/javascript/components/StatisticsModal";

const StatsToggle = () => {
    const { isDarkMode } = useTheme();
    const [open, setOpen] = useState(false);
    const [userStatistics, setUserStatistics] = useState({
        totalGamesPlayed: 0,
        totalWins: 0,
        winPercentage: 0,
        currentStreak: 0,
        maxStreak: 0,
        guessDistribution: [0, 0, 0, 0, 0, 0]
    });

    const handleOpen = () => {
        handleViewStatistics();
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleViewStatistics = () => {
        // Fetch user statistics from the server
        fetch('/statistic/getStatistics')
            .then(response => response.json())
            .then(data => {
                setUserStatistics(data);
                setOpen(true);
            })
            .catch(error => {
                console.error('Failed to fetch user statistics', error);
            });
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
