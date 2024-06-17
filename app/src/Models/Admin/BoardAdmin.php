<?php

namespace AnnaHjerpyn\Custom\Models\Admin;
use SilverStripe\Admin\ModelAdmin;
use AnnaHjerpyn\Custom\Models\Board;

class BoardAdmin extends ModelAdmin
{
    private static $managed_models = Board::class;
    private static $url_segment = 'board';
    private static $menu_title = 'Board';
}
