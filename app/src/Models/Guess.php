<?php

namespace AnnaHjerpyn\Custom\Models;

use SilverStripe\Forms\TextField;
use SilverStripe\ORM\DataObject;

class Guess extends DataObject
{
    private static $table_name = 'Guess';

    private static $db = [
        'Guess' => 'Varchar(5)',
    ];

    private static $has_one = [
        'Board' => Board::class,
    ];

    private static $summary_fields = [
        'Guess' => 'Guess',
    ];

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();

        $fields->removeByName([
            'BoardID',
        ]);

        return $fields;
    }
}
