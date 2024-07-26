async function updateBoardWithGuess(boardID, newGuess) {
    try {
        const response = await fetch(`/home/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({boardID, newGuess})
        });

        if (!response.ok) {
            throw new Error('Failed to update board.');
        }

        return await response.json(); // or handle response as needed
    } catch (error) {
        throw new Error(error.message);
    }
}

async function checkDatabase(currentGuess, boardID) {
    const response = await fetch('/home/check', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({Word: currentGuess, BoardID: boardID})
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to check.');
    }
    return data;
}

async function updateUserStatistics(win, turns) {
    const response = await fetch('/statistic/updateUserStatistics', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({win: win, turns: turns}),
    });

    if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Failed to update statistics';
        throw new Error(errorMessage);
    }
    return await response.json();
}


export {checkDatabase, updateBoardWithGuess, updateUserStatistics}
