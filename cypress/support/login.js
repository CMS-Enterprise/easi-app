Cypress.Commands.add('login', () => {
  cy.intercept('POST', '/oauth2/*').as('oauthPost');
  cy.intercept('GET', '/oauth2/*').as('oauthGet');

  cy.visit('/signin');

  cy.get('[data-testid="okta-redirect-login"]').should('exist');
  cy.get('#okta-signin-username').should('not.exist');

  cy.task('generateOTP', Cypress.env('otpSecret'), { log: false }).then(
    otpToken => {
      cy.origin(
        Cypress.env('oktaDomain'),
        {
          args: {
            username: Cypress.env('username'),
            password: Cypress.env('password'),
            otpToken
          }
        },
        ({ username, password, otpToken: token }) => {
          Cypress.on('uncaught:exception', err => {
            if (
              !err.message ||
              err.message === 'Script error.' ||
              err.message === 'null'
            ) {
              return false;
            }

            return true;
          });

          cy.get('body', { timeout: 30000 }).then($body => {
            // CMS ELP chooser may appear before the EUA/IDM form.
            // Selectors may need adjustment against the live test IDP.
            if ($body.find('[data-se="okta-idp-anchor"]').length) {
              cy.get('[data-se="okta-idp-anchor"]').first().click();
            }
          });

          cy.get('#okta-signin-username', { timeout: 30000 }).type(username, {
            log: false
          });
          cy.get('#okta-signin-password').type(password, {
            log: false,
            parseSpecialCharSequences: false
          });
          cy.get('#okta-signin-submit').click();

          cy.get('.beacon-loading').should('not.exist');
          cy.get('body').then($body => {
            if ($body.find('input[name="answer"]').length) {
              cy.get('input[name="answer"]').type(token, { log: false });
              cy.get('input[name="rememberDevice"]').check({ force: true });
              cy.get('input[value="Verify"]').click();
            }
          });
        }
      );
    }
  );

  cy.url({ timeout: 20000 }).should('eq', 'http://localhost:3000/');
});

Cypress.Commands.add('localLogin', ({ name, role, allowEasi = true }) => {
  let roles = [];

  if (Array.isArray(role)) {
    roles = role;
  } else if (role) {
    roles = [role];
  }

  if (!allowEasi) {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          'dev-user-config',
          JSON.stringify({
            euaId: name,
            jobCodes: roles,
            favorLocalAuth: true,
            allowEasi: false
          })
        );
      }
    });

    cy.url().should('eq', 'http://localhost:3000/');
    return;
  }

  cy.visit('/signin?local=true');

  cy.get('[data-testid="LocalAuth-EUA"]').type(name);
  if (roles.length) {
    roles.forEach(jobCode => {
      cy.get(`input[value="${jobCode}"]`).check();
    });
  }
  cy.get('[data-testid="LocalAuth-Submit"]').click();

  cy.url().should('eq', 'http://localhost:3000/');
});

Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="signout-link"]').click();
  cy.url().should('eq', 'http://localhost:3000/');
});
