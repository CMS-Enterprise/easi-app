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
  });
});
