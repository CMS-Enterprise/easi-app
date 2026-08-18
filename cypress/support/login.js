const isOpaqueCrossOriginError = err => {
  const msg = `${err?.message || ''}`;
  return (
    /Script error/i.test(msg) ||
    /cross origin page/i.test(msg) ||
    /cross-origin script/i.test(msg) ||
    /^null$/i.test(msg.trim())
  );
};

const requireOktaTestCredentials = () => {
  const username = Cypress.env('username');
  const password = Cypress.env('password');
  const otpSecret = Cypress.env('otpSecret');

  if (!username || !password) {
    throw new Error(
      'cy.login() requires OKTA_TEST_USERNAME and OKTA_TEST_PASSWORD in the environment of the Cypress process (e.g. direnv / .envrc.local).'
    );
  }

  return { username, password, otpSecret };
};

const completeEmbeddedWidgetLogin = ({ username, password, otpSecret }) => {
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
      cy.task('generateOTP', otpSecret, { log: false }).then(token => {
        cy.get('input[name="answer"]').type(token, { log: false });
        cy.get('input[name="rememberDevice"]').check({ force: true });
        cy.get('input[value="Verify"]').click();
      });
    }
  });
};

const completeHostedElpLogin = ({ username, password, otpSecret }) => {
  cy.origin(
    Cypress.env('oktaDomain'),
    { args: { username, password, otpSecret } },
    ({ username: user, password: pass, otpSecret: secret }) => {
      Cypress.on('uncaught:exception', err => {
        const msg = `${err?.message || ''}`;
        if (
          /Script error/i.test(msg) ||
          /cross origin page/i.test(msg) ||
          /cross-origin script/i.test(msg) ||
          /^null$/i.test(msg.trim())
        ) {
          return false;
        }
        return undefined;
      });

      cy.document({ timeout: 30000 }).should(
        'have.property',
        'readyState',
        'complete'
      );
      cy.get('#okta-sign-in', { timeout: 30000 }).should('exist');

      cy.get('body').then($body => {
        if ($body.find('#userFormCspCard button.otherOptionsButton').length) {
          cy.get('#userFormCspCard button.otherOptionsButton')
            .should('be.visible')
            .click();
        }
      });

      cy.get('input[name="identifier"], #okta-signin-username', {
        timeout: 15000
      })
        .filter(':visible')
        .first()
        .clear()
        .type(user, { log: false });

      cy.get('input[name="credentials.passcode"], #okta-signin-password')
        .filter(':visible')
        .first()
        .clear()
        .type(pass, {
          log: false,
          parseSpecialCharSequences: false
        });

      cy.get(
        '#okta-sign-in input[type="submit"][data-type="save"], #okta-signin-submit'
      )
        .filter(':visible')
        .first()
        .click();

      cy.get('body', { timeout: 20000 }).should($mfaBody => {
        const leftPasswordForm =
          $mfaBody.find(
            'input[name="identifier"]:visible, #okta-signin-username:visible'
          ).length === 0;
        const mfaVisible =
          /Multi-Factor Authentication|Google Authenticator|Enter code/i.test(
            $mfaBody.text()
          );
        expect(
          leftPasswordForm || mfaVisible,
          'expected MFA challenge or post-password transition'
        ).to.eq(true);
      });

      cy.get('body').then($body => {
        const text = $body.text();
        const mfaVisible =
          /Multi-Factor Authentication|Google Authenticator|Enter code/i.test(
            text
          );
        const otpFieldVisible =
          $body.find(
            'input[name="credentials.passcode"]:visible, input[name="answer"]:visible'
          ).length > 0 &&
          $body.find(
            'input[name="identifier"]:visible, #okta-signin-username:visible'
          ).length === 0;

        if (!mfaVisible && !otpFieldVisible) {
          return;
        }

        if (text.includes('Google Authenticator') && !otpFieldVisible) {
          cy.contains('Google Authenticator')
            .should('be.visible')
            .then($label => {
              let $node = $label;
              for (let i = 0; i < 8; i += 1) {
                const $select = $node
                  .find('a, button')
                  .filter((_, el) =>
                    /^Select$/i.test((el.textContent || '').trim())
                  );
                if ($select.length) {
                  cy.wrap($select.first()).click({ force: true });
                  return;
                }
                $node = $node.parent();
              }
              throw new Error(
                'Could not find a Select control for Google Authenticator on the MFA options page'
              );
            });
        }

        cy.task('generateOTP', secret, { log: false }).then(token => {
          cy.get('input[name="credentials.passcode"], input[name="answer"]', {
            timeout: 15000
          })
            .filter(':visible')
            .first()
            .clear()
            .type(token, { log: false });

          cy.get('body').then($rememberBody => {
            if ($rememberBody.find('input[name="rememberDevice"]').length) {
              cy.get('input[name="rememberDevice"]').check({ force: true });
            }
          });

          cy.get(
            '#okta-sign-in input[type="submit"][data-type="save"], input[type="submit"][value="Verify"], input[value="Verify"]'
          )
            .filter(':visible')
            .first()
            .click({ force: true });
        });
      });
    }
  );
};

Cypress.Commands.add('login', () => {
  const credentials = requireOktaTestCredentials();

  cy.on('uncaught:exception', err => {
    if (isOpaqueCrossOriginError(err)) {
      return false;
    }
    return undefined;
  });

  cy.visit('/signin');

  // Flag off: embedded widget stays on localhost (username field).
  // Flag on: spinner, then hosted ELP via cy.origin.
  cy.get('#okta-signin-username, [data-testid="okta-redirect-login"]', {
    timeout: 30000
  }).should('exist');

  cy.get('body').then($body => {
    if ($body.find('#okta-signin-username').length) {
      completeEmbeddedWidgetLogin(credentials);
      return;
    }

    completeHostedElpLogin(credentials);
  });

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
