<?php

namespace AnnaHjerpyn\Custom\Models\Admin;

use AnnaHjerpyn\Custom\Models\UserAccount;
use AnnaHjerpyn\Custom\Models\WordBank;
use SilverStripe\Admin\ModelAdmin;

class UserAccountAdmin extends ModelAdmin
{
    private static $managed_models = UserAccount::class;
    private static $url_segment = 'user-account';
    private static $menu_title = 'User Account';
}
