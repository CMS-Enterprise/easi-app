Cypress.Commands.add('login', () => {
  cy.server();
  cy.route('POST', '/api/v1/authn').as('authn');
  cy.route('GET', '/oauth2/*/.well-known/openid-configuration').as(
    'oidcConfig'
  );
  cy.route('POST', '/oauth2/*').as('oauthPost');
  cy.route('GET', '/oauth2/*').as('oauthGet');

  cy.visit('/signin');

  cy.get('#okta-signin-username').type(Cypress.env('username', { log: false }));
  cy.get('#okta-signin-password').type(Cypress.env('password', { log: false }));
  cy.get('#okta-signin-submit').click();

  cy.wait(['@authn']);
  cy.get('.beacon-loading').should('not.exist');
  cy.get('body').then($body => {
    if ($body.find('input[name="answer"]').length) {
      cy.get('input[name="answer"]').then(() => {
        cy.task('generateOTP', Cypress.env('otpSecret')).then(token => {
          cy.get('input[name="answer"]').type(token, { log: false });
          cy.get('input[name="rememberDevice"]').check({ force: true });
          cy.get('input[value="Verify"').click();
          cy.wait('@oidcConfig');
        });
      });
    }
  });
});
