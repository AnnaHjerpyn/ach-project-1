<?php

namespace AnnaHjerpyn\Custom\PageTypes;

use AnnaHjerpyn\Custom\Controllers\UserAccountController;
use Page;

class ComponentPage extends Page
{
    private static $table_name = 'ComponentPage';
    private static $singular_name = 'Component Page';
    private static $plural_name = 'Component Pages';
    private static $controller_name = UserAccountController::class;

    public static function getSearchFilter()
    {
        return [];
    }

    public static function getTitleFields()
    {
        return ['Title'];
    }

    public static function getContentFields()
    {
        return ['Content'];
    }

    public function getPageBreadCrumbs()
    {
        $link = $this->AbsoluteLink();

        return str_replace(array("/" . $this->URLSegment, "http://", "https://", "/"), array("", "", "", " > "), $link);
    }


}
