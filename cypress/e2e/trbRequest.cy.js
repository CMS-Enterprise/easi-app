describe.skip('Technical Assistance', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'E2E1' });

    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'DeleteTRBRequestAttendee') {
        req.alias = 'deleteTRBRequestAttendee';
      }
    });

    // Nav to trb base
    cy.contains('a', 'Technical Assistance').click();
    // Start a Request to get to selecting a Request type
    cy.contains('a', 'Start a new request').click();
    // Selects the first implied Request Type to get to Process steps
    cy.contains('a', /^Start$/).click();
    // Continue through Process steps to get to Task list
    cy.contains('button', 'Continue').click();
    // Start the Request form from the Task list
    cy.contains(
      '[data-testid="fill-out-the-initial-request-form"] a',
      'Start'
    ).click();

    // Basic details is the first step of the Request Form
    cy.contains(
      '.usa-step-indicator__heading-text .long',
      'Basic request details',
      {
        timeout: 6000
      }
    )
      .should('be.visible')
      .as('basicStepHeaderIsVisible'); // Alias _after_ .should means that calls to @basicStepHeaderIsVisible will include the .should('be.visible') as well, hence the name!

    // Get basic details url and assign alias
    // "type: static" makes the alias always return the URL as it was here, rather than re-running `cy.url()` when you call it
    // https://docs.cypress.io/api/commands/as#Arguments
    cy.url().as('basicStepUrl', { type: 'static' });
  });

  /** Fill all required fields */
  it('Fills out minimum required fields', () => {
    /** Basic Details */

    // Fill out the Basic form step
    cy.trbRequest.basicDetails.fillRequiredFields();

    // Successful submit
    cy.contains('button', 'Next').click();

    /** Subject Areas */

    // Proceeded to subject areas
    cy.contains('.usa-step-indicator__heading-text .long', 'Subject areas')
      .as('subjectStepHeader')
      .should('be.visible');

    // Successful submit
    cy.contains('button', 'Continue without selecting subject areas').click();

    /** Attendees */

    // Proceeded to attendees
    cy.contains('.usa-step-indicator__heading-text .long', 'Attendees')
      .as('subjectStepHeader')
      .should('be.visible');

    // Fill required attendee fields
    cy.trbRequest.attendees.fillRequiredFields({
      component: 'CMS Wide',
      role: 'PRODUCT_OWNER'
    });

    // Successful submit
    cy.contains('button', 'Continue without adding attendees').click();

    // Pass through Supporting documents
    cy.contains('button', 'Continue without adding documents').click();

    // Submit request in Check and submit
    cy.contains('button', 'Submit request').click();
    // Successful request submit
    cy.contains('h1', 'Success!').should('be.visible');
    // Follow link to go back to task list
    cy.contains('a', 'Return to task list').click();
    // Check that the request form status is completed
    cy.contains('h3', 'Fill out the initial request form')
      .siblings('span')
      .contains('Completed')
      .should('be.visible');
  });
  /** Adds new attendee */
  it('Adds, edits, and deletes attendee', () => {
    // Fill out the Basic Details required fields
    cy.trbRequest.basicDetails.fillRequiredFields();

    // Successful submit
    cy.contains('button', 'Next').click();

    // Proceeded to subject areas
    cy.contains('.usa-step-indicator__heading-text .long', 'Subject areas')
      .as('subjectStepHeader')
      .should('be.visible');

    // Successful submit
    cy.contains('button', 'Continue without selecting subject areas').click();

    // Proceeded to attendees
    cy.contains('.usa-step-indicator__heading-text .long', 'Attendees')
      .as('subjectStepHeader')
      .should('be.visible');

    // Name / euaUserId field should be disabled for requester
    cy.get('#react-select-euaUserId-input')
      .as('euaUserIdInput')
      .should('be.disabled');

    // Submit without filling in fields to test field errors
    cy.contains('button', 'Continue without adding attendees').click().click();

    // Check for requester error messages
    cy.contains('button', 'Requester component is a required field', {
      timeout: 6000
    }).as('componentError');
    cy.contains('button', 'Requester role is a required field').as('roleError');

    // Fill required attendee fields
    cy.trbRequest.attendees.fillRequiredFields({
      component: 'CMS Wide',
      role: 'PRODUCT_OWNER'
    });

    // Check that error messages have cleared
    cy.get('@componentError').should('not.exist');
    cy.get('@roleError').should('not.exist');

    // Navigate to add attendee form
    cy.contains('a', 'Add an attendee').click();
    cy.contains('h1', 'Add an attendee').should('be.visible');

    // Fill attendee fields
    // Sets name and euaUserId to same as requester to trigger error
    cy.trbRequest.attendees.fillRequiredFields({
      userInfo: {
        commonName: 'EndToEnd One',
        euaUserId: 'E2E1'
      },
      component: 'Center for Medicare',
      role: 'PRIVACY_ADVISOR'
    });

    // Submit form
    cy.contains('button', 'Add attendee').should('be.enabled').click();

    // Check for unique euaUserId field error
    cy.contains('button', 'Attendee has already been added').as(
      'uniqueEuaUserIdError'
    );

    // Clear field value
    cy.get('@euaUserIdInput').clear();

    // Enter valid name/eua input
    cy.trbRequest.attendees.fillRequiredFields({
      userInfo: {
        commonName: 'Anabelle Jerde',
        euaUserId: 'JTTC'
      }
    });

    // Check that error message has cleared
    cy.get('@uniqueEuaUserIdError').should('not.exist');

    // Submit form
    cy.contains('button', 'Add attendee').click();

    // Confirm that attendee was added to list
    cy.get('#trbAttendee-JTTC')
      .as('newAttendee')
      .contains('p', 'anabelle.jerde@local.fake');
    cy.get('@newAttendee').contains('p', 'Privacy Advisor');

    // Check for updated add attendee button text
    cy.contains('a', 'Add another attendee');

    // Edit attendee
    cy.get('@newAttendee').contains('a', 'Edit').click();
    cy.contains('h1', 'Edit attendee').should('be.visible');

    // Name / euaUserId field should be disabled when editing
    cy.get('@euaUserIdInput').should('be.disabled');

    // Update attendee role
    cy.trbRequest.attendees.fillRequiredFields({
      role: 'CRA'
    });

    // Save attendee
    cy.contains('button', 'Save').click();

    // Check for updated attendee role
    cy.get('@newAttendee').contains('p', 'CRA');

    // Delete attendee
    cy.get('@newAttendee').contains('button', 'Remove').click();

    // Wait for delete mutation to complete
    cy.wait('@deleteTRBRequestAttendee')
      .its('response.statusCode')
      .should('eq', 200);

    // Check that attendee was deleted
    cy.get('@newAttendee').should('not.exist');
  });

  it('Submits values when exiting form', () => {
    // Fill basic details required fields
    cy.trbRequest.basicDetails.fillRequiredFields();

    // Proceeded to the next step
    cy.contains('button', 'Next').click();

    cy.contains('.usa-step-indicator__heading-text .long', 'Subject areas')
      .as('subjectStepHeader')
      .should('be.visible');

    // Go over the basic step again to test "save and exit" submits
    cy.get('@basicStepUrl').then(url => cy.visit(url));
    cy.get('@basicStepHeaderIsVisible');

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

    // Change the request type
    // Jump to task list
    cy.contains('a', 'Task list').click();
    // Check current
    cy.get('.trb-request-type').should(
      'contain',
      'I’m having a problem with my system'
    );
    // Proceed to change
    const diffRequestType = 'I have an idea and would like feedback';
    cy.contains('a', 'Change request type').click();
    // Select a different type
    cy.contains('.usa-card', diffRequestType)
      .contains('button', 'Continue')
      .click();
    // Check change
    cy.get('.trb-request-type').should('contain', diffRequestType);

    // Get back to the request form
    cy.contains(
      '[data-testid="fill-out-the-initial-request-form"] a',
      'Continue'
    ).click();

    // Jump to the next available Subject step
    cy.contains(
      '.usa-step-indicator__segment--clickable',
      'Subject areas'
    ).click();
    cy.get('@subjectStepHeader').should('be.visible');

    cy.url().as('subjectStepUrl');

    // Check the initial submit button state of the empty Subject areas form
    cy.contains('Continue without selecting subject areas').should(
      'be.visible'
    );

    // Select some options including "other" which will toggle on an additional text field
    cy.get('#subjectAreaTechnicalReferenceArchitecture').click();
    cy.get('[value="GENERAL_TRA_INFORMATION"]').check({ force: true });
    cy.get('[value="OTHER"]').check({
      force: true
    });
    cy.get('#subjectAreaTechnicalReferenceArchitecture').focused().blur();

    // Attempt to save with an error from the empty "other" input
    cy.contains('button', 'Save and exit').as('saveExit').click();
    cy.contains(
      '.usa-alert__heading',
      'Please check and fix the following'
    ).should('exist');
    cy.contains(
      '.usa-error-message',
      'Technical Reference Architecture (TRA): Please specify'
    ).should('be.visible');

    // Fix the field error
    cy.get('[name=subjectAreaTechnicalReferenceArchitectureOther').type(
      'testing'
    );
    // Save and return to task list
    cy.get('@saveExit').click();

    // Go back to the subject step and check input values
    cy.get('@subjectStepUrl').then(url => cy.visit(url));
    cy.contains('.usa-tag', 'General TRA information').should('be.visible');
    cy.contains('.usa-tag', 'Other').should('be.visible');
  });
});
