<?php

namespace AnnaHjerpyn\Custom\Models;

use SilverStripe\Forms\TextField;
use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\ValidationException;

class SolutionWord extends DataObject
{
    private static $table_name = 'SolutionWord';

    private static $db = [
        'Word' => 'Varchar(255)',
    ];

    private static $summary_fields = [
        'Word' => 'Solution Word'
    ];

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();

        $fields->removeByName([
            'SortOrder',
            'Solution Word',
        ]);

        $fields->addFieldsToTab('Root.Main', [
            TextField::create('Word', 'Solution Word'),
        ]);

        return $fields;
    }
}
