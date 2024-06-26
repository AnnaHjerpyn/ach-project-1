import React from 'react';
import Row from './Row';

function Grid({ guesses, currentGuess, turn, isValidWord, isCorrect }) {
    return (
        <div>
            {guesses.map((g, i) => {
                if (turn === i) {
                    return <Row key={i} currentGuess={currentGuess} isValidWord={isValidWord} isCorrect={isCorrect} />;
                }
                return <Row key={i} guess={g} isValidWord={isValidWord} isCorrect={isCorrect} />;
            })}
        </div>
    );
}

export default Grid;
