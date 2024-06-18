import React, { useState, useEffect } from 'react';
import '../themes/ach-custom/css/src/Components/_app.scss';
import { createRoot } from "react-dom/client";
import Board from "../themes/ach-custom/javascript/components/Board";
import ThemeToggle from "./ThemeToggle";
import { ThemeProvider } from "./ThemeContext";

const root = createRoot(document.getElementById("root"));

function App() {
    const [solution, setSolution] = useState("");
    const [boardID, setBoardID] = useState("");

    useEffect(() => {
        async function  setBoard() {
            try {
                const response = await fetch('/word-bank/board');
                if (!response.ok) {
                    throw new Error('Failed to fetch random solution');
                }
                const data = await response.json();
                setSolution(data.solution);
                setBoardID(data.boardID);
            } catch (error) {
                console.error('Error fetching solution:', error);
            }
        }
        setBoard();
    }, []);

    return (
        <ThemeProvider>
            <div className="App">
                <h1>Wordle</h1>
                <ThemeToggle />
                <Board solution={solution} boardID={boardID} />
            </div>
        </ThemeProvider>
    );
}

export default App;
