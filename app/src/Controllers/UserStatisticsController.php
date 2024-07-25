<?php

namespace AnnaHjerpyn\Custom\Controllers;

use AnnaHjerpyn\Custom\Models\Statistic;
use PageController;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Security\Security;

class UserStatisticsController extends PageController
{
    private static $allowed_actions = [
        'setUserStatistics',
        'getUserStatistics',
        'updateUserStatistics',
        'getGuessDistribution',
    ];

    private static $url_handlers = [
        'statistics' => 'setUserStatistics',
        'getStatistics' => 'getUserStatistics',
        'updateStatistics' => 'updateUserStatistics',
        'distribution' => 'getGuessDistribution',
    ];

    public function setUserStatistics(HTTPRequest $request)
    {
        // A new user to assign the new Statistic to
        $member = Security::getCurrentUser();

        // Check if the user is signed in — if member is null
        if (!$member) {
            return json_encode(['error' => 'User not found.']);
        }

        // Create a new Statistic entry
        $statistics = new Statistic();

        // Set the statistics' default values
        $statistics->TotalGamesPlayed = 0;
        $statistics->TotalWins = 0;
        $statistics->WinPercentage = 0;
        $statistics->CurrentStreak = 0;
        $statistics->MaxStreak = 0;
        $statistics->GuessDistribution = array_fill(0, 6, 0);

        // Write the values to the database for that user
        $statistics->write();

        // Return the statistics
        $response = $this->getResponse()->addHeader('Content-Type', 'application/json');
        $response->setBody(json_encode([$statistics]));
        return $response;
    }

    public function getUserStatistics()
    {
        // We need the user to be able to get their specific statistics
        $member = Security::getCurrentUser();

        // Check if the user is signed in — if not, member is null
        if (!$member) {
            return json_encode(['error' => 'User not found.']);
        }

        // Grab the specific user’s statistics
        $statistics = Statistic::getUserStatistics($member);

        // Check to make sure those statistics even exist
        if (!$statistics) {
            return json_encode(['error' => 'This user\'s statistics not found.']);
        }

        // Return the statistics
        $response = [
            'totalGamesPlayed' => $statistics->TotalGamesPlayed,
            'totalWins' => $statistics->TotalWins,
            'winPercentage' => $statistics->WinPercentage,
            'currentStreak' => $statistics->CurrentStreak,
            'maxStreak' => $statistics->MaxStreak,
            'guessDistribution' => $statistics->GuessDistribution,
        ];

        // Adds response header
        $this->getResponse()->addHeader('Content-Type', 'application/json');

        // Return the statistics
        return json_encode($response);
    }


    public function updateUserStatistics(HTTPRequest $request)
    {
        // Get the current logged-in user
        $member = Security::getCurrentUser();

        // If no user is logged in, return a 403 Forbidden response
        if (!$member) {
            return $this->getErrorResponse(403, 'You must be logged in to update statistics.');
        }

        // Decode the JSON data from the request body
        $submittedData = json_decode($request->getBody(), true);

        // If the submitted data is invalid, return a 400 Bad Request response
        if (!$submittedData) {
            return $this->getErrorResponse(400, 'Invalid data provided.');
        }

        // Get the user's existing statistics
        $statistics = Statistic::getUserStatistics($member);

        // If no statistics are found for the user, return a 403 Forbidden response
        if (!$statistics) {
            return $this->getErrorResponse(403, 'Failed to update statistics.');
        }

        // Update the statistics with the submitted data
        $statistics->TotalGamesPlayed = $submittedData['totalGamesPlayed'];
        $statistics->TotalWins = $submittedData['totalWins'];
        $statistics->CurrentStreak = $submittedData['currentStreak'];
        $statistics->MaxStreak = $submittedData['maxStreak'];

        // Calculate and update the win percentage
        $statistics->WinPercentage = $submittedData['totalGamesPlayed'] > 0
            ? round(($submittedData['totalWins'] / $submittedData['totalGamesPlayed']) * 100, 2)
            : 0;

        // Update the guess distribution
        $this->updateGuessDistribution($statistics, $submittedData['turns']);

        // Save the updated statistics to the database
        $statistics->write();

        // Return a success message
        return $this->jsonResponse(['message' => 'Statistics updated successfully']);
    }

    protected function updateGuessDistribution($statistics, $turns)
    {
        // The existing guess distribution or initialize a new distribution array with zeros if none exists
        $distribution = json_decode($statistics->GuessDistribution, true) ?? array_fill(0, 6, 0);

        // Number of turns is within the expected range (1 to 6)
        if ($turns >= 1 && $turns <= 6) {
            // Increment the count for the given number of turns
            $distribution[$turns - 1]++;
        } else {
            // Log an error or handle the invalid input appropriately
            error_log("Invalid number of turns: $turns. Must be between 1 and 6.");
            return $this->getErrorResponse(400, 'Invalid number of turns provided.');
        }

        // Encode the updated distribution back to JSON format and assign it to the statistics object
        $statistics->GuessDistribution = json_encode($distribution);

        // Indicate successful update
        return $this->jsonResponse(['message' => 'Guess distribution updated successfully']);
    }

    protected function getErrorResponse($status, $message)
    {
        $response = HTTPResponse::create()
            ->setStatusCode($status)
            ->setBody(json_encode(['error' => $message]));
        $response->addHeader('Content-Type', 'application/json');
        return $response;
    }

    protected function jsonResponse($data, $status = 200)
    {
        $response = $this->getResponse();
        $response->addHeader('Content-Type', 'application/json');
        $response->setStatusCode($status);
        $response->setBody(json_encode($data));
        return $response;
    }
}
