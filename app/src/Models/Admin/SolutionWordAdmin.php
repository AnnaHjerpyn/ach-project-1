<?php

namespace AnnaHjerpyn\Custom\Models\Admin;
use SilverStripe\Admin\ModelAdmin;
use AnnaHjerpyn\Custom\Models\SolutionWord;

class SolutionWordAdmin extends ModelAdmin
{
    private static $managed_models = SolutionWord::class;
    private static $url_segment = 'solution-word';
    private static $menu_title = 'Solution Word';
}

