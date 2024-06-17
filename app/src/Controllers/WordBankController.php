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
    ];

    private static $url_handlers = [
        'random' => 'getRandomWord',
        'checkDatabase' => 'checkDatabase',
    ];

    protected function init()
    {
        parent::init();
        // Select a random word from the WordBank as the correct word for this session
        $this->correctWord = $this->getRandomSolutionWord();
        // Update the correct word to the SW db each round
        // Save the correct word to the SolutionWord database
//        $log = Board::get_by_id();
//        $log->Word = $this->correctWord;
//        $log->write();
    }

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

    public function getRandomWord()
    {
        $randomWord = $this->getRandomSolutionWord();
        $response = $this->getResponse()->addHeader('Content-Type', 'application/json');
        $response->setBody(json_encode(['solution' => $randomWord]));
        return $response;
    }

    public function checkDatabase(HTTPRequest $request)
    {
        // Initialize response array
        $response = [
            'isValidWord' => false,
            'isCorrect' => false,
            'message' => ''
        ];

        if ($request->isPOST()) {
            $submittedWord = strtolower($request->getBody());
            $submittedWord = json_decode($submittedWord);

            // Check if the word exists in the WordBank
            $wordExists = WordBank::get()->filter('Word', $submittedWord->word)->first();

            if ($wordExists) {
                $response['isValidWord'] = true;
                if ($submittedWord === Board::get()->last()) {
                    $response['isCorrect'] = true;
                    $response['message'] = 'You guessed the correct word!';
                } else {
                    $response['message'] = 'Not in word list';
                }
            }
        } else {
            $response['message'] = 'No POST data received.';
        }

        // Set the HTTP response headers and encode the response as JSON
        $this->getResponse()->addHeader('Content-Type', 'application/json');
        return json_encode($response);
    }
}
