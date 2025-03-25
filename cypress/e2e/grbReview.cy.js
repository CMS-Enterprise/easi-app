describe('GRB review', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'E2E2', role: 'EASI_D_GOVTEAM' });
  });

  it.skip('completes required fields for Asynchronous Review Type', () => {
    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'UpdateSystemIntakeGRBReviewType') {
        req.alias = 'updateReviewType';
      }
      if (req.body.operationName === 'SendPresentationDeckReminder') {
        req.alias = 'sendReminder';
      }
      if (req.body.operationName === 'UpdateSystemIntakeGRBReviewAsyncPresentation') {
        req.alias = 'updatePresentation';
      }
    });

    cy.visit('/it-governance/5af245bc-fc54-4677-bab1-1b3e798bb43c/grb-review');

    cy.contains('button', 'Set up GRB review').click();

    // cy.get('input#grbReviewTypeStandard').should('be.checked');

    // Click Asynchronous review
    cy.get('input#grbReviewTypeAsync').check({ force: true });

    cy.contains('button', 'Next').click();

    // Presentation page

    cy.wait('@updateReviewType').its('response.statusCode').should('eq', 200);

    cy.get('[data-testid="date-picker-external-input"]').type('01/01/2022');

    cy.get('[data-testid="alert"]').should('be.visible').and('contain.text', "You've entered a date that is in the past. Please double-check to make sure this date is accurate.");

    cy.get('[data-testid="date-picker-external-input"]').clear()
    cy.get('[data-testid="date-picker-external-input"]').type('01/01/2226');

    cy.get('input#recordingLink').type('https://www.google.com');
    cy.get('input#recordingPasscode').type('123');

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
    })

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
    cy.get('#grbRole').select('Co-Chair - CIO').should('have.value', 'CO_CHAIR_CIO');

    cy.contains('button', 'Add reviewer').should('not.be.disabled').click();

    cy.url().should('include', '/participants');

    cy.get('[data-testid="alert"]').should('be.visible').and('contain.text', "You added 1 reviewer to this GRB review.");

    cy.get('[data-testid="table"]').within(() => {
      // Check to see that Aaron Adams was added as a reviewer.
      cy.get('tbody tr').eq(0).within(() => {
        cy.contains('td', 'Aaron Adams').should('exist');
        cy.contains('td', 'Voting').should('exist');
        cy.contains('td', 'Co-Chair - CIO').should('exist');
      });

      // Check that the expected number of rows exist.
      cy.get('tbody tr').should('have.length', 5);
    });

    cy.get('#grbReviewAsyncEndDate').type('01/01/2226');

    cy.contains('button', 'Complete and begin review').click();
    cy.wait('@updateAsyncTimeframe').its('response.statusCode').should('eq', 200);

    // Returns to the GRB review page
    // Check if discussion button is now clickable
    cy.contains('button', 'View discussion board').should('not.be.disabled');
  });


  it('completes required fields for Standard Review Type', () => {
    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'UpdateSystemIntakeGRBReviewType') {
        req.alias = 'updateReviewType';
      }
      if (req.body.operationName === 'SendPresentationDeckReminder') {
        req.alias = 'sendReminder';
      }
      if (req.body.operationName === 'UpdateSystemIntakeGRBReviewStandardPresentation') {
        req.alias = 'updatePresentation';
      }
      if (req.body.operationName === 'UpdateSystemIntakeGRBReviewFormInputTimeframeAsync') {
        req.alias = 'updateAsyncTimeframe';
      }
    });

    // cy.visit('/');
    // Go to a different GRB Review than above
    cy.visit('/it-governance/69357721-1e0c-4a37-a90f-64bb29814e7a/grb-review');

    cy.contains('button', 'Set up GRB review').click();

    cy.url().should('include', '/review-type');

    cy.get('input#grbReviewTypeStandard').check({ force: true });

    cy.contains('button', 'Next').click();

    cy.wait('@updateReviewType').its('response.statusCode').should('eq', 200);

    // cy.get('[data-testid="date-picker-external-input"]').type('01/01/2022');

    // cy.get('[data-testid="alert"]').should('be.visible').and('contain.text', "You've entered a date that is in the past. Please double-check to make sure this date is accurate.");

    // cy.get('[data-testid="date-picker-external-input"]').clear()
    cy.get('[data-testid="date-picker-external-input"]').type('01/01/2226');

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

    // Returns to the GRB review page
    cy.url().should('include', '/grb-review');


  });
});



