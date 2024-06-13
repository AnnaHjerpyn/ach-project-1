<?php

namespace AnnaHjerpyn\Custom\Models;

use SilverStripe\Forms\TextField;
use SilverStripe\ORM\DataObject;

class WordBank extends DataObject
{
    private static $table_name = 'WordBank';


    private static $default_sort = 'SortOrder ASC';
    private static $db = [
        'Word' => 'Varchar(255)',
        'SortOrder' => 'Int',
    ];
    private static $summary_fields = [
        'Word' => 'Word'
    ];

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();

        $fields->removeByName([
            'SortOrder',
            'Word',
        ]);

        $fields->addFieldsToTab('Root.Main', [
            TextField::create('Word', 'Word'),
        ]);

        return $fields;
    }
}
