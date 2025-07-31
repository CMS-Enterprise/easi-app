describe('GRB review', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'E2E2', role: 'EASI_D_GOVTEAM' });

    cy.getDateString({ years: 1 }).as('futureDate');
  });

  // Request name: GRB meeting without date set
  // System intake ID: d9c931c6-0858-494d-b991-e02a94a42f38
  it.skip('completes required fields for Asynchronous Review Type', () => {
    cy.intercept('POST', '/api/graph/query', req => {
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

    cy.visit('/it-governance/d9c931c6-0858-494d-b991-e02a94a42f38/grb-review');

    cy.contains('button', 'Set up GRB review').click();

    // Click Asynchronous review
    cy.get('input#grbReviewTypeAsync').check({ force: true });

    cy.getByTestId('pager-next-button').click();

    // Presentation page

    cy.getByTestId('date-picker-external-input').clear();
    cy.getDateString({ years: -1 }).then(pastDate => {
      cy.getByTestId('date-picker-external-input').type(pastDate);
    });

    cy.getByTestId('alert')
      .should('be.visible')
      .and(
        'contain.text',
        "You've entered a date that is in the past. Please double-check to make sure this date is accurate."
      );

    cy.getByTestId('date-picker-external-input').clear();
    cy.get('@futureDate').then(futureDate => {
      cy.getByTestId('date-picker-external-input').type(futureDate);
    });

    cy.get('input#recordingLink').clear();
    cy.get('input#recordingLink').type('https://www.google.com');

    cy.get('input#recordingPasscode').clear();
    cy.get('input#recordingPasscode').type('123');

    // Hit Send reminder button
    cy.contains('button', 'Send reminder').click();
    cy.wait('@sendReminder').its('response.statusCode').should('eq', 200);

    cy.contains('button', 'Reminder sent').should('be.disabled');

    cy.getByTestId('pager-next-button').click();
    cy.wait('@updatePresentation').its('response.statusCode').should('eq', 200);

    // Additional documents page
    cy.url().should('include', '/documents');
    cy.getByTestId('pager-next-button').click();

    // Participants page
    cy.url().should('include', '/participants');

    cy.getByTestId('table').within(() => {
      cy.get('tbody tr').should('have.length', 6);
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

    cy.getByTestId('alert')
      .should('be.visible')
      .and('contain.text', 'You added 1 reviewer to this GRB review.');

    cy.getByTestId('table').within(() => {
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

    cy.getByTestId('table').within(() => {
      // Check to see that Adeline Aarons is now a voting memeber
      cy.get('tbody tr')
        .eq(1)
        .within(() => {
          cy.contains('td', 'Adeline Aarons').should('exist');
          cy.contains('td', 'Voting').should('exist');
        });
    });

    // Async review end date
    cy.getByTestId('date-picker-external-input').clear();

    // Use invoke instead of type to fix bug with DatePickerFormatted
    // Type passes locally but not in CI
    cy.get('@futureDate').then(futureDate => {
      cy.getByTestId('date-picker-external-input')
        .invoke('val', futureDate)
        .trigger('input');

      cy.getByTestId('date-picker-external-input').should(
        'have.value',
        futureDate
      );
    });

    cy.contains('button', 'Complete and begin review').click();

    cy.wait('@updateAsyncTimeframe')
      .its('response.statusCode')
      .should('eq', 200);

    // Returns to the GRB review page
    // Check if discussion button is now clickable
    cy.contains('button', 'View discussion board').should('not.be.disabled');
  });

  // Request name: GRB meeting with date set in future
  // System intake ID: 8ef9d0fb-e673-441c-9876-f874b179f89c
  it.skip('completes required fields for Standard Review Type', () => {
    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'SendPresentationDeckReminder') {
        req.alias = 'sendReminder';
      }
      if (req.body.operationName === 'StartGRBReview') {
        req.alias = 'startGRBReview';
      }
    });

    cy.visit('/it-governance/8ef9d0fb-e673-441c-9876-f874b179f89c/grb-review');

    cy.contains('button', 'Set up GRB review').click();

    cy.url().should('include', '/review-type');

    cy.get('input#grbReviewTypeStandard').check({ force: true });

    cy.contains('button', 'Next').click();

    cy.getByTestId('date-picker-external-input').clear();

    cy.get('@futureDate').then(futureDate => {
      cy.getByTestId('date-picker-external-input').type(futureDate);
    });

    // Hit Send reminder button
    cy.contains('button', 'Send reminder').click();
    cy.wait('@sendReminder').its('response.statusCode').should('eq', 200);

    cy.contains('button', 'Reminder sent').should('be.disabled');

    cy.getByTestId('pager-next-button').click();

    // Additional documents page
    cy.url().should('include', '/documents');
    cy.getByTestId('pager-next-button').click();

    // Participants page
    cy.url().should('include', '/participants');
    cy.contains('button', 'Complete and begin review').click();

    cy.wait('@startGRBReview').its('response.statusCode').should('eq', 200);

    // Returns to the GRB review page
    cy.url().should('include', '/grb-review');
    cy.get('h3').should('contain.text', 'Standard meeting review');
  });

  // Request name: Skip to GRB meeting without date set
  // System intake ID: 8f0b8dfc-acb2-4cd3-a79e-241c355f551c
  it.skip('Navigates through the form with the headers', () => {
    cy.visit('/it-governance/8f0b8dfc-acb2-4cd3-a79e-241c355f551c/grb-review');
    cy.contains('button', 'Set up GRB review').click();

    cy.url().should('include', '/review-type');

    cy.get('input#grbReviewTypeStandard').check({ force: true });

    const disabledClass = 'usa-step-indicator__segment--disabled';

    // Click on Presentation Header link
    cy.getByTestId('stepIndicator-1').click();
    cy.url().should('include', '/presentation');

    cy.getByTestId('stepIndicator-2').should('have.class', disabledClass);
    cy.getByTestId('stepIndicator-3').should('have.class', disabledClass);

    cy.getByTestId('date-picker-external-input').clear();
    cy.get('@futureDate').then(futureDate => {
      cy.getByTestId('date-picker-external-input').type(futureDate);
    });

    cy.getByTestId('pager-next-button').click();
    cy.getByTestId('stepIndicator-3').should('not.have.class', disabledClass);

    cy.getByTestId('stepIndicator-3').click();
    cy.url().should('include', '/participants');

    cy.contains('button', 'Save and return to request').click();
  });

  // Request name: Async GRB review in progress
  // System intake ID: 5af245bc-fc54-4677-bab1-1b3e798bb43c
  it.skip('Sends a reminder email', () => {
    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'SendSystemIntakeGRBReviewerReminder') {
        req.alias = 'sendReminder';
      }
    });

    cy.visit('/it-governance/5af245bc-fc54-4677-bab1-1b3e798bb43c/grb-review');

    // Click Send reminder button to open modal
    cy.contains('button', 'Send reminder').should('not.be.disabled').click();

    // Click go back button to close without sending reminder
    cy.getByTestId('send-review-reminder-modal').within(() => {
      cy.contains('button', 'Go back without sending').click();
    });

    // Check modal is closed
    cy.getByTestId('send-review-reminder-modal').should('not.exist');

    // Click Send reminder button to open modal again
    cy.contains('button', 'Send reminder').should('not.be.disabled').click();

    // Send reminder
    cy.getByTestId('send-review-reminder-modal').within(() => {
      cy.contains('button', 'Send reminder').click();
    });

    cy.wait('@sendReminder').its('response.statusCode').should('eq', 200);

    // Check review reminder email text
    cy.getDateString().then(date => {
      cy.getByTestId('review-reminder').contains(
        `Most recent reminder sent on ${date}`
      );
    });
  });

  // Request name: Async GRB review in progress
  // System intake ID: 5af245bc-fc54-4677-bab1-1b3e798bb43c
  it.skip('can upload a presentation deck', () => {
    cy.visit('/it-governance/5af245bc-fc54-4677-bab1-1b3e798bb43c/grb-review');

    cy.contains('a', 'Add asynchronous presentation links').click();

    // Complete upload form form
    cy.contains('button', 'Save presentation details').should('be.disabled');

    // Recording link
    cy.get('#recordingLink').clear();
    cy.get('#recordingLink').type('https://example.com/recording');

    cy.contains('button', 'Save presentation details').should(
      'not.be.disabled'
    );

    // Recording passcode
    cy.get('#recordingPasscode').clear();
    cy.get('#recordingPasscode').type('3465376');

    // Transcript link
    cy.get('#transcriptLink').clear();
    cy.get('#transcriptLink').type('https://example.com/transcript');

    // Upload presentation deck
    cy.get('input[name=presentationDeckFileData]').selectFile(
      'cypress/fixtures/test.pdf',
      { force: true }
    );

    // Submit form
    cy.contains('button', 'Save presentation details').click();

    cy.getByTestId('presentation-deck-virus-scanning').contains(
      'Virus scanning in progress'
    );

    // Mark file as passing virus scan
    cy.get('[data-testdeckurl]').within(el => {
      const url = el.attr('data-testdeckurl');

      const filepath = url.match(/(\/easi-app-file-uploads\/[^?]*)/)[1];
      cy.exec(`scripts/tag_minio_file ${filepath} CLEAN`);
    });

    cy.reload();

    // Verify presentation deck is uploaded as well as other details

    cy.getByTestId('presentation-links-card').within(() => {
      cy.contains('button', 'View recording').should('be.visible');
      cy.contains('span', '(Passcode: 3465376)').should('be.visible');
      cy.contains('button', 'View transcript').should('be.visible');
      cy.contains('button', 'View slide deck').should('be.visible');
    });

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

      const filepath = url.match(/(\/easi-app-file-uploads\/[^?]*)/)[1];
      cy.exec(`scripts/tag_minio_file ${filepath} CLEAN`);
    });

    cy.reload();

    // Check that the presentation deck file was deleted
    cy.contains('button', 'View slide deck').should('not.exist');

    // Remove all presentation links
    cy.contains('button', 'Remove all presentation links').click();

    // Modal remove button
    cy.contains('button', 'Remove presentation links').click();

    // Returns to empty state with no links
    cy.contains('a', 'Add asynchronous presentation links').should(
      'be.visible'
    );
  });

  // Request name: Async GRB review in progress
  // System intake ID: 5af245bc-fc54-4677-bab1-1b3e798bb43c
  it('Adds time to voting and Ends time to voting', () => {
    cy.visit('/it-governance/5af245bc-fc54-4677-bab1-1b3e798bb43c/grb-review');

    // Open Add Time modal
    cy.contains('button', 'Add time').click();

    cy.getByTestId('addTimeModalButton').should('be.disabled');

    cy.getDateString({ years: 2 }).then(futureDate => {
      cy.getByTestId('date-picker-external-input').type(futureDate);

      cy.getByTestId('date-picker-external-input').should(
        'have.value',
        futureDate
      );

      cy.getByTestId('grb-review-async-end-date').should(
        'contain.text',
        `This review will now end on ${futureDate}.`
      );

      // Click button to add time and close modal
      cy.getByTestId('addTimeModalButton').should('not.be.disabled').click();

      // Success alert text
      cy.getByTestId('alert').contains(
        `You added time to this GRB review. The new end date is ${futureDate} at 5:00pm EST.`
      );

      cy.getByTestId('grb-review-status-card').should(
        'contain.text',
        `Review ends ${futureDate}, 5:00pm EST`
      );
    });

    // Open End Voting modal
    cy.get('button').contains('End voting').click();

    cy.get('button').contains('End early').should('be.not.disabled').click();

    // Success alert text
    cy.get('p').contains(
      'You have ended this GRB review early. GRB members will no longer be able to add or change votes.'
    );
  });

  // Request name: Async GRB review (voting complete)
  // System intake ID: b569ae1e-bf04-4c1b-96a5-b9604d74d979
  it('Restart GRB review', () => {
    cy.visit('/it-governance/b569ae1e-bf04-4c1b-96a5-b9604d74d979/grb-review');

    cy.contains('button', 'Restart review').click();

    cy.get('@futureDate').then(futureDate => {
      cy.get('[role="dialog"]')
        .should('be.visible')
        .within(() => {
          cy.contains('button', 'Restart').should('be.disabled');

          cy.getByTestId('date-picker-external-input').clear();

          cy.getByTestId('date-picker-external-input').type(futureDate);

          cy.getByTestId('date-picker-external-input').should(
            'have.value',
            futureDate
          );

          cy.contains('button', 'Restart').should('be.not.disabled').click();
        });

      cy.get('[role="dialog"]').should('not.exist');

      cy.getByTestId('alert').should(
        'contain.text',
        `You restarted this GRB review. The new end date is ${futureDate} at 5:00pm EST.`
      );

      cy.getByTestId('grb-review-status-card').should(
        'contain.text',
        `Review ends ${futureDate}, 5:00pm EST`
      );
    });
  });
});
