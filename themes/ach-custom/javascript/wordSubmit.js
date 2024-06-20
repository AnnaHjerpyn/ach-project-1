// export async function createBoard() {
//     const response = await fetch('/word-bank/board', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     });
//     const data = await response.json();
//     if (!response.ok) {
//         throw new Error(data.message || 'Failed to create board.');
//     }
//     return data;
// }

export async function checkDatabase(currentGuess, boardID) {
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

// wordSubmit.js

export async function updateBoardWithGuess(boardID, newGuess) {
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

// export async function updateGameState(boardID, gameState) {
//     const response = await fetch(`/word-bank/board/${boardID}`, {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ gameState })
//     });
//     if (!response.ok) {
//         const data = await response.json();
//         throw new Error(data.message || 'Failed to update game state.');
//     }
// }
