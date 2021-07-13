describe('The Task List', () => {
  beforeEach(() => {
    cy.server();
    cy.localLogin({ name: 'TEST' });
    cy.route('PUT', '/api/v1/system_intake').as('putSystemIntake');
    cy.visit('/system/request-type');
    cy.get('#RequestType-NewSystem').check({ force: true });
    cy.contains('button', 'Continue').click();
    cy.contains('a', 'Get started').click();
  });

  it('shows a continue link when a user clicks back until they reach the task list', () => {
    cy.wait(1000);
    cy.get('[data-testid="intake-start-btn"]').should('be.visible').click();

    cy.systemIntake.contactDetails.fillNonBranchingFields();
    cy.get('#IntakeForm-HasIssoNo').check({ force: true }).should('be.checked');

    cy.get('#IntakeForm-NoGovernanceTeam')
      .check({ force: true })
      .should('be.checked');

    cy.contains('button', 'Next').click();
    cy.wait('@putSystemIntake');

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
