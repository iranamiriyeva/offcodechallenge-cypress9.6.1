import {Given, When, And, Then} from 'cypress-cucumber-preprocessor/steps';
import {randomString, randomEmail, randomPassword, navigateToRegistration, registerAccount, passwordResetRequest, setNewPassword, loginFormHeader, accountHeader, userName, invalidCredentialsMessage, getEmailId} from '../../support/pageobject/registration-pageobject';

//Global variables
const serverId = Cypress.env('MAILOSAUR_SERVER');
const firstName = randomString(5);
const lastName = randomString(8);
const testEmail = randomEmail(8, `@${serverId}.mailosaur.net`);
const beforeResetPassword = randomPassword(8);
const resetPassword = randomPassword(8);
let newDate = new Date();
let receivedAfter = newDate.toISOString();
let passwordResetLink;

beforeEach(() => {
  Cypress.Cookies.preserveOnce(
    'cto_bundle', 'Solvemate-widget-project-config', 'snowplowOutQueue_snowplowKis_sc_post2', 'snowplowOutQueue_snowplowKis_sc_post2.expires', '_uetsid_exp', 'Solvemate-user-settings',
    'widget-message-viewer-open-date', '_uetvid', '_uetvid_exp', '_uetsid', 'wishListAdd', 'uid', 'sortingChanged', 'scarab.visitor', 'route-deinbett', 'optOutsTouched', 'optOuts', 'optOutAccepted', 'lastViewedDoorpage', 'i18next', 'fr', 'custECM', 'cto_bundle', 
    '_uetvid', '_uetsid', '_sp_ses.2241', '_sp_id.2241', '_gcl_au', '_ga_XBDL25ZST8', '_qa', '_fbp', 'TID', 'MULTIGROUP_TEST', 'MUID', 'IDE', 'HE256', 'HE'
    );
});

//Pre-Conditions
Given('User is on the Home page', () => {
  cy.visit(Cypress.env('baseUrl'));
  //cy.confirmCookies();
});

// ******************************************************************************************
//SCENARIO-1 | New Account creation
And('navigates to the Registration page', () => {
  navigateToRegistration();
});

When ('User submits the registration form with random data', () => {
  registerAccount(testEmail, beforeResetPassword, firstName, lastName); 
});

Then ('User should be authenticated and sent to the Home page', () => {
  cy.url().should('eq', (Cypress.env('baseUrl') + '/')); 
});

// ******************************************************************************************
//SCENARIO-2 | Reset Password
And('navigates to the Login page', () => {
  cy.get('.headerElement--login').click();
});

When('User makes a Password Reset request for the existing account', () => {
  passwordResetRequest(testEmail);
});

Then('User gets a Password Reset email', () => {
  cy.mailosaurGetMessage(serverId, {sentTo: testEmail}, {receivedAfter: receivedAfter})
  .then((email) => {   
    expect(email.subject).to.equal('Passwort zurücksetzen');    
    passwordResetLink = email.text.links[0].href;
  });
  //passwordResetLink = getEmailId(receivedAfter, serverId);    
   });

And('follows the link from the email', () => {
  cy.forceVisit(passwordResetLink);
  cy.contains('Hier klicken zum Passwort ändern').click();
});

And('types the new password', () => {
  setNewPassword(resetPassword);
});

Then('User should be authenticated and sent to the Customer Data page',  () => {
    cy.url().should('include', 'kundenkonto');
    cy.contains('Deine Kundendaten');
    //cy.mailosaurDeleteAllMessages(serverId); //reset email box
  }
);

// ******************************************************************************************
//SCENARIO-3 | Login with new password
And ('Welcome back heading is displayed', () => {
  cy.get(loginFormHeader).should('have.text', 'Willkommen zurück');
});

When ('User enters the new credentials', () => {
  cy.login(testEmail, resetPassword);
});

Then ('User is authenticated and sent to the Home page', () => {
  cy.get(accountHeader).should('have.value', 'Dein Konto');
  cy.get(userName).should('have.value', `${firstName} ${lastName}`);
});

// ******************************************************************************************
//SCENARIO-4 | Login with old password
When ('User enters the old credentials', () => {
  cy.login(testEmail, beforeResetPassword);
});

Then ('Error message is displayed to the user', () => {
  cy.get(invalidCredentialsMessage).should('have.text', 'Benutzername nicht gefunden oder Passwort falsch.');
});

But ('unable to login to the account', () => {
  cy.get(accountHeader).should('have.value', '');
  cy.get(userName).should('have.value', '');
});