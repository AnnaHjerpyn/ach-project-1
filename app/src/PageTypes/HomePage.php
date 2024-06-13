<?php
namespace AnnaHjerpyn\Custom\PageTypes;

use AnnaHjerpyn\Custom\PageTypes\Controllers\HomePageController;
use Page;
use SilverStripe\Forms\TextField;

class HomePage extends Page {

    private static $singular_name = 'Home Page';
    private static $plural_name = 'Home Pages';
    private static $table_name = 'HomePage';
    private static $description = 'Displays the home page content.';
    private static $controller_name = HomePageController::class;

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
