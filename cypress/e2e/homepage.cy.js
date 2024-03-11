import {
  ACCESSIBILITY_ADMIN_DEV,
  ACCESSIBILITY_TESTER_DEV,
  BASIC_USER_PROD,
  GOVTEAM_DEV
} from '../../src/constants/jobCodes';

describe('Homepage', () => {
  // These tests use the same user, but with different roles
  // We shouldn't really need to log in as different users to test this functionality
  it('shows the basic homepage for no user roles', () => {
    cy.localLogin({ name: 'E2E1' });
    cy.contains('h3', 'My open requests');
  });

  it('shows the basic homepage for basic easi role', () => {
    cy.localLogin({ name: 'E2E1', role: BASIC_USER_PROD });
    cy.contains('h3', 'My open requests');
  });

  it('shows the 508 table to 508 admins', () => {
    cy.localLogin({ name: 'E2E1', role: ACCESSIBILITY_ADMIN_DEV });
    cy.contains('h1', '508 Requests');
  });

  it('shows the 508 table to 508 testers', () => {
    cy.localLogin({ name: 'E2E1', role: ACCESSIBILITY_TESTER_DEV });
    cy.contains('h1', '508 Requests');
  });

  it('shows the governance table to GRT folks', () => {
    cy.localLogin({ name: 'E2E1', role: GOVTEAM_DEV });
    cy.contains('button', 'Open requests');
  });
});
