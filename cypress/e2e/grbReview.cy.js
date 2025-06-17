describe('GRB review', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'E2E2', role: 'EASI_D_GOVTEAM' });
  });

  it.only('completes required fields for Asynchronous Review Type', () => {
    cy.intercept('POST', '/api/graph/query', req => {
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
    cy.get('[data-testid="pager-next-button"]').click();

    // Presentation page
    cy.url().should('include', '/presentation');
    cy.get('[data-testid="pager-next-button"]').click();

    // Additional documents page
    cy.url().should('include', '/documents');
    cy.get('[data-testid="pager-next-button"]').click();

    // Participants page
    cy.url().should('include', '/participants');

    cy.get('#grbReviewAsyncEndDate').clear();
    cy.get('#grbReviewAsyncEndDate').type('01/01/2026');
    cy.get('#grbReviewAsyncEndDate').should('have.value', '01/01/2026');

    //   cy.contains('button', 'Complete and begin review').click();

    //   cy.wait('@updateAsyncTimeframe')
    //     .its('response.statusCode')
    //     .should('eq', 200);
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

    cy.get('[data-testid="pager-next-button"]').click();

    cy.get('[data-testid="date-picker-external-input"]')
      .clear()
      .type('01/01/2026');

    // Hit Send reminder button
    cy.contains('button', 'Send reminder').click();
    cy.wait('@sendReminder').its('response.statusCode').should('eq', 200);

    cy.contains('button', 'Reminder sent').should('be.disabled');

    cy.get('[data-testid="pager-next-button"]').click();
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
      .type('01/01/2026');
    cy.get('[data-testid="pager-next-button"]').click();

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

    cy.get('p').contains('Review ends 01/01/2026, 5:00pm EST');

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
        cy.get('[data-testid="date-picker-external-input"]').type('01/01/2026');

        cy.contains('button', 'Restart').should('be.not.disabled').click();
      });

    cy.get('[data-testid="alert"]')
      .should('be.visible')
      .and(
        'contain.text',
        'You restarted this GRB review. The new end date is 01/01/2026 at 5:00pm EST.'
      );
  });

  it('can upload a presentation deck', () => {
    cy.contains('a', 'Draft Business Case').should('be.visible').click();

    cy.get('li.usa-sidenav__item a[href*="grb-review#details"]').click();

    cy.contains('a', 'Add asynchronous presentation links').click();

    // Complete upload form form

    cy.contains('button', 'Save presentation details').should('be.disabled');

    // Recording link
    cy.get('#recordingLink')
      .type('https://example.com/recording')
      .should('have.value', 'https://example.com/recording');

    cy.contains('button', 'Save presentation details').should(
      'not.be.disabled'
    );

    // Recording passcode
    cy.get('#recordingPasscode')
      .type('3465376')
      .should('have.value', '3465376');

    // Transcript link
    cy.get('#transcriptLink')
      .type('https://example.com/transcript')
      .should('have.value', 'https://example.com/transcript');

    // Upload presentation deck
    cy.get('input[name=presentationDeckFileData]').selectFile(
      'cypress/fixtures/test.pdf',
      { force: true }
    );

    // Submit form
    cy.contains('button', 'Save presentation details').click();

    cy.contains('.usa-card__footer', 'Virus scanning in progress...').should(
      'be.visible'
    );

    // Mark file as passing virus scan
    cy.get('[data-testdeckurl]').within(el => {
      const url = el.attr('data-testdeckurl');
      // console.log('url', url);
      const filepath = url.match(/(\/easi-app-file-uploads\/[^?]*)/)[1];
      cy.exec(`scripts/tag_minio_file ${filepath} CLEAN`);
    });

    cy.reload();

    // Verify presentation deck is uploaded as well as other details
    cy.contains('button', 'View recording').should('be.visible');

    cy.contains('span', '(Passcode: 3465376)').should('be.visible');

    cy.contains('button', 'View transcript').should('be.visible');

    cy.contains('button', 'View slide deck').should('be.visible');

    // Edit presentation links
    cy.contains('a', 'Edit presentation links').click();

    cy.contains('button', 'Save presentation details').should('be.disabled');

    cy.contains('button', 'Upload document').click();

    // Upload transcript file
    cy.get('input[name=transcriptFileData]').selectFile(
      'cypress/fixtures/test.pdf'
    );

    // Clear presentation deck file
    cy.get('button').contains('Clear file').click();

    // Submit form
    cy.contains('button', 'Save presentation details').click();

    // Mark file as passing virus scan
    cy.get('[data-testdeckurl]').within(el => {
      const url = el.attr('data-testdeckurl');
      // console.log('url', url);
      const filepath = url.match(/(\/easi-app-file-uploads\/[^?]*)/)[1];
      cy.exec(`scripts/tag_minio_file ${filepath} CLEAN`);
    });

    cy.reload();

    // Check that the presentation deck file was deleted
    cy.get('[data-testid="presentation-url"]').should('not.exist');

    // Remove all presentation links
    cy.contains('button', 'Remove all presentation links').click();

    // Modal remove button
    cy.contains('button', 'Remove presentation links').click();

    // Returns to empty state with no links
    cy.contains('a', 'Add asynchronous presentation links').should(
      'be.visible'
    );
  });
});
