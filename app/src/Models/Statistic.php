<?php

namespace AnnaHjerpyn\Custom\Models;

use SilverStripe\ORM\DataObject;

class Statistic extends DataObject
{
    private static $table_name = 'Statistic';

    private static $db = [
        'Statistics' => 'Text',
    ];

    private static $has_one = [
        'UserAccount' => UserAccount::class,
    ];

    private static $summary_fields = [
        'TotalGamesPlayed' => 'Games Played',
        'TotalWins' => 'Total Wins',
        'WinPercentage' => 'Win %',
        'CurrentStreak' => 'Current Streak',
        'MaxStreak' => 'Max Streak',
    ];

    public function getTotalGamesPlayed()
    {
        $stats = $this->getDecodedStatistics();
        return $stats['totalGamesPlayed'] ?? 0;
    }

    public function getTotalWins()
    {
        $stats = $this->getDecodedStatistics();
        return $stats['totalWins'] ?? 0;
    }

    public function getWinPercentage()
    {
        $stats = $this->getDecodedStatistics();
        $totalGamesPlayed = $stats['totalGamesPlayed'] ?? 0;
        $totalWins = $stats['totalWins'] ?? 0;
        return $totalGamesPlayed > 0 ? round(($totalWins / $totalGamesPlayed) * 100, 2) : 0;
    }

    private function getDecodedStatistics()
    {
        return json_decode($this->Statistics, true) ?: [];
    }

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();

//        $fields->removeByName([
//            '',
//        ]);

        return $fields;
    }
}
