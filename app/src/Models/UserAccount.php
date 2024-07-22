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
    ];

    private static $has_many = [
        'Statistics' => Statistic::class,
    ];

    private static $summary_fields = [
        'Username' => 'Username',
    ];

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();

        //$fields->addFieldToTab('Root.Main', TextareaField::create('Statistics', 'Statistics')->setRows(5));

        return $fields;
    }
}
