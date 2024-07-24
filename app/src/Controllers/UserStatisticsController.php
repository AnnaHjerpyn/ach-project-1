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
        'getUserStatistics',
        'updateUserStatistics',
        'getGuessDistribution',
    ];

    private static $url_handlers = [
        'getUserStatistics' => 'getUserStatistics',
        'updateUserStatistics' => 'updateUserStatistics',
        'distribution' => 'getGuessDistribution',
    ];

    public function getGuessDistribution(HTTPRequest $request)
    {
        // Get the current logged-in user
        $member = Security::getCurrentUser();

        // Check if the user is logged in
        if (!$member) {
            return $this->getErrorResponse(403, 'You must be logged in to view guess distribution.');
        }

        // Extract and decode data from the request body
        $submittedData = json_decode($request->getBody(), true);

        // Check if 'turns' is set in the submitted data
        if (!isset($submittedData['turns'])) {
            return $this->getErrorResponse(400, 'Invalid data format. Expected an array of turns.');
        }

        // Initialize an array to hold the guess distribution counts
        $distribution = array_fill(0, 6, 0);

        // Extract the 'turns' data from the submitted data
        $turnsArray = $submittedData['turns'];

        // Loop through the turns array to populate the distribution array
        foreach ($turnsArray as $turns) {
            // Ensure the turns value is within the expected range
            if ($turns >= 1 && $turns <= 6) {
                // Increment the array where the turn was
                $distribution[$turns - 1]++;
            }
        }

        // Return the distribution array
        return $this->jsonResponse($distribution);
    }



    public function getUserStatistics(HTTPRequest $request)
    {
        $member = Security::getCurrentUser();

        if (!$member) {
            return $this->getErrorResponse(403, 'You must be logged in to view statistics.');
        }

        $statistics = Statistic::getUserStatistics($member);

        if (!$statistics) {
            return $this->jsonResponse([
                'totalGamesPlayed' => 0,
                'totalWins' => 0,
                'winPercentage' => 0,
                'currentStreak' => 0,
                'maxStreak' => 0,
            ]);
        }

        return $this->jsonResponse([
            'totalGamesPlayed' => $statistics->TotalGamesPlayed,
            'totalWins' => $statistics->TotalWins,
            'winPercentage' => $statistics->WinPercentage,
            'currentStreak' => $statistics->CurrentStreak,
            'maxStreak' => $statistics->MaxStreak,
        ]);
    }

    public function updateUserStatistics(HTTPRequest $request)
    {
        $member = Security::getCurrentUser();

        if (!$member) {
            return $this->getErrorResponse(403, 'You must be logged in to update statistics.');
        }

        $data = json_decode($request->getBody(), true);

        if (!$data || !isset($data['totalGamesPlayed'], $data['totalWins'], $data['currentStreak'], $data['maxStreak'], $data['turns'])) {
            return $this->getErrorResponse(400, 'Invalid data provided.');
        }

        $statistics = Statistic::getUserStatistics($member);

        if (!$statistics) {
            $statistics = Statistic::create();
            $statistics->MemberID = $member->ID;
        }

        // Update user statistics
        $statistics->TotalGamesPlayed = $data['totalGamesPlayed'];
        $statistics->TotalWins = $data['totalWins'];
        $statistics->CurrentStreak = $data['currentStreak'];
        $statistics->MaxStreak = $data['maxStreak'];
        $statistics->WinPercentage = $data['totalGamesPlayed'] > 0 ? round(($data['totalWins'] / $data['totalGamesPlayed']) * 100, 2) : 0;

        // Update guess distribution based on turns
        $this->updateGuessDistribution($statistics, $data['turns']);

        $statistics->write();

        return $this->jsonResponse([
            'message' => 'Statistics updated successfully',
        ]);
    }

    protected function updateGuessDistribution($statistics, $turns)
    {
        // Get current guess distribution
        $distribution = $statistics->getGuessDistributionArray();

        // Update distribution array based on the number of turns
        if ($turns >= 1 && $turns <= 6) {
            $distribution[$turns - 1]++;
        }

        // Set the updated distribution
        $statistics->GuessDistribution = json_encode($distribution);
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
