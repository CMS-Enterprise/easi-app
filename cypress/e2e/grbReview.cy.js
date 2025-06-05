describe('GRB review', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'E2E2', role: 'EASI_D_GOVTEAM' });
  });

  it('completes required fields for Asynchronous Review Type', () => {
    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'UpdateSystemIntakeGRBReviewType') {
        req.alias = 'updateReviewType';
      }
      if (req.body.operationName === 'SendPresentationDeckReminder') {
        req.alias = 'sendReminder';
      }
      if (
        req.body.operationName ===
        'UpdateSystemIntakeGRBReviewAsyncPresentation'
      ) {
        req.alias = 'updatePresentation';
      }
      if (
        req.body.operationName ===
        'UpdateSystemIntakeGRBReviewFormInputTimeframeAsync'
      ) {
        req.alias = 'updateAsyncTimeframe';
      }
    });

    cy.visit('/it-governance/5af245bc-fc54-4677-bab1-1b3e798bb43c/grb-review');

    cy.contains('button', 'Set up GRB review').click();

    // Click Asynchronous review
    cy.get('input#grbReviewTypeAsync').check({ force: true });

    cy.contains('button', 'Next').click();

    // Presentation page

    cy.wait('@updateReviewType').its('response.statusCode').should('eq', 200);

    cy.get('[data-testid="date-picker-external-input"]').type('01/01/2022');

    cy.get('[data-testid="alert"]')
      .should('be.visible')
      .and(
        'contain.text',
        "You've entered a date that is in the past. Please double-check to make sure this date is accurate."
      );

    cy.get('[data-testid="date-picker-external-input"]').clear();
    cy.get('[data-testid="date-picker-external-input"]').type('01/01/2226');

    cy.get('input#recordingLink').clear().type('https://www.google.com');
    cy.get('input#recordingPasscode').clear().type('123');

    // Hit Send reminder button
    cy.contains('button', 'Send reminder').click();
    cy.wait('@sendReminder').its('response.statusCode').should('eq', 200);

    cy.contains('button', 'Reminder sent').should('be.disabled');

    cy.contains('button', 'Next').click();
    cy.wait('@updatePresentation').its('response.statusCode').should('eq', 200);

    // Additional documents page
    cy.url().should('include', '/documents');
    cy.contains('button.usa-button.margin-top-0', 'Next').click();

    // Participants page
    cy.url().should('include', '/participants');

    cy.get('[data-testid="table"]').within(() => {
      cy.get('tbody tr').should('have.length', 4);
    });

    cy.contains('button', 'Add another GRB reviewer').click();

    // Add a GRB Reviewer
    cy.url().should('include', '/add?from-grb-setup');
    cy.contains('h1', 'Add a GRB reviewer');

    cy.get('#react-select-userAccount-input')
      .type('Aaron A')
      .wait(2000) // See Note [Specific Cypress wait duration on Okta search]
      .type('{downArrow}{enter}')
      .should('have.value', 'Aaron Adams, ADMN (aaron.adams@local.fake)');

    cy.get('#votingRole').select('Voting').should('have.value', 'VOTING');
    cy.get('#grbRole')
      .select('Co-Chair - CIO')
      .should('have.value', 'CO_CHAIR_CIO');

    cy.contains('button', 'Add reviewer').should('not.be.disabled').click();

    cy.url().should('include', '/participants');

    cy.contains('button', 'Add another GRB reviewer').click();

    // Add a GRB Reviewer
    cy.url().should('include', '/add?from-grb-setup');
    cy.contains('h1', 'Add a GRB reviewer');

    cy.get('#react-select-userAccount-input')
      .type('User Two')
      .wait(2000) // See Note [Specific Cypress wait duration on Okta search]
      .type('{downArrow}{enter}')
      .should('have.value', 'User Two, USR2 (user.two@local.fake)');

    cy.get('#votingRole').select('Voting').should('have.value', 'VOTING');
    cy.get('#grbRole')
      .select('Co-Chair - CIO')
      .should('have.value', 'CO_CHAIR_CIO');

    cy.contains('button', 'Add reviewer').should('not.be.disabled').click();

    cy.contains('button', 'Add another GRB reviewer').click();

    // Add a GRB Reviewer
    cy.url().should('include', '/add?from-grb-setup');
    cy.contains('h1', 'Add a GRB reviewer');

    cy.get('#react-select-userAccount-input')
      .type('User Three')
      .wait(2000) // See Note [Specific Cypress wait duration on Okta search]
      .type('{downArrow}{enter}')
      .should('have.value', 'User Three, USR3 (user.three@local.fake)');

    cy.get('#votingRole').select('Voting').should('have.value', 'VOTING');
    cy.get('#grbRole')
      .select('Co-Chair - CIO')
      .should('have.value', 'CO_CHAIR_CIO');

    cy.contains('button', 'Add reviewer').should('not.be.disabled').click();

    cy.get('[data-testid="alert"]')
      .should('be.visible')
      .and('contain.text', 'You added 1 reviewer to this GRB review.');

    cy.get('[data-testid="table"]').within(() => {
      // Check to see that Aaron Adams was added as a reviewer.
      cy.get('tbody tr')
        .eq(0)
        .within(() => {
          cy.contains('td', 'Aaron Adams').should('exist');
          cy.contains('td', 'Voting').should('exist');
          cy.contains('td', 'Co-Chair - CIO').should('exist');
        });

      // Check that the expected number of rows exist.
      cy.get('tbody tr').should('have.length', 7);

      cy.get('tbody tr')
        .eq(1)
        .within(() => {
          cy.contains('td', 'Adeline Aarons').should('exist');
          cy.contains('td', 'Alternate').should('exist');
          cy.contains('button', 'Edit').click();
        });
    });

    cy.get('#votingRole').should('have.value', 'ALTERNATE').select('Voting');

    cy.contains('button', 'Save changes').should('not.be.disabled').click();

    cy.get('[data-testid="table"]').within(() => {
      // Check to see that Adeline Aarons is now a voting memeber
      cy.get('tbody tr')
        .eq(1)
        .within(() => {
          cy.contains('td', 'Adeline Aarons').should('exist');
          cy.contains('td', 'Voting').should('exist');
        });
    });

    cy.get('#grbReviewAsyncEndDate').clear().type('01/01/2226');

    cy.contains('button', 'Complete and begin review').click();
    cy.wait('@updateAsyncTimeframe')
      .its('response.statusCode')
      .should('eq', 200);

    // Returns to the GRB review page
    // Check if discussion button is now clickable
    cy.contains('button', 'View discussion board').should('not.be.disabled');
  });

  it('completes required fields for Standard Review Type', () => {
    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'SendPresentationDeckReminder') {
        req.alias = 'sendReminder';
      }
      if (
        req.body.operationName ===
        'UpdateSystemIntakeGRBReviewStandardPresentation'
      ) {
        req.alias = 'updatePresentation';
      }
      if (req.body.operationName === 'StartGRBReview') {
        req.alias = 'startGRBReview';
      }
    });

    // Go to a different GRB Review than above
    cy.visit('/it-governance/69357721-1e0c-4a37-a90f-64bb29814e7a/grb-review');

    cy.contains('button', 'Set up GRB review').click();

    cy.url().should('include', '/review-type');

    cy.get('input#grbReviewTypeStandard').check({ force: true });

    cy.contains('button', 'Next').click();

    cy.get('[data-testid="date-picker-external-input"]')
      .clear()
      .type('01/01/2226');

    // Hit Send reminder button
    cy.contains('button', 'Send reminder').click();
    cy.wait('@sendReminder').its('response.statusCode').should('eq', 200);

    cy.contains('button', 'Reminder sent').should('be.disabled');

    cy.contains('button', 'Next').click();
    cy.wait('@updatePresentation').its('response.statusCode').should('eq', 200);

    // Additional documents page
    cy.url().should('include', '/documents');
    cy.contains('button.usa-button.margin-top-0', 'Next').click();

    // Participants page
    cy.url().should('include', '/participants');
    cy.contains('button', 'Complete and begin review').click();

    cy.wait('@startGRBReview').its('response.statusCode').should('eq', 200);

    // Returns to the GRB review page
    cy.url().should('include', '/grb-review');
    cy.get('h3').should('contain.text', 'Standard meeting review');
  });

  it('Navigates through the form with the headers', () => {
    cy.visit('/it-governance/38e46d77-e474-4d15-a7c0-f6411221e2a4/grb-review');
    cy.contains('button', 'Set up GRB review').click();

    cy.url().should('include', '/review-type');

    cy.get('input#grbReviewTypeStandard').check({ force: true });

    // Click on Presentation Header link
    cy.get('[data-testid="stepIndicator-1"]').click();
    cy.url().should('include', '/presentation');

    cy.get('[data-testid="stepIndicator-2"]').should(
      'have.class',
      'usa-step-indicator__segment--disabled'
    );
    cy.get('[data-testid="stepIndicator-3"]').should(
      'have.class',
      'usa-step-indicator__segment--disabled'
    );

    cy.get('[data-testid="date-picker-external-input"]')
      .clear()
      .type('01/01/2226');
    cy.contains('button', 'Next').click();

    cy.get('[data-testid="stepIndicator-2"]').should(
      'not.have.class',
      'usa-step-indicator__segment--disabled'
    );
    cy.get('[data-testid="stepIndicator-3"]').should(
      'not.have.class',
      'usa-step-indicator__segment--disabled'
    );

    cy.get('[data-testid="stepIndicator-3"]').click();
    cy.url().should('include', '/participants');

    cy.contains('button', 'Save and return to request').click();
  });

  it('Sends a reminder email', () => {
    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'SendSystemIntakeGRBReviewerReminder') {
        req.alias = 'sendReminder';
      }
    });

    cy.visit('/it-governance/5af245bc-fc54-4677-bab1-1b3e798bb43c/grb-review');
    cy.get('h3').should('contain.text', 'Send review reminder');

    // Click Send reminder button to open modal
    cy.contains('button', 'Send reminder').should('be.not.disabled').click();

    // Check modal is visible
    cy.get('[data-testid="send-review-reminder-modal"]').should('be.visible');

    // Check modal content
    cy.get('[data-testid="send-review-reminder-modal"]').within(() => {
      cy.contains('button', 'Send reminder').should('be.visible');
      cy.contains('button', 'Go back without sending')
        .should('be.visible')
        .click();
    });

    // Check modal is closed
    cy.get('[data-testid="send-review-reminder-modal"]').should('not.exist');

    // Click Send reminder button to open modal again
    cy.contains('button', 'Send reminder').should('be.not.disabled').click();

    // Check modal is visible
    cy.get('[data-testid="send-review-reminder-modal"]').should('be.visible');

    // Check modal content
    cy.get('[data-testid="send-review-reminder-modal"]').within(() => {
      cy.contains('button', 'Send reminder').should('be.visible').click();
    });

    cy.wait('@sendReminder').its('response.statusCode').should('eq', 200);

    // Check review reminder email text is visible
    cy.get('[data-testid="review-reminder"]').should('be.visible');
  });

  it('Adds time to voting and Ends time to voting', () => {
    cy.visit('/it-governance/5af245bc-fc54-4677-bab1-1b3e798bb43c/grb-review');

    cy.get('[data-testid="async-status"]').contains('In progress');

    cy.get('p').contains('Review ends 01/01/2226, 5:00pm EST');

    // Open Add Time modal
    cy.get('button').contains('Add time').click();

    cy.get('[data-testid="addTimeModalButton"]').should('be.disabled');

    cy.get('[data-testid="date-picker-external-input"]').type('01/01/2227');

    // Click button to add time and close modal
    cy.get('[data-testid="addTimeModalButton"]')
      .should('be.not.disabled')
      .click();

    // Success alert text
    cy.get('p').contains(
      'You added time to this GRB review. The new end date is 01/01/2227 at 5:00pm EST.'
    );

    // Open End Voting modal
    cy.get('button').contains('End voting').click();

    cy.get('button').contains('End early').should('be.not.disabled').click();

    // Success alert text
    cy.get('p').contains(
      'You have ended this GRB review early. GRB members will no longer be able to add or change votes.'
    );
  });

  it('Restart GRB review', () => {
    cy.visit('/it-governance/5af245bc-fc54-4677-bab1-1b3e798bb43c/grb-review');

    cy.get('h1').should('have.text', 'GRB review');

    cy.get('body').then($body => {
      const occurrences = $body.text().match(/This review is over\./g) || [];
      expect(occurrences).to.have.length(3);
    });

    cy.contains('button', 'Restart review').click();

    cy.get('[role="dialog"]')
      .should('be.visible')
      .within(() => {
        cy.contains('h2', 'Restart review?').should('exist');

        cy.contains(
          'Restarting this review will retain any existing votes and discussions, but will allow Governance Review Board (GRB) members to cast a new vote or change their existing vote.'
        ).should('exist');

        cy.contains('button', 'Restart').should('be.disabled');

        cy.get('[data-testid="date-picker-external-input"]').clear();
        cy.get('[data-testid="date-picker-external-input"]').type('01/01/2226');

        cy.contains('button', 'Restart').should('be.not.disabled').click();
      });

    cy.get('[data-testid="alert"]')
      .should('be.visible')
      .and(
        'contain.text',
        'You restarted this GRB review. The new end date is 01/01/2226 at 5:00pm EST.'
      );
  });
});
