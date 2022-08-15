/// <reference types="cypress" />
import {loginHeaderLink, loginEmail, loginPassword, submitLogin, cookieSettingsPopup, confirmAllCookies} from '../support/pageobject/registration-pageobject';

// ******************************************************************************************
//To confirm Cookies popup
Cypress.Commands.add('confirmCookies', () => {
  cy.get('body').then($body => {
    if ($body.find('.consentForm__root').length === 1) {
      cy.contains(confirmAllCookies).click();
    }
    })
}); 

// ******************************************************************************************
//Login method
Cypress.Commands.add('login', (email, password) => {
    cy.get(loginHeaderLink).click();
    cy.get(loginEmail).type(email);
    cy.get(loginPassword).type(password);
    cy.get(submitLogin).click();
});

// ******************************************************************************************
//Navigate to Login page
Cypress.Commands.add('navigateToLogin', () => {
  cy.visit(Cypress.env('baseUrl')+'login');
  cy.title().should('equal', 'deinBett.de - Anmelden');
});

// ******************************************************************************************
//To open an email on window
Cypress.Commands.add('forceVisit', url => {
  cy.window().then(win => {
      return win.open(url, '_self'); 
    });
});