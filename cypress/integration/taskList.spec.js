import { BASIC_USER_PROD } from '../../src/constants/jobCodes'

describe('The Task List', () => {
  beforeEach(() => {
    cy.server();
    cy.localLogin({name: 'TEST', role: BASIC_USER_PROD});
    cy.route('POST', '/api/v1/system_intake').as('postSystemIntake');
    cy.route('PUT', '/api/v1/system_intake').as('putSystemIntake');
    cy.visit('/governance-task-list/new');
  });

  it('shows a continue link when a user clicks back until they reach the task list', () => {
    cy.wait(500);
    cy.get('[data-testid="intake-start-btn"]')
      .should('be.visible')
      .click();

    cy.systemIntake.contactDetails.fillNonBranchingFields();
    cy.get('#IntakeForm-HasIssoNo')
      .check({ force: true })
      .should('be.checked');

    cy.get('#IntakeForm-NoGovernanceTeam')
      .check({ force: true })
      .should('be.checked');

    cy.contains('button', 'Next').click();
    cy.wait('@postSystemIntake');

    cy.contains('h1', 'Request details');

    cy.get('#IntakeForm-RequestName').type('Test Request Name');

    // User should be redirected to /system/:uuid/contact-details
    cy.go('back');
    cy.contains('h1', 'Contact details');
    cy.location().should(loc => {
      expect(loc.pathname).to.not.include('new');
    });

    // User should see that they can continue instead of starting a new intake
    cy.go('back');
    cy.contains('h3', 'Fill in the request form');
    cy.contains('a', 'Continue').should('be.visible');
  });
});
