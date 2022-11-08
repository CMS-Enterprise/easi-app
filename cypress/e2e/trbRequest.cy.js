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

    cy.contains('.usa-step-indicator__heading-text', 'Basic request details')
      .should('be.visible')
      .as('basicStepHeader');

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
      .type('October/November 2022');

    cy.get('@formError').should('not.exist');

    // Successful resubmit
    cy.url().as('basicStepUrl');
    cy.get('@submit').click();

    cy.contains('.usa-step-indicator__heading-text', 'Subject areas')
      .as('subjectStepHeader')
      .should('be.visible');

    // Go over the basic step again to test "save and exit" submits
    cy.get('@basicStepUrl').then(url => cy.visit(url));
    cy.get('@basicStepHeader').should('be.visible');

    // Error on required field
    cy.get('[name=name]').clear();
    cy.contains('button', 'Save and exit').as('saveExit').click();
    cy.get('@formError').should('exist');

    // Fix the error and return
    const requestName = '2nd request name';
    cy.get('[name=name]').type(requestName);
    cy.get('@saveExit').click();

    // Check the update
    cy.get('@basicStepUrl').then(url => cy.visit(url));
    cy.get('[name=name]').should('have.value', requestName);

    // Jump to the next available Subject step
    cy.contains(
      '.usa-step-indicator__segment--clickable',
      'Subject areas'
    ).click();
    cy.get('@subjectStepHeader').should('be.visible');
  });
});
