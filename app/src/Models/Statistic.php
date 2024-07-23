<?php

namespace AnnaHjerpyn\Custom\Models;

use SilverStripe\ORM\DataObject;
use SilverStripe\Security\Member;

class Statistic extends DataObject
{
    private static $table_name = 'Statistic';

    private static $db = [
        'TotalGamesPlayed' => 'Int',
        'TotalWins' => 'Int',
        'WinPercentage' => 'Int',
        'CurrentStreak' => 'Int',
        'MaxStreak' => 'Int',
    ];

    private static $has_one = [
        'Member' => Member::class,
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
        return $this->TotalGamesPlayed ?? 0;
    }

    public function getTotalWins()
    {
        return $this->TotalWins ?? 0;
    }

    public function getWinPercentage()
    {
        $totalGamesPlayed = $this->TotalGamesPlayed ?? 0;
        $totalWins = $this->TotalWins ?? 0;
        return $totalGamesPlayed > 0 ? round(($totalWins / $totalGamesPlayed) * 100, 2) : 0;
    }

    public static function getUserStatistics(Member $member)
    {
        return self::get()->filter('MemberID', $member->ID)->first();
    }

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();

        return $fields;
    }
}
