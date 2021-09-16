import {
  ACCESSIBILITY_ADMIN_DEV,
  ACCESSIBILITY_TESTER_DEV,
  BASIC_USER_PROD,
  GOVTEAM_DEV
} from '../../src/constants/jobCodes';

describe('Homepage', () => {
  it('shows the basic homepage for no user roles', () => {
    cy.localLogin({ name: 'USR1' });
    cy.contains('h2', 'My governance requests');
  });

  it('shows the basic homepage for no user roles', () => {
    cy.localLogin({ name: 'USR1' });
    cy.contains('h2', 'My governance requests');
  });

  it('shows the basic homepage for basic easi role', () => {
    cy.localLogin({ name: 'USR2', role: BASIC_USER_PROD });
    cy.contains('h2', 'My governance requests');
    cy.contains('a', 'IT Governance');
    cy.contains('a', 'Section 508 compliance');
  });

  it('shows the 508 table to 508 admins', () => {
    cy.localLogin({ name: 'USR3', role: ACCESSIBILITY_ADMIN_DEV });
    cy.contains('h1', '508 Requests');
    cy.get('a:contains("IT Governance")').should('not.exist');
    cy.get('a:contains("Section 508 compliance")').should('not.exist');
  });

  it('shows the 508 table to 508 testers', () => {
    cy.localLogin({ name: 'USR4', role: ACCESSIBILITY_TESTER_DEV });
    cy.contains('h1', '508 Requests');
    cy.get('a:contains("IT Governance")').should('not.exist');
    cy.get('a:contains("Section 508 compliance")').should('not.exist');
  });

  it('shows the governance table to GRT folks', () => {
    cy.localLogin({ name: 'USR5', role: GOVTEAM_DEV });
    cy.contains('button', 'Open Requests');
    cy.get('a:contains("IT Governance")').should('not.exist');
    cy.get('a:contains("Section 508 compliance")').should('not.exist');
  });
});
