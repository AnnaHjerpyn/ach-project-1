import React, {useEffect} from 'react';
import '../../css/src/Components/_row.scss';

function Row({guess, debouncedGuess, isValidWord, isWinningRow, currentGuess}) {

    const renderRowContent = () => {
        if (guess && isWinningRow) {
            let letters = debouncedGuess.split('');
            console.log("Rendering winning row in guess:", {currentGuess, debouncedGuess, isWinningRow});
            return (
                <div className="row-container current win">
                    {letters.map((letter, i) => (
                        <div key={i} className="filled">{letter}</div>
                    ))}
                    {[...Array(5 - letters.length)].map((_, i) => (
                        <div key={i}></div>
                    ))}
                </div>
            );
        } else if (guess) {
            console.log("Rendering past guess:", guess);
            return (
                <div className="row-container past">
                    {guess.map((l, i) => (
                        <div key={i} className={l.color}>{l.key}</div>
                    ))}
                </div>
            );
        }

        if (currentGuess && isWinningRow) {
            let letters = debouncedGuess.split('');
            console.log("Rendering winning row:", {currentGuess, debouncedGuess, isWinningRow});
            return (
                <div className="row-container current win">
                    {letters.map((letter, i) => (
                        <div key={i} className="filled">{letter}</div>
                    ))}
                    {[...Array(5 - letters.length)].map((_, i) => (
                        <div key={i}></div>
                    ))}
                </div>
            );
        } else if (currentGuess) {
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

        return (
            <div className="row-container">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        );
    };

    return renderRowContent();
}

export default Row;
