<?php

namespace AnnaHjerpyn\Custom\Controllers;

use AnnaHjerpyn\Custom\Models\Statistic;
use PageController;
use SilverStripe\Control\Controller;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Security\Security;

class UserStatisticsController extends PageController
{
    protected $guessDistribution;

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

    public function updateUserStatistics(HTTPRequest $request)
    {
        // When updating the user statistics
        // We only need to consider the win aspect in the request --> total wins (if user loses)
        // This would also affect the max streak if the user lost
        $submittedData = json_decode($request->getBody(), true);
        $win = $submittedData['win'];
        $turns = $submittedData['turns'];


        // All that needs to be done is the values get incremented
        // Get the current user and their stats
        $member = Security::getCurrentUser();

        // Check if the user is signed in — if member is null
        if (!$member) {
            return json_encode(['error' => 'User not found.']);
        }

        // Grab the specific user’s statistics
        $statistics = Statistic::getUserStatistics($member);

        // Check to make sure those statistics even exist
        if (!$statistics) {
            // If they don't let's set some new default ones !
            $statistics = $this->setUserStatistics();
            // Notifies the frontend that the user didn't previously have stats set
            return json_encode(['message' => 'Statistics didn\'t exist.']);
        }

        // This value will always be incremented
        $statistics->TotalGamesPlayed++;

        // If the user won the game --> increase the streak and total wins
        if ($win) {
            $statistics->TotalWins++;
            $statistics->CurrentStreak++;
            $statistics->WinPercentage = (($statistics->TotalWins / $statistics->TotalGamesPlayed) * 100);
            // See if the current streak is greater than the old one
            if ($statistics->CurrentStreak > $statistics->MaxStreak) {
                $statistics->MaxStreak = $statistics->CurrentStreak;
            }

            $guessDistribution = $this->getGuessDistribution($statistics);
            if ($turns >= 1 && $turns <= 6) {
                $guessDistribution[$turns - 1]++;
            }

        } else {
            // Otherwise reset the current streak
            $statistics->CurrentStreak = 0;
        }

        // Write the updated values to the database for that user
        $statistics->write();

        // Notifies the frontend, the statistics were updated properly
        return json_encode(['message' => 'Statistics successfully updated.']);
    }

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
        $statistics->setGuessDistributionArray(array_fill(0, 6, 0));

        // Write the values to the database for that user
        $statistics->write();

        return $statistics;
    }

    public function getGuessDistribution($statistics)
    {
        return $statistics->getGuessDistributionArray();
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
        $guessDistribution = $this->getGuessDistribution($statistics);



        // Check to make sure those statistics even exist
        if (!$statistics) {
            // If they don't let's set some new default ones !
            $statistics = $this->setUserStatistics();

            // Return the default statistic values
            $response = [
                'userID' => $member->ID,
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
            'userID' => $member->ID,
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
