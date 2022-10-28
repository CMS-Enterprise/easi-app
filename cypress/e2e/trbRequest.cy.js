describe('Technical Assistance', () => {
  it('Creates a new trb request', () => {
    cy.localLogin({ name: 'ABCD' });
    // Nav to trb base
    cy.contains('a', 'Technical Assistance').click();
    // Start request
    cy.contains('a', 'Start a new request').click();
    // Selects the first implied request type
    cy.contains('a', /^Start$/).click();
    // Continue through process steps
    cy.contains('a', 'Continue').click();

    cy.contains(
      '.usa-step-indicator__heading-text',
      'Basic request details'
    ).should('be.visible');

    // Fill out the Basic form step

    cy.get('[name=name]').clear().type('Test Request Name');
    cy.get('[name=component]').select('Center for Medicaid and CHIP Services');
    cy.get('[name=needsAssistanceWith]').type('Assistance');
    cy.get('#hasSolutionInMind-no').check({ force: true });
    cy.get('[name=whereInProcess]').select(
      'I_HAVE_AN_IDEA_AND_WANT_TO_BRAINSTORM'
    );
    cy.get('#hasExpectedStartEndDates-no').check({ force: true });

    // Select a collab group but skip the conditional field
    cy.get('#collabGroups-Security').check({ force: true });

    // Submit the form to get a validation error on the conditional field
    cy.contains('button', 'Next').as('submit').click();

    cy.contains('.usa-alert__heading', 'Please check and fix the following').as(
      'formError'
    );

    cy.get('@formError').should('be.visible');

    // Use the error jump link
    cy.contains('.usa-error-message', 'Security: When did you meet with them?')
      .should('be.visible')
      .click();

    // Check that the error field is focused and fix it
    cy.focused()
      .should('have.attr', 'name', 'collabDateSecurity')
      .type('2022-10-24T16:39:56.116105Z');

    cy.get('@formError').should('not.exist');

    // Successful resubmit
    cy.get('@submit').click();

    cy.contains('.usa-step-indicator__heading-text', 'Subject areas').should(
      'be.visible'
    );
  });
});
