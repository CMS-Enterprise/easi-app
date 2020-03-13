describe('Logging in', () => {
  it('logs in', () => {
    cy.visit('/login');
    cy.get('#okta-signin-username').type(Cypress.env('username'));
    cy.get('#okta-signin-password').type(Cypress.env('password'));
    cy.get('#okta-signin-submit').click();
    cy.task('generateOTP', Cypress.env('otpSecret')).then(token => {
      cy.get('input[type="tel"]').type(token);
    });
    cy.get('input[type="submit"').click();
    cy.contains('EASi Testing');
  });
});
