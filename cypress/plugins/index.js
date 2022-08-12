/// <reference types="cypress" />

/**
 @type {Cypress.PluginConfig}
*/

//Cucumber plugin 
const cucumber = require('cypress-cucumber-preprocessor').default

module.exports = (on, config) => {
  on('file:preprocessor', cucumber());
}

