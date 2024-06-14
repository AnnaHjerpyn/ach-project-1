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

        $fields->addFieldsToTab('Root.Main', [
            TextField::create('Word', 'Solution Word'),
        ]);

        return $fields;
    }

    // Ensure only one record exists
    public static function get_current_solution()
    {
        return self::get()->first();
    }

    public static function set_solution($word)
    {
        // Getting the current solution
        $solution = self::get_current_solution();
        // Checking to see if it actually exists
        if (!$solution) {
            $solution = self::create();
        }
        // Save the word
        $solution->Word = $word;
        // Now save it to the DB !
        $solution->write();
    }
}
