import React, { useState, useEffect } from 'react';
import '../themes/ach-custom/css/src/Components/_app.scss';
import { createRoot } from "react-dom/client";
import Board from "../themes/ach-custom/javascript/components/Board";
import ThemeToggle from "./ThemeToggle";
import { ThemeProvider } from "./ThemeContext";


const root = createRoot(document.getElementById("root"));

function App() {
    const [solution, setSolution] = useState("");

    useEffect(() => {
        async function fetchRandomSolution() {
            try {
                const response = await fetch('/random');
                if (!response.ok) {
                    throw new Error('Failed to fetch random solution');
                }
                const data = await response.json();
                setSolution(data.solution);
            } catch (error) {
                console.error(error);
            }
        }
        fetchRandomSolution();
    }, []);

    return (
        <ThemeProvider>
            <div className="App">
                <h1>Wordle</h1>
                <ThemeToggle />
                <Board solution={solution} />
            </div>
        </ThemeProvider>
    );
}

export default App;
