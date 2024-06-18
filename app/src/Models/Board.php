<?php

namespace AnnaHjerpyn\Custom\Models;

use League\Csv\Query\Row;
use SilverStripe\Forms\TextField;
use SilverStripe\ORM\DataObject;

class Board extends DataObject
{
    private static $table_name = 'Board';

    private static $db = [
        'CorrectWord' => 'Varchar(255)',
        'GameState' => 'Int',
    ];

    private static $has_many = [
        'Row' => Te::class,
    ];

    private static $summary_fields = [
        'ID' => 'Board ID',
        'CorrectWord' => 'CorrectWord',
        'GameState' => 'GameState',
    ];

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();

        $fields->removeByName([
            'SortOrder',
            'CorrectWord',
            'GameState',
            'Row',
        ]);

        $fields->addFieldsToTab('Root.Main', [
            TextField::create('CorrectWord', 'CorrectWord'),
            TextField::create('Game State', 'Game State'),

        ]);

        return $fields;
    }
}
