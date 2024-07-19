<?php

namespace AnnaHjerpyn\Custom\Models;

use SilverStripe\Forms\TextareaField;
use SilverStripe\ORM\DataObject;

class UserAccount extends DataObject
{

    private static $table_name = 'UserAccount';

    private static $db = [
        'Username' => 'Text',
        'Password' => 'Text',
        'Statistics' => 'Text',
    ];

    private static $summary_fields = [
        'Username' => 'Username',
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

        $fields->addFieldToTab('Root.Main', TextareaField::create('Statistics', 'Statistics')->setRows(5));

        return $fields;
    }
}
