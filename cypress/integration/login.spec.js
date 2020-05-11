describe('Logging in', () => {
  it('logs in', () => {
    cy.login();
    cy.location('pathname', { timeout: 20000 }).should('equal', '/');
  });
});
