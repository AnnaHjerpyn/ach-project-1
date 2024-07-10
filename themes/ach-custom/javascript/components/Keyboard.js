import React from 'react';
import '../../css/src/Components/_keyboard.scss';

function Keyboard({usedKeys, handleKeyInput}) {

    const topRow = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
    const middleRow = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
    const bottomRow = ["z", "x", "c", "v", "b", "n", "m"];

    return (
        <div className="keyboard">
            <div className="row">
                {topRow.map((letter) => {
                    const className = usedKeys[letter];
                    return (
                        <button
                            key={letter}
                            value={letter}
                            className={className}
                            onClick={() => handleKeyInput(letter)}
                        >
                            {letter}
                        </button>
                    );
                })}
            </div>
            <div className="row">
                <div style={{flex: 0.5}} className="p-0"></div>
                {middleRow.map((letter) => {
                    const className = usedKeys[letter];
                    return (
                        <button
                            key={letter}
                            value={letter}
                            className={className}
                            onClick={() => handleKeyInput(letter)}
                        >
                            {letter}
                        </button>
                    );
                })}
                <div style={{flex: 0.5}} className="p-0"></div>
            </div>
            <div className="row">
                <button
                    key="Enter"
                    value="↵"
                    id={"target"}
                    style={{flex: 1.5, fontSize: "13px"}}
                    onClick={() => handleKeyInput('Enter')}
                >
                    Enter
                </button>
                {bottomRow.map((letter) => {
                    const className = usedKeys[letter];
                    return (
                        <button
                            key={letter}
                            value={letter}
                            className={className}
                            onClick={() => handleKeyInput(letter)}
                        >
                            {letter}
                        </button>
                    );
                })}
                <button
                    key="Backspace"
                    value="←"
                    style={{flex: 1.5}}
                    onClick={() => handleKeyInput('Backspace')}
                >
                    ⌫
                </button>
            </div>
        </div>
    );
}

export default Keyboard;
