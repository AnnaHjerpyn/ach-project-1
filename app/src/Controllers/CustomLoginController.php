<?php

namespace AnnaHjerpyn\Custom\Controllers;

use AnnaHjerpyn\Custom\Models\Form\CustomLoginForm;
use PageController;
use SilverStripe\Control\Email\Email;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\ORM\ValidationResult;
use SilverStripe\Security\Member;
use SilverStripe\Security\MemberAuthenticator\LoginHandler;
use SilverStripe\Security\MemberAuthenticator\MemberAuthenticator;
use SilverStripe\Security\IdentityStore;
use SilverStripe\Core\Injector\Injector;

class CustomLoginController extends PageController
{
    private static $allowed_actions = [
        'LoginForm',
        'doLogin',
        'doRegister',
    ];

    private static $url_handlers = [
        'doLogin' => 'doLogin',
        'doRegister' => 'doRegister',
    ];

    public function LoginForm()
    {
        // Returns the custom login form
        return CustomLoginForm::create($this, 'LoginForm');
    }

    public function doLogin(HTTPRequest $request)
    {
        $result = $this->_process_login($request);

        if ($result->isValid()) {
            return $this->redirect('/home');
        } else {
            $this->getRequest()->getSession()->set('Message', [
                'Type' => 'bad',
                'Text' => 'Login failed. Please check your credentials.'
            ]);
            return $this->redirectBack();
        }
    }

    public function doRegister(HTTPRequest $request)
    {
        $result = $this->_process_register($request);

        if (!empty($result['success'])) {
            return $this->redirect('/home');
        } else {
            $this->getRequest()->getSession()->set('Message', [
                'Type' => 'bad',
                'Text' => 'Registration failed. Please check your details and try again.'
            ]);
            return $this->redirectBack();
        }
    }

    private function _process_login(HTTPRequest $request)
    {
        $submittedData = json_decode($request->getBody(), true);
        // All of the stuff I'd need for the user information
        $email = $submittedData['login_email'];
        $password = $submittedData['login_password'];
        $rememberMe = $submittedData['remember'];

        $data = [
            'Email' => $email,
            'Password' => $password,
            'Remember' => $rememberMe
        ];

        // Create a ValidationResult object
        $result = ValidationResult::create();

        // Use Dependency Injection to get the MemberAuthenticator instance
        $authenticator = Injector::inst()->get(MemberAuthenticator::class);

        // Create a LoginHandler
        $loginHandler = new LoginHandler('auth', $authenticator);

        // Check login credentials
        $member = $loginHandler->checkLogin($data, $request, $result);

        if ($member && !$member->inGroup('Wordle-User')) {
            // Logout if user is not in the 'site-users' group
            Injector::inst()->get(IdentityStore::class)->logOut($request);
            $result->addError('The provided details don\'t seem to be correct. Please try again.');
        } elseif ($member) {
            // Perform login if the user is in the right group
            $loginHandler->performLogin($member, $data, $request);
        } else {
            // Handle cases where login fails
            $result->addError('The provided details don\'t seem to be correct. Please try again.');
        }

        return $result;
    }

    private function _process_register(HTTPRequest $request)
    {
        $submittedData = json_decode($request->getBody(), true);
        // All of the stuff I'd need for the user information
        $email = $submittedData['register_email'];
        $password1 = $submittedData['register_password1'];
        $password2 = $submittedData['register_password2'];

        $result = ValidationResult::create();

        // Basic validation
        if ($password1 !== $password2) {
            $result->addError('Passwords do not match.');
            return $result;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $result->addError('Invalid email address.');
            return $result;
        }

        // Create the member
        $member = Member::create();
        $member->Email = $email;
        $member->write();

        // Add to the 'Wordle-User' group
        $member->addToGroupByCode('Wordle-User');

        // Set the password
        $member->changePassword($password1);

        // Attempt login
        $authenticator = Injector::inst()->get(MemberAuthenticator::class);
        $data = [
            'Email' => $email,
            'Password' => $password1,
            'Remember' => true
        ];

        $member = $authenticator->authenticate($data, $request, $result);

        if ($member) {
            $identityStore = Injector::inst()->get(IdentityStore::class);
            $identityStore->logIn($member, true, $request);

            return ['success' => true];
        } else {
            return $result;
        }
    }
}
