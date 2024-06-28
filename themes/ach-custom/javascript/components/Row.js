import React from 'react';
import '../../css/src/Components/_row.scss';

function Row({guess, debouncedGuess, isValidWord, isWinningRow, currentGuess}) {
    const renderRowContent = () => {
        if (guess) {
            // Render a regular past guess row
            console.log("Rendering past guess:", guess);
            return (
                <div className="row-container past">
                    {guess.map((l, i) => (
                        <div key={i} className={`filled ${l.color}`}>{l.key}</div>
                    ))}
                </div>
            );
        }

        if (currentGuess) {
            // Render the current guess row
            let letters = debouncedGuess.split('');
            console.log("Rendering current guess row:", {currentGuess, debouncedGuess});

            return (
                <div className="row-container current">
                    {letters.map((letter, i) => (
                        <div key={i} className="filled">{letter}</div>
                    ))}
                    {[...Array(5 - letters.length)].map((_, i) => (
                        <div key={i}></div>
                    ))}
                </div>
            );
        }

        // Render an empty row if neither guess nor current guess is present
        return (
            <div className="row-container">
                {[...Array(5)].map((_, i) => (
                    <div key={i}></div>
                ))}
            </div>
        );
    };

    return renderRowContent();
}

export default Row;
