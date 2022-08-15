/// <reference types="cypress" />
/**
 @type {Cypress.PluginConfig}
*/

//Cucumber plugin 
const cucumber = require('cypress-cucumber-preprocessor').default;
//Allure report plugin
const allureWriter = require('@shelex/cypress-allure-plugin/writer');

module.exports = (on, config) => {
  on('file:preprocessor', cucumber());
  allureWriter(on, config);
  return config;
};

