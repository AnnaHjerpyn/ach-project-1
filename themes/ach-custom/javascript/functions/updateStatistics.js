export const updateUserStatistics = async (statistics) => {
    try {
        const response = await fetch('/statistic/updateUserStatistics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(statistics),
        });

        if (!response.ok) {
            throw new Error('Failed to update statistics');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating statistics:', error);
        throw error;
    }
};
