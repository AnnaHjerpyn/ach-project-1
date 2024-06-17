<?php

namespace AnnaHjerpyn\Custom\Models;

use SilverStripe\Forms\TextField;
use SilverStripe\ORM\DataObject;

class Board extends DataObject
{
    private static $table_name = 'Board';

    private static $db = [
        'BoardID' => 'Int',
        'CorrectWord' => 'Varchar(255)',
    ];

    private static $summary_fields = [
        'BoardID' => 'BoardID',
        'CorrectWord' => 'CorrectWord'
    ];

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();

        $fields->removeByName([
            'SortOrder',
            'CorrectWord',
            'BoardID',
        ]);

        $fields->addFieldsToTab('Root.Main', [
            TextField::create('BoardID', 'BoardID'),
            TextField::create('CorrectWord', 'CorrectWord'),
        ]);

        return $fields;
    }
}
