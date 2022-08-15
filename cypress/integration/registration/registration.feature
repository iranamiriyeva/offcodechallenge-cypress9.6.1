Feature: Testing functionality of Registration, Password Reset and Login
As a user I should be able to:
1. Create a new account, 
2. Reset my password,
3. Login to the account using my new credentials,
4. Fail to login to the account using my old credentials.

Background:
Given User is on the Home page

    @registration
    #1 Create a user account with random generated data and use the registration function to register an account for this user
    Scenario: As a user I should be able to create a new account
        And navigates to the Registration page
        When User submits the registration form with random data
        Then User should be authenticated and sent to the Home page
    
    @resetPassword
    #2 Use the forgot password function to request a password reset and change it then to a new one
    Scenario: As a user I should be able to request a password reset
        And navigates to the Login page
        When User makes a Password Reset request for the existing account
        Then User gets a Password Reset email
        And follows the link from the email
        And types the new password
        Then User should be authenticated and sent to the Customer Data page     

    @login
    #3 Login with the created user in Scenario 1 (and the new password, which was defined in 1-b)
    Scenario: As a user I should be able to login to my account using the new credentials
        And navigates to the Login page
        And Welcome back heading is displayed
        When User enters the new credentials 
        Then User is authenticated and sent to the Home page 

    @login
    #4 Login with the user credentials in Scenario 1 but using the old password
    Scenario: As a user I should unable to login to my account using the old credentials
        And navigates to the Login page
        And Welcome back heading is displayed
        When User enters the old credentials 
        Then Error message is displayed to the user
        But unable to login to the account    