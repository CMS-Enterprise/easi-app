import { ACCESSIBILITY_ADMIN_DEV } from '../../src/constants/jobCodes'

describe('Logging in', () => {
  it('logs in with okta', () => {
    cy.login();
    cy.location('pathname', { timeout: 20000 }).should('equal', '/');
  });

  it('logs in with local auth', () => {
    cy.localLogin({name: 'TEST', role: ACCESSIBILITY_ADMIN_DEV});

    cy.get('h1', { timeout: 20000 }).should('have.text', '508 Requests');
  });
});
