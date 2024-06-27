import React from 'react';
import '../../css/src/Components/_row.scss';

function Row({ guess, debouncedGuess, isValidWord, isWinningRow, currentGuess }) {

    const getRowClassNames = () => {
        let classNames = 'row-container';

        if (!isValidWord) {
            classNames += ' invalid-word'; // Add invalid-word class if isValidWord is false
        }
        if (currentGuess) {
            classNames += ' current'; // Add current and win classes conditionally
        } else if (guess) {
            classNames += ` past ${isWinningRow ? 'win' : ''}`; // Add past class if there is a guess
        }

        return classNames;
    };

    const renderRowContent = () => {
        if (guess) {
            return (
                <div className="row-container past">
                    {guess.map((l, i) => (
                        <div key={i} className={l.color}>{l.key}</div>
                    ))}
                </div>
            );
        }

        if (currentGuess) {
            let letters = debouncedGuess.split('');

            return (
                <div className={getRowClassNames()}>
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
            <div className={getRowClassNames()}>
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
