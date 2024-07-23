<?php

namespace AnnaHjerpyn\Custom\Models\Form;

use SilverStripe\Forms\Form;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\FormAction;
use SilverStripe\Forms\PasswordField;
use SilverStripe\Forms\RequiredFields;
use SilverStripe\Forms\TextField;

class CustomLoginForm extends Form
{
    public function __construct($controller, $name)
    {
        $fields = FieldList::create(
            TextField::create('Email', 'Email')
                ->setAttribute('placeholder', 'Enter your email'),
            PasswordField::create('Password', 'Password')
                ->setAttribute('placeholder', 'Enter your password')
        );

        $actions = FieldList::create(
            FormAction::create('doLogin', 'Log in')
                ->addExtraClass('btn btn-primary')
        );

        $required = RequiredFields::create('Email', 'Password');

        parent::__construct($controller, $name, $fields, $actions, $required);
    }
}
