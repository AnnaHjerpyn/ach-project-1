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
            const errorData = await response.json();
            const errorMessage = errorData.error || 'Failed to update statistics';
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating statistics:', error.message || error);
        throw error;
    }
};
