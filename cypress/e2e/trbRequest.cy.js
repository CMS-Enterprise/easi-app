describe('Technical Assistance', () => {
  it('creates a new trb request', () => {
    cy.localLogin({ name: 'ABCD' });
    // Nav to trb base
    cy.contains('a', 'Technical Assistance').click();
    // Start request
    cy.contains('a', 'Start a new request').click();
    // Selects the first implied request type
    cy.contains('a', /^Start$/).click();
    // Continue through process steps
    cy.contains('a', 'Continue').click();
  });
});
