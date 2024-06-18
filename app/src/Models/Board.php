<?php

namespace AnnaHjerpyn\Custom\Models;

use SilverStripe\Forms\TextField;
use SilverStripe\ORM\DataObject;

class Board extends DataObject
{
    private static $table_name = 'Board';

    private static $db = [
        'CorrectWord' => 'Varchar(255)',
    ];

    private static $summary_fields = [
        'ID' => 'Board ID',
        'CorrectWord' => 'CorrectWord'
    ];

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();

        $fields->removeByName([
            'SortOrder',
            'CorrectWord',
        ]);

        $fields->addFieldsToTab('Root.Main', [
            TextField::create('CorrectWord', 'CorrectWord'),
        ]);

        return $fields;
    }
}
