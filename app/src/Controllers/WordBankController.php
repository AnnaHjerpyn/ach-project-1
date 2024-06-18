<?php

namespace AnnaHjerpyn\Custom\Controllers;

use AnnaHjerpyn\Custom\Models\Board;
use PageController;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\View\ArrayData;
use AnnaHjerpyn\Custom\Models\WordBank;

class WordBankController extends PageController
{
    protected $correctWord;

    private static $allowed_actions = [
        'getRandomWord',
        'checkDatabase',
        'setBoard'
    ];

    private static $url_handlers = [
        'board' => 'setBoard',
        'checkDatabase' => 'checkDatabase',
        '$ID' => 'getBoard'
    ];

    protected function init()
    {
        parent::init();
    }

    public function setBoard()
    {
        // Select a random word from the WordBank as the correct word for this session
        $randomWord = $this->getRandomSolutionWord();
        // Create a new Board entry
        $board = new Board();
        $guessCount = $board->getGuesses();
        $board->CorrectWord = $randomWord;
        $board->write();

        $response = $this->getResponse()->addHeader('Content-Type', 'application/json');
        $response->setBody(json_encode(['solution' => $randomWord, 'boardID' => $board->ID]));
        return $response;
    }

    /*
     * getBoard function: grabs the Board object by its boardID
     * returns that Board object with its Row and current guesses
     */
    protected function getBoard()
    {
        // Want to get the Board object based on its ID
        $boardID = $this->request->param('ID');
        // We got it :O
        $board = Board::get()->byID($boardID);
        // Now return that Board object !!
        return $board;
    }

    /*
     * Handles the updating of the Board's
     * guesses and game state
     */
    protected function updateBoard(){
        // Retrieve the current Board being played
        $board = $this->getBoard();
        // Checks to see if the Board has less than 6 guesses
        if ($board->getGuesses() < 6) {
            // Creates a new Guess object
            $newGuess = new Guess();

            // Pass the new Guess of the user input
            $newGuess->Guess = 'your-guess-word';

            // Save the Guess to the DB
            $newGuess->write();

            // Save the Guess to the Board's Guesses
            $board->Guesses()->add($newGuess);

        } else { // This means the Board has more than 6 guesses

            // Output a Modal that allows user to restart
            // TODO: I'll add the Modal here later <3

            // Set the Board's game state to finished
            $board->GameState = 1;
        }
    }

    /*
     * Handles the deletion of a Board object
     */
    protected function deleteBoard(){
        // Retrieve the Board
        $board = $this->getBoard();
        // Does this function actually delete it ??
        $board->delete();
    }

    /*
     * Helper function to randomize the Word Bank
     * @return - a randomly retrieved word <3
     */
    protected function getRandomSolutionWord()
    {
        // Fetch the minimum and maximum IDs
        $minID = 263; // TODO: this should be 1 but the DB starts at 263 :o
        $maxID = WordBank::get()->count();

        if ($minID === null || $maxID === null) {
            return '';
        }

        // Generate a random ID within the range
        $randomID = rand($minID, $maxID);

        // Fetch the WordBank entry with the random ID
        $randomWord = WordBank::get()->byID($randomID);

        // If no entry is found, recursively try again
        if (!$randomWord) {
            return $this->getRandomSolutionWord();
        }

        return !is_null($randomWord) ? $randomWord->Word : '';
    }

    /*
     * Helper function to check if the word is in
     * the word bank (valid), the board's solution word (isCorrect),
     * or is not in the word bank (invalid)
     */
    public function checkDatabase(HTTPRequest $request)
    {
        // Initialize response array
        $response = [
            'isValidWord' => false,
            'isCorrect' => false,
            'message' => ''
        ];

        if (!$request->isPOST()) {
            $response['message'] = 'No POST data received.';
            $this->getResponse()->addHeader('Content-Type', 'application/json');
            return json_encode($response);
        }

        // Process the POST request data
        $submittedData = json_decode($request->getBody(), true);
        $submittedWord = strtolower($submittedData['Word']);
        $boardID = $submittedData['BoardID'];

        // Check if the word exists in the WordBank
        $wordExists = WordBank::get()->filter('Word', $submittedWord)->first();

        if (!$wordExists) {
            $response['message'] = 'Not in word list';
            $this->getResponse()->addHeader('Content-Type', 'application/json');
            return json_encode($response);
        }

        // If word exists, mark it as a valid word
        $response['isValidWord'] = true;

        // Check if the submitted word matches the correct word for the board
        $board = Board::get()->byID($boardID);
        if ($board && $submittedWord === strtolower($board->CorrectWord)) {
            $response['isCorrect'] = true;
            $response['message'] = $board->CorrectWord;
        }

        // Set the HTTP response headers and encode the response as JSON
        $this->getResponse()->addHeader('Content-Type', 'application/json');
        return json_encode($response);
    }
}
