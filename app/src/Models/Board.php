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
        'Guesses' => Guess::class,
    ];

    private static $summary_fields = [
        'ID' => 'Board ID',
        'CorrectWord' => 'CorrectWord',
        'GameState' => 'GameState',
    ];

    public function getGuesses(){
        return $this->Guesses()->count();
    }

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();

        $fields->removeByName([
            'GameState',
            'SortOrder',
        ]);

        $fields->addFieldsToTab('Root.Main', [
            TextField::create('CorrectWord', 'CorrectWord'),
        ]);

        return $fields;
    }
}
