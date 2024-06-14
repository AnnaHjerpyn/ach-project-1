<?php

namespace AnnaHjerpyn\Custom\SiteConfig;

use InnisMaggiore\PFS\Utilities\Utilities;
use SilverStripe\AssetAdmin\Forms\UploadField;
use SilverStripe\Assets\Image;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\GridField\GridField;
use SilverStripe\Forms\GridField\GridFieldConfig_RecordEditor;
use SilverStripe\Forms\HTMLEditor\HTMLEditorField;
use SilverStripe\Forms\LiteralField;
use SilverStripe\Forms\TextareaField;
use SilverStripe\Forms\TextField;
use SilverStripe\ORM\DataExtension;
use UndefinedOffset\SortableGridField\Forms\GridFieldSortableRows;

class CustomSiteConfig extends DataExtension
{
    private static $db = [

    ];

    private static $has_one = [
        'Favicon' => Image::class,

    ];

    private static $has_many = [

    ];

    private static $owns = [
        'Favicon',

    ];

    public function updateCMSFields(FieldList $fields)
    {

        /*********************
         * MAIN !
         *********************/

        $fields->addFieldsToTab('Root.Main', [
            UploadField::create('Favicon', 'Favicon')->setFolderName('favicon')->setDescription('Use a 32x32 png image named "favicon.png" for maximum compatibility.'),
        ]);
    }

}
