import {Given, When, And, Then} from 'cypress-cucumber-preprocessor/steps';
import {addProductToWishlist, verifyWishlistProducts, addProductToBasket} from '../../support/pageobject/shopping-pageobject';

//Global Variables
let productData;

before(() => {  
  cy.visit(Cypress.env('baseUrl'));
  cy.confirmCookies();
});

beforeEach(() => {
  Cypress.Cookies.preserveOnce(
    'cto_bundle', 'Solvemate-widget-project-config', 'snowplowOutQueue_snowplowKis_sc_post2', 'snowplowOutQueue_snowplowKis_sc_post2.expires', '_uetsid_exp', 'Solvemate-user-settings',
    'widget-message-viewer-open-date', '_uetvid', '_uetvid_exp', '_uetsid', 'wishListAdd', 'uid', 'sortingChanged', 'scarab.visitor', 'route-deinbett', 'optOutsTouched', 'optOuts', 'optOutAccepted', 'lastViewedDoorpage', 'i18next', 'fr', 'custECM', 'cto_bundle', 
    '_uetvid', '_uetsid', '_sp_ses.2241', '_sp_id.2241', '_gcl_au', '_ga_XBDL25ZST8', '_qa', '_fbp', 'TID', 'MULTIGROUP_TEST', 'MUID', 'IDE', 'HE256', 'HE'
    );
});

/*after(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});*/

// ******************************************************************************************
//SCENARIO-1 | Add products to Wishlist
Given('User navigates to the Menu list', () => {
    cy.get('.menu__entry a.menu__linkHref')
    .invoke('attr', 'href')
    .then(href => {
      cy.visit(Cypress.env('baseUrl')+href);
    });

    cy.login(Cypress.env('email'), Cypress.env('password'));
});

When('Chooses {int} random items by clicking on the wishlist icon', (quantity) => {  
  productData = addProductToWishlist(quantity); 
}); 

Then('The list of items are added to the Wishlist', () => {
  verifyWishlistProducts(productData[0]);
});

// ******************************************************************************************
//SCENARIO-2 | Add all 5 existing items to Basket
Given('User navigates to the Wishlist page', () => {
   cy.login(Cypress.env('email'), Cypress.env('password'));   
   cy.get('.headerElement--wishlist a').click({force: true});
   cy.url().should('include', 'wunschliste');
});

When('Clicks on Add to basket button', () => {
  addProductToBasket(productData[1]);
});

Then ('A message is displayed about successful item addition', () => {
  cy.go('forward');
  cy.wait(3000);
  cy.get('.headline').should('have.text', 'Dein Warenkorb');
  cy.get('.cartEntries__deliveryTypeSubHeader').contains('Einmalig pro Bestellung');
});