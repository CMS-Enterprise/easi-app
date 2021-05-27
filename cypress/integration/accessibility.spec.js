import { formatDate } from '../../src/utils/date';

describe('The System Intake Form', () => {
  before(() => {
    cy.login();
    // TODO HACK
    cy.wait(1000);
    cy.saveLocalStorage();
  });

//   beforeEach(() => {
//     cy.server();
//     cy.route('POST', '/api/v1/system_intake').as('postSystemIntake');
//     cy.route('PUT', '/api/v1/system_intake').as('putSystemIntake');
//     cy.restoreLocalStorage();
//     cy.visit('/system/new');
//   });

  it('can create a request and see it on the homepage', () => {
    // Contact Details
    cy.visit('/508/requests/new');
    cy.contains('h1', 'Request 508 testing')
    cy.contains('h2', "Choose the application you'd like to test")
    cy.get('#508Request-IntakeId')
      .type('TACO - 000000{enter}')
      .should('have.value', 'TACO - 000000');
    cy.contains('button', 'Send 508 testing request').click();
    cy.contains('li', 'Home')
    cy.contains('li', 'TACO')
    cy.contains('.usa-alert--success', '508 testing request created. We have sent you a confirmation email.')
    cy.contains('h1', 'TACO')
    cy.contains('h2', 'Next step: Provide your documents')
    cy.contains('.usa-button', 'Upload a document')
    cy.get('.accessibility-request__side-nav').within(() => {
      cy.contains('h2', 'Test Dates and Scores')
      cy.get('.accessibility-request__other-details').within(() => {
        cy.contains('dt', 'Submission date')
        const dateString = formatDate(new Date().toISOString())
        cy.contains('dl', dateString)

        cy.contains('dt', 'Business Owner')
        cy.contains('dl', 'Shane Clark, OIT')

        cy.contains('dt', 'Project name')
        cy.contains('dl', 'TACO')

        cy.contains('dt', 'Lifecycle ID')
        cy.contains('dl', '000000')
      })

      cy.contains('a', '508 testing templates (opens in a new tab)')
      cy.contains('a', 'Steps involved in 508 testing (opens in a new tab)')
      // cy.contains('button', 'Remove this request from EASi')
    })
  });
});
