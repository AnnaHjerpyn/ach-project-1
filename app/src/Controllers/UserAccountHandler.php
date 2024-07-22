<?php

namespace AnnaHjerpyn\Custom\Controllers;


use AnnaHjerpyn\Custom\Models\UserAccount;
use PageController;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Security\LoginForm;

class UserAccountController extends LoginForm
{

    private static $allowed_actions = [
        'createUser',
        'getUser',
        'updateUser',
        'updateStatistics',
    ];

    private static $url_handlers = [
        'createUser' => 'createUser',
        'getUser' => 'getUser',
        'updateUser' => 'updateUser'
    ];

    public function setUser(HTTPRequest $request) {

        //Retrieve the data with the username and password created by user
        $submittedData = json_decode($request->getBody(), true);
        // Create a new instance of UserAccount
        $user = new UserAccount();

        // Use the submitted data to set the user's information
        $user->Username = $submittedData['Username'] ?? '';
        $user->Password = $submittedData['Password'] ?? '';

        // Statistics is initialized to an empty state for a new user

        // Save the User to the db
        $user->write();

        // Return the user's username they are using
        $response = $this->getResponse()->addHeader('Content-Type', 'application/json');
        $response->setBody(json_encode(['Username' => $user->Username]));
        // Return the user's username
        return $response;

    }

    public function getUser() {

        // Grab the username ID
        $username = strval($this->getRequest()->param('ID'));
        // Find the username
        $user = UserAccount::get()->filter('Username', $username)->first();

        //
    }

    public function updateUser() {

    }

    protected function init()
    {
        parent::init();
    }

    public function getAuthenticatorName()
    {
        // TODO: Implement getAuthenticatorName() method.
    }

    protected function getFormFields()
    {
        // TODO: Implement getFormFields() method.
    }

    protected function getFormActions()
    {
        // TODO: Implement getFormActions() method.
    }
}
