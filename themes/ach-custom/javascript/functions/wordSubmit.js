import React from 'react';
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

export { checkDatabase, updateBoardWithGuess }

// async function formatGuess (currentGuess, boardID) {
//     try {
//         const response = await fetch('/home/format', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 boardID: boardID,            // Send board ID so it can compare to solution
//                 currentGuess: currentGuess   // Send the current guess to be formatted
//             })
//         });
//
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//
//         const data = await response.json();
//         return data.formattedGuess;
//     } catch (error) {
//         console.error('Error fetching formatted guess:', error);
//         return []; // Return empty array !!
//     }
// }
