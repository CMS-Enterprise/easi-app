// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './businessCase';
import './commands';
import '@cypress/code-coverage/support';
import 'cypress-plugin-snapshots/commands';
import './login';
import './systemIntake';
import './trbRequest';

// Code to hide the annoying XHR/fetch requests in the cypress command log.
// https://gist.github.com/simenbrekken/3d2248f9e50c1143bf9dbe02e67f5399
const app = window.top;
if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.innerHTML =
    '.command-name-request, .command-name-xhr { display: none }';
  style.setAttribute('data-hide-command-log-request', '');

  app.document.head.appendChild(style);
}

beforeEach(() => {
  cy.exec(`scripts/dev db:clean`);
  cy.exec(`scripts/dev db:seed`);
});

afterEach(() => {
  cy.document().toMatchImageSnapshot();
});

// Alternatively you can use CommonJS syntax:
// require('./commands')
