import React from 'react';
import Row from './Row';

function Grid({guesses, debouncedGuess, turn, isValidWord, isCorrect, currentGuess}) {
    return (<div>
        {guesses.map((g, i) => {
            if (turn === i) {
                return (
                    <Row
                        key={i}
                        debouncedGuess={debouncedGuess}
                        isValidWord={isValidWord}
                        isWinningRow={isCorrect}
                        currentGuess={currentGuess}
                    />
                );
            }
            return (
                <Row
                    key={i}
                    guess={g}
                    isValidWord={isValidWord}
                    isWinningRow={false}
                    currentGuess={''}
                />
            );
        })}
    </div>);
}

export default Grid;
