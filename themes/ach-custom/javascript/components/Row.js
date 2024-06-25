import React from 'react';
import '../../css/src/Components/_row.scss';

function Row({ guess, currentGuess, isValidWord, isCorrect }) {

    if (guess) {
        return (
            <div className={`row-container past`}>
                {guess.map((l, i) => (
                    <div key={i} className={l.color}>{l.key}</div>
                ))}
            </div>
        );
    }

    if (currentGuess) {
        let letters = currentGuess.split('');

        return (
            <div className={`row-container current ${isValidWord ? '' : 'invalid-word'}`}>
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
        <div className={`row-container ${isValidWord ? '' : 'invalid-word'}`}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
}

export default Row;
