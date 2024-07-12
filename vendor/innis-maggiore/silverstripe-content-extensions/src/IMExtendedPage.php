<?php

namespace InnisMaggiore\SilverstripeContentExtensions;

use SilverStripe\ErrorPage\ErrorPage;
use Silverstripe\ORM\DataExtension;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\TextField;
use SilverStripe\Forms\TextareaField;
use SilverStripe\CMS\Model\SiteTree;
use SilverStripe\CMS\Model\RedirectorPage;

class IMExtendedPage extends DataExtension
{
    private static $db = array(
        'H1'            => 'Varchar(250)',
        'PageTitle'     => 'Varchar(250)',
        'MetaKeywords'  => 'Text',
    );

    public function updateCMSFields(FieldList $fields) {
        $owner = $this->getOwner();

        if (is_subclass_of($owner, SiteTree::class) && !is_a($owner, RedirectorPage::class) && !is_a($owner, ErrorPage::class)) {
            $fields->addFieldToTab("Root.Main", TextField::create("H1", "H1"), "Content");
            $fields->addFieldToTab('Root.Main', TextField::create('PageTitle', 'Page Title'), 'MetaDescription');
            // this isn't plugged into a template. For reference for content folks
            $fields->addFieldToTab('Root.Main', TextareaField::create('MetaKeywords', 'Keywords'), 'MetaDescription');
        }
    }
}
