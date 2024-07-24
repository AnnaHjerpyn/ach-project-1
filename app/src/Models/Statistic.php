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
        'GuessDistribution' => 'Text',
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

    public static function getUserStatistics(Member $member)
    {
        return self::get()->filter('MemberID', $member->ID)->first();
    }

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();

        return $fields;
    }

    public function getGuessDistributionArray()
    {
        return json_decode($this->GuessDistribution, true) ?? array_fill(0, 6, 0);
    }
}
