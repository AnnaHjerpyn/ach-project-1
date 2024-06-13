<?php

namespace AnnaHjerpyn\Custom\Controllers;

use PageController;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\View\ArrayData;
use AnnaHjerpyn\Custom\Models\WordBank;

class WordBankController extends PageController
{
    protected $correctWord;

    private static $allowed_actions = [
        'getRandomWord',
        'wordHook',
    ];

    private static $url_handlers = [
        'random' => 'getRandomWord',
    ];

    protected function init()
    {
        parent::init();
        // Select a random word from the WordBank as the correct word for this session
        $this->correctWord = $this->getRandomSolutionWord();
    }

    protected function getRandomSolutionWord()
    {
        // Fetch a random WordBank entry
        $randomWord = WordBank::get()->first();
        return ! is_null($randomWord) ? $randomWord->Word : '';
    }

    public function getRandomWord()
    {
        $randomWord = $this->getRandomSolutionWord();
        $response = $this->getResponse()->addHeader('Content-Type', 'application/json');
        $response->setBody(json_encode(['solution' => $randomWord]));
        return $response;
    }

    public function wordHook(HTTPRequest $request)
    {
        // Handle word submission
        if ($request->isPOST()) {
            $submittedWord = strtolower($request->postVar('Word'));

            $response = [
                'isValidWord' => false,
                'isCorrect' => false,
                'message' => ''
            ];

            // Check if the word exists in the WordBank
            $wordExists = WordBank::get()->filter('Word', $submittedWord)->exists();

            if ($wordExists) {
                $response['isValidWord'] = true;
                if ($submittedWord === $this->correctWord) {
                    $response['isCorrect'] = true;
                    $response['message'] = 'Congratulations! You guessed the correct word!';
                } else {
                    $response['message'] = 'Valid word, but not the correct word. Try again!';
                }
            } else {
                $response['message'] = 'Invalid word. Please try again.';
            }

            return $this->customise(new ArrayData($response))->renderWith('WordBank');
        }

        return $this->redirectBack();
    }
}
