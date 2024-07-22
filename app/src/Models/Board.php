<?php

namespace AnnaHjerpyn\Custom\Models;

use SilverStripe\Forms\TextField;
use SilverStripe\ORM\DataObject;

class Board extends DataObject
{
    private static $table_name = 'Board';

    private static $db = [
        'CorrectWord' => 'Varchar(5)',
        'GameState' => 'Int',
        'BoardID' => 'Text',
    ];

    private static $has_many = [
        'Guesses' => Guess::class,
    ];

    private static $summary_fields = [
        'BoardID' => 'Board ID',
        'CorrectWord' => 'CorrectWord',
        'GameState' => 'GameState',
    ];

    public function onBeforeWrite()
    {
        if (!$this->BoardID) {
            $this->BoardID = $this->getUniqueKey();
        }

        parent::onBeforeWrite();
    }

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
