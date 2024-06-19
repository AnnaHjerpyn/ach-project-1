import React, {useState, useEffect} from 'react';
import '../themes/ach-custom/css/src/Components/_app.scss';
import {createRoot} from "react-dom/client";
import {useLocation, redirect, useNavigate} from 'react-router-dom';
import Board from "../themes/ach-custom/javascript/components/Board";
import ThemeToggle from "./ThemeToggle";
import {ThemeProvider} from "./ThemeContext";

const root = createRoot(document.getElementById("root"));

function App() {
    const [solution, setSolution] = useState("");
    const [boardID, setBoardID] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchBoard() {
            // The query string of the current URL
            const params = new URLSearchParams(location.search);
            // Gets the boardID from the parameters
            let boardID = params.get('boardID');

            console.log("Current boardID from URL:", boardID);

            // If there isn't one... then we make a new board
            if (!boardID) {
                // No boardID in URL, create a new board
                const response = await fetch('/word-bank/board', {
                    method: 'POST'
                });
                if (!response.ok) {
                    console.error('Failed to create a new board');
                    return;
                }
                const data = await response.json();
                console.log("New board created with ID:", data.boardID);
                // Set the solution and board id
                setSolution(data.solution);
                // Instead of setting the state and then navigating, directly navigate with the new ID
                navigate(`word-bank/board/?boardID=${data.boardID}`, {replace: true});
                setBoardID(data.boardID);  // Update state after navigation
            } else {  // Means there is an existing board
                // Fetch existing board
                const response = await fetch(`/word-bank/board/${boardID}`);
                if (!response.ok) {
                    console.error('Failed to fetch board');
                    return;
                }
                const data = await response.json();
                console.log("Fetched board data:", data);
                // Set the Board's solution word
                setSolution(data.solution);
                // Set the Board's ID
                setBoardID(data.boardID);
            }
        }

        fetchBoard();
    }, [location.search, navigate]);

    return (
        <ThemeProvider>
            <div className="App">
                <h1>Wordle</h1>
                <ThemeToggle/>
                <h1>Board ID: {boardID}</h1>
                <Board solution={solution} boardID={boardID}/>
            </div>
        </ThemeProvider>
    );
}

export default App;
