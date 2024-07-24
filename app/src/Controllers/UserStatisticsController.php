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
        'getStatistics' => 'getUserStatistics',
        'updateStatistics' => 'updateUserStatistics',
        'distribution' => 'getGuessDistribution',
    ];

    public function getGuessDistribution(HTTPRequest $request)
    {
        $member = Security::getCurrentUser();

        if (!$member) {
            return $this->getErrorResponse(403, 'You must be logged in to view guess distribution.');
        }

        $statistics = Statistic::getUserStatistics($member);

        if (!$statistics) {
            return $this->jsonResponse(array_fill(0, 6, 0));
        }

        $distribution = json_decode($statistics->GuessDistribution, true);

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
                'guessDistribution' => array_fill(0, 6, 0),
            ]);
        }

        return $this->jsonResponse([
            'totalGamesPlayed' => $statistics->TotalGamesPlayed,
            'totalWins' => $statistics->TotalWins,
            'winPercentage' => $statistics->WinPercentage,
            'currentStreak' => $statistics->CurrentStreak,
            'maxStreak' => $statistics->MaxStreak,
            'guessDistribution' => json_decode($statistics->GuessDistribution, true),
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

        $statistics->TotalGamesPlayed = $data['totalGamesPlayed'];
        $statistics->TotalWins = $data['totalWins'];
        $statistics->CurrentStreak = $data['currentStreak'];
        $statistics->MaxStreak = $data['maxStreak'];
        $statistics->WinPercentage = $data['totalGamesPlayed'] > 0 ? round(($data['totalWins'] / $data['totalGamesPlayed']) * 100, 2) : 0;

        $this->updateGuessDistribution($statistics, $data['turns']);

        $statistics->write();

        return $this->jsonResponse([
            'message' => 'Statistics updated successfully',
        ]);
    }

    protected function updateGuessDistribution($statistics, $turns)
    {
        $distribution = json_decode($statistics->GuessDistribution, true) ?? array_fill(0, 6, 0);

        if ($turns >= 1 && $turns <= 6) {
            $distribution[$turns - 1]++;
        }

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
