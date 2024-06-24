import React from 'react';
import Row from './Row';

function Grid({guesses, currentGuess, turn, isValidWord}) {
    return (
        <div>
            {guesses.map((g, i) => {
                if (turn === i) {
                    return <Row key={i} currentGuess={currentGuess} isValidWord={isValidWord} />;
                }
                return <Row key={i} guess={g} isValidWord={isValidWord}/>;
            })}
        </div>
    );
}

export default Grid;
