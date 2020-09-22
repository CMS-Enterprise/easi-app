describe('The System Intake Form', () => {
  before(() => {
    cy.login();
    // TODO HACK
    cy.wait(1000);
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.server();
    cy.route('POST', '/api/v1/system_intake').as('postSystemIntake');
    cy.route('PUT', '/api/v1/system_intake').as('putSystemIntake');
    cy.restoreLocalStorage();
    cy.visit('/governance-task-list/new');
  });

  it('shows a continue link when a user clicks back until they reach the task list', () => {
    cy.contains('button', 'Start').click();

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

    cy.get('#IntakeForm-RequestName')
      .type('Test Request Name')
      .should('have.value', 'Test Request Name');

    cy.contains('button', 'Back').click();
    cy.wait('@putSystemIntake');

    // Request Details
    cy.systemIntake.requestDetails.fillNonBranchingFields();

    cy.get('#IntakeForm-HasFundingSourceNo')
      .check({ force: true })
      .should('be.checked');

    cy.contains('button', 'Next').click();

    cy.wait('@putSystemIntake');

    // Review
    cy.contains('h1', 'Check your answers before sending');
  });
});
