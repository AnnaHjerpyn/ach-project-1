<?php

namespace AnnaHjerpyn\Custom\Controllers;

use PageController;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Security\Member;
use SilverStripe\Security\Security;
use AnnaHjerpyn\Custom\Models\Statistic;

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
        'getGuessDistribution'=> 'getGuessDistribution',
    ];


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
            'totalGamesPlayed' => $statistics->getTotalGamesPlayed(),
            'totalWins' => $statistics->getTotalWins(),
            'winPercentage' => $statistics->getWinPercentage(),
            'currentStreak' => $statistics->CurrentStreak,
            'maxStreak' => $statistics->MaxStreak,
        ]);
    }

    public function updateStatistics(HTTPRequest $request)
    {
        $member = Security::getCurrentUser();

        if (!$member) {
            return $this->getErrorResponse(403, 'You must be logged in to update statistics.');
        }

        $data = json_decode($request->getBody(), true);

        if (!$data || !isset($data['totalGamesPlayed'], $data['totalWins'], $data['currentStreak'], $data['maxStreak'])) {
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

        $statistics->write();

        return $this->jsonResponse([
            'message' => 'Statistics updated successfully',
        ]);
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
