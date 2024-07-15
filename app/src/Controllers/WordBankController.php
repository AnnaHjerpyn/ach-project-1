<?php

namespace AnnaHjerpyn\Custom\Controllers;

use AnnaHjerpyn\Custom\Models\Board;
use AnnaHjerpyn\Custom\Models\Guess;
use AnnaHjerpyn\Custom\Models\WordBank;
use PageController;
use SilverStripe\Control\HTTPRequest;

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
        $response->setBody(json_encode(['boardID' => $board->BoardID]));
        return $response;
    }

    public function getBoard()
    {
        // Get the Board object based on its ID from the URL
        $boardID = strval($this->getRequest()->param('ID'));
        $board = Board::get()->filter(['BoardID' => $boardID])->first();

        if ($board == '') {
            return null;
        }

        // Fetch guesses associated with the board
        $guesses = $board->Guesses();
        $guessesArray = [];
        $usedKeys = [];

        if ($guesses->count() > 0) {
            foreach ($guesses as $guess) {
                $guessesArray[] = $guess->Guess;
                $usedKeys[] = $this->updateUsedKeys($guess->Guess, $board->CorrectWord);
            }
        }

        // Prepare game statistics
//        $stats = [
//            'totalGuesses' => $board->Guesses()->count(),
//            'correctGuesses' => $board->Guesses()->filter('Guess', $board->CorrectWord)->count(),
//        ];

        // Prepare response data
        $response = [
            'solution' => $board->CorrectWord,
            'boardID' => $board->BoardID,
            'finished' => $board->GameState,
            'guessCount' => count($guessesArray),
            'guesses' => $guessesArray,
            'usedKeys' => $usedKeys,
        ];

        $this->getResponse()->addHeader('Content-Type', 'application/json');
        return json_encode($response);
    }

    private function updateUsedKeys($guess, $correctWord)
    {
        $correctWordArray = str_split($correctWord);
        $guessArray = str_split($guess);
        $usedKeys = [];

        foreach ($guessArray as $i => $letter) {
            if ($correctWordArray[$i] === $letter) {
                $usedKeys[] = 'green';
            } else if (in_array($letter, $correctWordArray)) {
                $usedKeys[] = 'yellow';
            } else {
                $usedKeys[] = 'grey';
            }
        }

        return $usedKeys;
    }

    public function updateBoard(HTTPRequest $request)
    {
        // Retrieve the current Board being played
        $submittedData = json_decode($request->getBody(), true);
        $boardID = strval($submittedData['boardID']);
        // Sets Board object
        $board = Board::get()->filter(['BoardID' => $boardID])->first();

        if ($board == '') {
            // NO BOARD?!!!?
            return null;
        }

        // Retrieve the user's guess from the request
        $userGuess = $submittedData['newGuess'];

        // Check to see if user has already guessed the new guess
        $oldGuess = Guess::get()->filter(['Guess' => $userGuess, 'BoardID' => $boardID])->first();
        if ($oldGuess != null) {

            // Return a response to the client
            $response = [
                'status' => 'fail',
                'message' => 'Board updated unsuccessfully.',
                'board' => $board
            ];

            return json_encode($response);
        }

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
        $minID = 2;
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
        $board = Board::get()->filter(['BoardID' => $boardID])->first();
        if ($board !== '' && $submittedWord === strtolower($board->CorrectWord)) {
            $response['isCorrect'] = true;
            $response['message'] = $board->CorrectWord;
        }

        // Set the HTTP response headers and encode the response as JSON
        $this->getResponse()->addHeader('Content-Type', 'application/json');
        return json_encode($response);
    }
}
