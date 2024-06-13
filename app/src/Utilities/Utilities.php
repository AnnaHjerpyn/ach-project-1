<?php

namespace InnisMaggiore\PFS\Utilities;

use SilverStripe\Forms\GridField\GridField;
use SilverStripe\Forms\GridField\GridFieldAddExistingAutocompleter;
use SilverStripe\Forms\GridField\GridFieldAddNewButton;
use SilverStripe\Forms\GridField\GridFieldConfig_RecordEditor;
use SilverStripe\Forms\GridField\GridFieldConfig_RelationEditor;
use SilverStripe\Forms\GridField\GridFieldDataColumns;
use SilverStripe\Forms\GridField\GridFieldEditButton;
use SilverStripe\ORM\ArrayList;
use SilverStripe\ORM\SS_List;
use SilverStripe\View\ArrayData;
use UndefinedOffset\SortableGridField\Forms\GridFieldSortableRows;

class Utilities
{
    public static function buildGridField($fieldName, $displayName, SS_List $dataList, $displayFields = null, $includeSortOrder = true) {
        $gridFieldConfig = GridFieldConfig_RecordEditor::create();

        if ($includeSortOrder) {
            $gridFieldConfig->addComponent(new GridFieldSortableRows('SortOrder'));
        }

        if ($displayFields) {
            $gridFieldConfig->getComponentByType(GridFieldDataColumns::class)->setDisplayFields($displayFields);
        }

        $gridfield = GridField::create(
            $fieldName,
            $displayName,
            $dataList,
            $gridFieldConfig
        );

        return $gridfield;
    }

    // Used when you need a gridfield to link to an existing object, rather than create a new object.
    public static function buildGridFieldExisting($fieldName, $displayName, SS_List $dataList, $displayFields = null, $includeSortOrder = false, $removeAddButton = true) {
        $gridFieldConfig = GridFieldConfig_RelationEditor::create();

        // Move link button to left side.
        $gridFieldConfig->removeComponentsByType(GridFieldAddExistingAutocompleter::class);
        $gridFieldConfig->addComponent(new GridFieldAddExistingAutocompleter('buttons-before-left'));

        if ($includeSortOrder) {
            $gridFieldConfig->addComponent(new GridFieldSortableRows('SortOrder'));
        }

        if ($displayFields) {
            $gridFieldConfig->getComponentByType(GridFieldDataColumns::class)->setDisplayFields($displayFields);
        }

        if ($removeAddButton) {
            $gridFieldConfig->removeComponentsByType([
                GridFieldAddNewButton::class,
                GridFieldEditButton::class,
            ]);
        }

        $gridfield = GridField::create(
            $fieldName,
            null,
            $dataList,
            $gridFieldConfig
        );

        return $gridfield;
    }

    public static function arrayToArrayList($flatArray, $key) {
        $array = new ArrayList();
        foreach ($flatArray as $listItem) {
            $array->push(new ArrayData([
                $key => $listItem
            ]));
        }

        return $array;
    }
}
