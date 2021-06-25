import { formatDate } from '../../src/utils/date';

describe('Accessibility Requests', () => {
  it('can create a request and see its details', () => {
    cy.localLogin({ name: 'A11Y' });
    cy.accessibility.create508Request();

    cy.get('.accessibility-request__side-nav').within(() => {
      cy.contains('h2', 'Test Dates and Scores');
      cy.get('.accessibility-request__other-details').within(() => {
        cy.contains('dt', 'Submission date');
        const dateString = formatDate(new Date().toISOString());
        cy.contains('dl', dateString);

        cy.contains('dt', 'Business Owner');
        cy.contains('dl', 'Shane Clark, OIT');

        cy.contains('dt', 'Project name');
        cy.contains('dl', 'TACO');

        cy.contains('dt', 'Lifecycle ID');
        cy.contains('dl', '000000');
      });

      cy.contains('a', '508 testing templates (opens in a new tab)');
      cy.contains('a', 'Steps involved in 508 testing (opens in a new tab)');
      cy.contains('button', 'Remove this request from EASi');
    });
  });

  it('adds a document from a 508 request as the owner', () => {
    cy.localLogin({ name: 'CMSU' });
    cy.accessibility.create508Request();
    cy.accessibility.addDocument();
  });

  it('adds and removes a document from a 508 request as an admin', () => {
    cy.localLogin({ name: 'CMSU' });
    cy.accessibility.create508Request();

    cy.url().then(requestPageUrl => {
      cy.logout();

      cy.localLogin({ name: 'ADMN', role: 'EASI_D_508_USER' });
      cy.visit(requestPageUrl);
    });

    cy.accessibility.addDocument();
  });

  it('sees information for an existing request on the homepage', () => {
    cy.localLogin({ name: 'A11Y' });
    cy.visit('/');
    cy.contains('h1', 'Welcome to EASi');
    cy.contains('h2', 'My governance requests');
    cy.get('table').within(() => {
      cy.get('thead').within(() => {
        cy.contains('th', 'Request name');
        cy.contains('th', 'Governance');
        cy.contains('th', 'Submission date');
        cy.contains('th', 'Status');
      });

      cy.get('tbody').within(() => {
        cy.contains('th', 'TACO');
        const dateString = formatDate(new Date().toISOString());
        cy.contains('td', 'Section 508');
        cy.contains('td', dateString);
        cy.contains('td', 'Open');
      });
    });
  });

  it('can remove a request', () => {
    cy.localLogin({ name: 'A11Y' });
    cy.visit('/');
    cy.contains('a', 'TACO').click();
    cy.contains('button', 'Remove this request from EASi').click();
    cy.contains('h2', 'Confirm you want to remove TACO');
    cy.contains('button', 'Keep request').click();
    cy.contains('Confirm you want to remove TACO').should('not.exist');

    cy.contains('button', 'Remove this request from EASi').click();
    cy.contains('h2', 'Confirm you want to remove TACO');
    cy.contains(
      'span',
      'You will not be able to access this request and its documents after it is removed.'
    );
    cy.get('form').within(() => {
      cy.contains('legend', 'Reason for removal');
      cy.contains(
        '.usa-radio',
        'Incorrect application and Lifecycle ID selected'
      );
      cy.contains('.usa-radio', 'No testing needed');
      cy.contains('.usa-radio', 'Other').click();
      cy.contains('button', 'Remove request').click();
    });
    cy.location().should(loc => {
      expect(loc.pathname).to.eq('/');
    });
    cy.contains('.usa-alert--success', 'TACO successfully removed');
    cy.contains('Requests will display in a table once you add them');
    cy.get('table').should('not.exist');
  });

  it('can add a note and view it as a 508 user', () => {
    cy.localLogin({ name: 'BOWN' });
    cy.accessibility.create508Request();

    cy.url().then(requestPageUrl => {
      cy.logout();

      cy.localLogin({ name: 'ADMI', role: 'EASI_D_508_USER' });
      cy.visit(requestPageUrl);
    });

    cy.contains('button', 'Notes').click();
    cy.get('#CreateAccessibilityRequestNote-NoteText').type(
      'This is a really great note'
    );
    cy.contains('button', 'Add note').click();
    cy.get('.easi-notes__list li p')
      .should('have.length', 1)
      .first()
      .within(() => {
        cy.contains('This is a really great note');
      });
  });
});
