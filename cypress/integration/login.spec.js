import { ACCESSIBILITY_ADMIN_DEV } from '../../src/constants/jobCodes';

const maxAttempts = 3;
describe('Logging in', () => {
  it(
    'logs in with okta',
    {
      retries: {
        runMode: maxAttempts - 1, // 2 retries when running from `cypress run` (3 total attempts)
        openMode: 0 // 0 retries when running from `cypress open` (1 total attempt)
      }
    },
    () => {
      // Get the current number of retries and sleep 60s before running the test to make sure the One-Time-Password is new
      const currentRetry = cy.state('runnable')._currentRetry; // eslint-disable-line no-underscore-dangle
      if (currentRetry > 0) {
        cy.log(
          `[Attempt ${currentRetry + 1}/${maxAttempts}] Sleeping 60s for OTP`
        );
        cy.wait(60000);
      }
      cy.login();
      cy.location('pathname', { timeout: 20000 }).should('equal', '/');
    }
  );

  it('logs in with local auth', () => {
    cy.localLogin({ name: 'TEST', role: ACCESSIBILITY_ADMIN_DEV });

    cy.get('h1', { timeout: 20000 }).should('have.text', '508 Requests');
  });
});
