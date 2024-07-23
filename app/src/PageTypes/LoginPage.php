<?php

namespace AnnaHjerpyn\Custom\PageTypes;

use Page;
use SilverStripe\Forms\TextField;

class LoginPage extends Page {

    private static $singular_name = 'Login Page';
    private static $plural_name = 'Login Pages';
    private static $table_name = 'LoginPage';
    private static $description = 'Displays the login page content.';

    private static $db = [
        'ContentTitle' => 'HTMLVarchar',
    ];

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();

        $fields->addFieldsToTab('Root.Main', [
            TextField::create('ContentTitle', 'Title')->addExtraClass('stacked'),
        ], 'Content');

        return $fields;
    }
}
