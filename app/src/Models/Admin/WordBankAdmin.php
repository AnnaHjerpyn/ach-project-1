<?php

namespace AnnaHjerpyn\Custom\Models\Admin;

use AnnaHjerpyn\Custom\Models\WordBank;
use SilverStripe\Admin\ModelAdmin;

class WordBankAdmin extends ModelAdmin
{
    private static $managed_models = WordBank::class;
    private static $url_segment = 'word-bank';
    private static $menu_title = 'Word Bank';
}
