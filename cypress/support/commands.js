// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// import { DateTime } from 'luxon';

import 'cypress-file-upload';

/** Get an element by data-testid attribute */
Cypress.Commands.add('getByTestId', (testId, options = {}) =>
  cy.get(`[data-testid="${testId}"]`, options)
);

/**
 * Returns a date string in MM/dd/yyyy format
 *
 * Accepts an options object with years, months, and days to adjust the date
 *
 * Ex: cy.getDateString({ years: 1, months: 0, days: 0 }) returns date one year in future
 */
// Cypress.Commands.add(
//   'getDateString',
//   ({ years, months = 0, days = 0 } = {}) => {
//     const date = DateTime.now().plus({ years, months, days });
//     const formatted = date.toFormat('MM/dd/yyyy');
//     return cy.wrap(formatted);
//   }
// );
