describe('Logging in', () => {
  it('logs in with okta', () => {
    cy.login();
    cy.location('pathname', { timeout: 20000 }).should('equal', '/');
  });

  it('logs in with local auth', () => {
    cy.visit('/login');

    cy.get('[data-testid="LocalAuth-Visit"]').click();
    cy.get('[data-testid="LocalAuth-EUA"]').type('TEST');
    cy.get('input[value="EASI_D_508_USER"]').check();
    cy.get('[data-testid="LocalAuth-Submit"]').click();

    cy.get('h1', { timeout: 20000 }).should('have.text', '508 Requests');
  });
});
