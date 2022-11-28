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
    cy.get('#collabGroups-Security').check({ force: true });
    cy.get('[name=collabDateSecurity]').type('October/November 2022');

    cy.url().as('basicStepUrl');

    // Successful submit
    cy.contains('button', 'Next').as('submit').click();

    // Proceeded to the next step
    cy.contains('.usa-step-indicator__heading-text', 'Subject areas')
      .as('subjectStepHeader')
      .should('be.visible');

    // Go over the basic step again to test "save and exit" submits
    cy.get('@basicStepUrl').then(url => cy.visit(url));
    cy.get('@basicStepHeader').should('be.visible');

    // Error on required field
    cy.get('[name=name]').clear();
    cy.contains('button', 'Save and exit').as('saveExit').click();

    cy.contains(
      '.usa-alert__heading',
      'Please check and fix the following'
    ).should('exist');
    cy.contains('.usa-error-message', 'Request name').should('be.visible');

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
