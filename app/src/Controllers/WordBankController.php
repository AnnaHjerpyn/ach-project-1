<?php

namespace AnnaHjerpyn\Custom\Controllers;

use AnnaHjerpyn\Custom\Models\Board;
use AnnaHjerpyn\Custom\Models\Guess;
use PageController;
use SilverStripe\Control\HTTPRequest;
use AnnaHjerpyn\Custom\Models\WordBank;

class WordBankController extends PageController
{
    protected $correctWord;

    private static $allowed_actions = [
        'getRandomWord',
        'checkDatabase',
        'setBoard',
        'getBoard',
        'updateBoard',
    ];

    private static $url_handlers = [
        'board' => 'setBoard',
        'board/$ID' => 'getBoard',
        'update' => 'updateBoard',
        'check' => 'checkDatabase',
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
        $board->CorrectWord = $randomWord;
        $board->write();

        // Package it up yup
        $response = $this->getResponse()->addHeader('Content-Type', 'application/json');
        $response->setBody(json_encode(['solution' => $randomWord, 'boardID' => $board->ID]));
        return $response;
    }

    public function getBoard()
    {
        // Get the Board object based on its ID from the URL
        $boardID = $this->getRequest()->param('ID');
        $board = Board::get()->byID($boardID);

        // Fetch guesses associated with the board
        $guesses = $board->Guesses();
        $guessesArray = [];
        $usedKeys = [];

        if ($guesses->count() > 0) {
            foreach ($guesses as $guess) {
                $guessesArray[] = $guess->Guess;
                $this->updateUsedKeys($usedKeys, $guess->Guess, $board->CorrectWord);
            }
        }

        // Prepare game statistics
        $stats = [
            'correctWord' => $board->CorrectWord,
            'totalGuesses' => $board->Guesses()->count(),
            'correctGuesses' => $board->Guesses()->filter('Guess', $board->CorrectWord)->count(),
        ];

        // Prepare response data
        $response = [
            'solution' => $board->CorrectWord,
            'boardID' => $board->ID,
            'finished' => $board->GameState,
            'guessCount' => count($guessesArray),
            'guesses' => $guessesArray,
            'usedKeys' => $usedKeys,
            'stats' => $stats
        ];

        $this->getResponse()->addHeader('Content-Type', 'application/json');
        return json_encode($response);
    }

    private function updateUsedKeys(&$usedKeys, $guess, $correctWord)
    {
        $correctWordArray = str_split($correctWord);
        $guessArray = str_split($guess);

        // First pass to find 'green' keys
        foreach ($guessArray as $i => $letter) {
            if ($correctWordArray[$i] === $letter) {
                $usedKeys[$letter] = 'green';
                $correctWordArray[$i] = null; // Nullify the matched letter
            }
        }

        // Second pass to find 'yellow' and 'grey' keys
        foreach ($guessArray as $i => $letter) {
            if (!isset($usedKeys[$letter])) {
                if (in_array($letter, $correctWordArray)) {
                    $usedKeys[$letter] = 'yellow';
                    $correctWordArray[array_search($letter, $correctWordArray)] = null; // Nullify the matched letter
                } else {
                    $usedKeys[$letter] = 'grey';
                }
            } else if ($usedKeys[$letter] !== 'green') {
                if (in_array($letter, $correctWordArray)) {
                    $usedKeys[$letter] = 'yellow';
                    $correctWordArray[array_search($letter, $correctWordArray)] = null; // Nullify the matched letter
                } else {
                    $usedKeys[$letter] = 'grey';
                }
            }
        }
    }

    public function updateBoard(HTTPRequest $request)
    {
        // Retrieve the current Board being played
        $submittedData = json_decode($request->getBody(), true);
        $boardID = $submittedData['boardID'];
        // Sets Board object
        $board = Board::get_by_id($boardID);
        // Retrieve the user's guess from the request
        $userGuess = $submittedData['newGuess'];

        // Checks to see if the Board has less than 6 guesses
        if ($board->getGuesses() < 6) {
            // Creates a new Guess object
            $newGuess = new Guess();
            $newGuess->Guess = $userGuess;
            $newGuess->BoardID = $board->ID;

            // Want to check if the new guess is the correct word
            if ($newGuess->Guess === $board->CorrectWord) {
                $board->GameState = 1;
                $board->write();
            }

            // Save the Guess to the DB
            $newGuess->write();

            // Save the Guess to the Board's Guesses
            $board->Guesses()->add($newGuess);
        } else { // This means the Board has more than 6 guesses

            // Set the Board's game state to finished
            $board->GameState = 1;
            $board->write();

            // Output a Modal that allows user to restart
            // TODO: I'll add the Modal here later <3
        }

        // Return a response to the client
        $response = [
            'status' => 'success',
            'message' => 'Board updated successfully.',
            'board' => $board
        ];

        return json_encode($response);
    }


    public function deleteBoard()
    {
        // Retrieve the Board
        $board = $this->getBoard();

        // Does this function actually delete it ??
    }

    public function getRandomSolutionWord()
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
