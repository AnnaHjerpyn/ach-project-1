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
     * Helper function to randomize the Word Bank
     * @return - a randomly retrieved word <3
     */
    protected function getRandomSolutionWord()
    {
        // Fetch the minimum and maximum IDs
        $minID = 263;
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


//if ($board->getGuesses() < 6) {
//    $newGuess = new Guess();
//    $newGuess->Guess = 'your-guess-word';
//    $newGuess->write();
//
//    $board->Guesses()->add($newGuess);
//}
