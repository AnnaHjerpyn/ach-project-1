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
        'statistics' => 'getUserStatistics',
        'updateStatistics' => 'updateUserStatistics',
        'distribution' => 'getGuessDistribution',
    ];

    public function setUserStatistics()
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

        // Write the values to the database for that user
        $statistics->write();

        return $statistics;
    }

    public function getGuessDistribution()
    {
        return array_fill(0, 6, 0);
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

        // Grab the guess distribution --> it's not in the db
        $guessDistribution = $this->getGuessDistribution();

        // Check to make sure those statistics even exist
        if (!$statistics) {
            // If they don't let's set some new default ones !
            $statistics = $this->setUserStatistics();

            // Return the default statistic values
            $response = [
                'totalGamesPlayed' => $statistics->TotalGamesPlayed,
                'totalWins' => $statistics->TotalWins,
                'winPercentage' => $statistics->WinPercentage,
                'currentStreak' => $statistics->CurrentStreak,
                'maxStreak' => $statistics->MaxStreak,
                'guessDistribution' => $guessDistribution,
            ];

            return json_encode($response);
        }

        // Return the statistics
        $response = [
            'totalGamesPlayed' => $statistics->TotalGamesPlayed,
            'totalWins' => $statistics->TotalWins,
            'winPercentage' => $statistics->WinPercentage,
            'currentStreak' => $statistics->CurrentStreak,
            'maxStreak' => $statistics->MaxStreak,
            'guessDistribution' => $guessDistribution,
        ];

        // Adds response header
        $this->getResponse()->addHeader('Content-Type', 'application/json');

        // Return the statistics
        return json_encode($response);
    }

}
