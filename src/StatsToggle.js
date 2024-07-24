import React, {useState} from 'react';
import {useTheme} from './ThemeContext';
import {BarChartFill} from 'react-bootstrap-icons';
import StatisticsModal from "../themes/ach-custom/javascript/components/StatisticsModal";

const StatsToggle = () => {
    const {isDarkMode} = useTheme();
    const [open, setOpen] = useState(false);
    const [userStatistics, setUserStatistics] = useState({}); // Default to empty object
    const [guessDistribution, setGuessDistribution] = useState({})

    function handleGuessDistribution() {
        fetch('statistic/distribution')
            .then(response => response.json())
            .then(data => {
                setGuessDistribution(data);
            }).catch(error => {
                console.error('Failed to fetch guess distribution', error);
                setGuessDistribution({});
        });
    }


    const handleOpen = () => {
        setOpen(true);
        handleViewStatistics();
        setGuessDistribution([0, 0, 0, 0, 0, 0])
        //handleGuessDistribution();
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleViewStatistics = () => {
        // Fetch user statistics from the server
        fetch('/statistic/getUserStatistics')
            .then(response => response.json())
            .then(data => {
                setUserStatistics(data);
                setOpen(true);
            })
            .catch(error => {
                console.error('Failed to fetch user statistics', error);
                setUserStatistics({});
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
                guessDistribution={guessDistribution}
            />
        </>
    );
};

export default StatsToggle;
