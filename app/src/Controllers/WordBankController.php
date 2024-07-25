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
        'getFormattedGuess',
    ];

    private static $url_handlers = [
        'board' => 'setBoard',
        'board/$ID' => 'getBoard',
        'update' => 'updateBoard',
        'check' => 'checkDatabase',
        'format' => 'getFormattedGuess',
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

        // Prepare response data
        $response = [
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
        $oldGuess = Guess::get()->filter(['Guess' => $userGuess, 'BoardGUID' => $boardID])->first();
        if ($oldGuess != null) {

            // Return a response to the client
            $response = [
                'status' => 'fail',
                'message' => 'Board updated unsuccessfully.',
                'board' => $board
            ];

            return json_encode($response);
        }

        // Check if the word is a valid word in the word bank
        // Check if the word exists in the WordBank
        $wordExists = WordBank::get()->filter('Word', $userGuess)->first();

        if (!$wordExists) {
            $response = [
                'status' => 'fail',
                'message' => 'Word not in list.',
                'board' => $board
            ];

            return json_encode($response);
        }

        // Checks to see if the Board has less than 6 guesses
        if ($board->getGuesses() < 6) {
            // Creates a new Guess object
            $newGuess = new Guess();
            $newGuess->Guess = $userGuess;
            $newGuess->BoardGUID = $board->BoardID;

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

    public function getFormattedGuess(HTTPRequest $request)
    {
        // Fetch the data
        $submittedData = json_decode($request->getBody(), true);
        // Grabs the board data --> we can have the solution associated to it
        $boardID = $submittedData['BoardID'];
        $board = Board::get()->filter(['BoardID' => $boardID])->first();
        // Make sure that guy exists
        if (!$board) {
            // The board does not exist ahhh !!!
            return json_encode(['error' => 'Board not found']);
        }
        // Grabs the current guess provided by the client side
        $currentGuess = strtolower($submittedData['currentGuess']);
        // Get the board's solution to be compared to
        $solution = str_split(strtolower($board->CorrectWord)); // Convert solution to array of lowercase characters

        // Guesses count and the previous guesses
        $turn = $board->getGuesses(); // Amount of turns
        $guesses = $board->Guesses(); // Guesses array
        $guessesArray = [];

        // Building out the guesses array
        if ($guesses->count() > 0) {
            foreach ($guesses as $guess) {
                $guessesArray[] = $guess->Guess;
            }
        }

        // Formats the guess based on solution
        $formattedGuess = $this->formatGuess($currentGuess, $solution, $turn, $guessesArray);

        // Return the formatted guess back to the client
        return json_encode(['formattedGuess' => $formattedGuess]);
    }


    private function formatGuess($currentGuess, $solution, $turn, $guessesArray)
    {
        // Using anonymous functions with array map !
        $formattedGuess = array_map(function ($letter, $i) use ($solution, $turn, $guessesArray) {
            // Default that grey color
            $color = 'grey';

            // Check if the letter is in the correct position
            if ($letter === $solution[$i]) {
                $color = 'green';
            } elseif (in_array($letter, $solution)) {
                // Check if the letter exists in solution but is not in the correct position
                $color = 'yellow';
            }

            // Check if the letter has already been marked as green in previous turns
            for ($j = 0; $j < $turn; $j++) {
                if (isset($guessesArray[$j][$i]['key']) && $guessesArray[$j][$i]['key'] === $letter && isset($guessesArray[$j][$i]['color']) && $guessesArray[$j][$i]['color'] === 'green') {
                    $color = 'green';
                    break;
                }
            }

            // Return the letter and it's associated color after being formatted
            return ['key' => $letter, 'color' => $color];
        }, str_split($currentGuess), array_keys($solution));

        // Return the formatted guess
        return $formattedGuess;
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

        if (!$request->isPOST()) {
            $response['message'] = 'No POST data received.';
            $this->getResponse()->addHeader('Content-Type', 'application/json');
            return json_encode($response);
        }

        // Process the POST request data
        $submittedData = json_decode($request->getBody(), true);
        $submittedWord = strtolower($submittedData['Word']);
        $boardID = $submittedData['BoardID'];


        $board = Board::get()->filter(['BoardID' => $boardID])->first();

        // Check if the user submitted a word less than 5 letters
        if (strlen($submittedWord) < 5) {
            $response['message'] = 'Not enough letters';
            $this->getResponse()->addHeader('Content-Type', 'application/json');
            return json_encode($response);
        }

        // Check if the word exists in the WordBank
        $wordExists = WordBank::get()->filter('Word', $submittedWord)->first();

        if (!$wordExists) {
            $response['message'] = 'Word is not in list';
            $this->getResponse()->addHeader('Content-Type', 'application/json');
            return json_encode($response);
        }

        // If word exists, mark it as a valid word
        $response['isValidWord'] = true;

        // Check if the submitted word matches the correct word for the board
        if ($board !== '' && $submittedWord === strtolower($board->CorrectWord)) {
            $response['isCorrect'] = true;
            $response['message'] = $board->CorrectWord;
        }

        // Set the message to the solution word when the turn > 5
        if ($board->getGuesses() > 5) {
            $response['isCorrect'] = false;
            $response['message'] = $board->CorrectWord;
        }

        // Set the HTTP response headers and encode the response as JSON
        $this->getResponse()->addHeader('Content-Type', 'application/json');
        return json_encode($response);
    }
}
