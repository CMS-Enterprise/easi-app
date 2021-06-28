import { DateTime } from 'luxon';

import { formatDate } from '../../src/utils/date';

// scripts/dev db:seed
// 508 Request UUId - 6e224030-09d5-46f7-ad04-4bb851b36eab

describe('Accessibility Requests', () => {
  it('can create a request and see its details', () => {
    cy.localLogin({ name: 'A11Y' });
    cy.accessibility.create508Request();

    cy.get('.accessibility-request__side-nav').within(() => {
      cy.contains('h2', 'Test Dates and Scores');
      cy.get('.accessibility-request__other-details').within(() => {
        cy.contains('dt', 'Submission date');
        const dateString = formatDate(new Date().toISOString());
        cy.contains('dd', dateString);

        cy.contains('dt', 'Business Owner');
        cy.contains('dd', 'Shane Clark, OIT');

        cy.contains('dt', 'Project name');
        cy.contains('dd', 'TACO');

        cy.contains('dt', 'Lifecycle ID');
        cy.contains('dd', '000000');
      });

      cy.contains('a', '508 testing templates (opens in a new tab)');
      cy.contains('a', 'Steps involved in 508 testing (opens in a new tab)');
      cy.contains('button', 'Remove this request from EASi');
    });
  });

  it('adds and removes a document from a 508 request as the owner', () => {
    cy.localLogin({ name: 'CMSU' });
    cy.accessibility.create508Request();
    cy.accessibility.addDocument();
    cy.contains('h2', 'Next step: Provide your documents');
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

    cy.contains('div', 'No documents added to request yet.');
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

  describe('test dates', () => {
    beforeEach(() => {
      cy.localLogin({ name: 'ADMI', role: 'EASI_D_508_USER' });
      cy.visit('/508/requests/6e224030-09d5-46f7-ad04-4bb851b36eab');
    });

    it('adds a 508 test date', () => {
      // This seeded 508 request comes with a test date that's scheduled one day
      // after the 508 request was created. This is why we're adding a test date
      // two days into the future.
      const now = DateTime.local();
      const currentMonth = String(now.month);
      const tomorrow = String(now.day + 2);
      const currentYear = String(now.year);
      const tomorrowDate = formatDate(
        DateTime.fromObject({
          month: currentMonth,
          day: tomorrow,
          year: currentYear
        }).toISO()
      );

      cy.get('h1').contains('Seeded 508 Request');
      cy.get('a').contains('Add a date').click();

      cy.get('#TestDate-TestTypeRemediation')
        .check({ force: true })
        .should('be.checked');
      cy.get('#TestDate-DateMonth')
        .type(currentMonth)
        .should('have.value', currentMonth);
      cy.get('#TestDate-DateDay').type(tomorrow).should('have.value', tomorrow);
      cy.get('#TestDate-DateYear')
        .type(currentYear)
        .should('have.value', currentYear);
      cy.get('#TestDate-HasScoreYes')
        .check({ force: true })
        .should('be.checked');
      cy.get('#TestDate-ScoreValue').type('100').should('have.value', '100');

      cy.get('button').contains('Add date').click();

      cy.location().should(loc => {
        expect(loc.pathname).to.eq(
          '/508/requests/6e224030-09d5-46f7-ad04-4bb851b36eab'
        );
      });
      cy.get('[data-testid="alert"]');

      cy.get('b').contains('Test 2: Remediation');
      cy.get('b')
        .contains('Test 2: Remediation')
        .siblings('p')
        .contains(tomorrowDate);
      cy.get('b')
        .contains('Test 2: Remediation')
        .siblings('p')
        .contains('100.0%');
    });

    it('updates a test date', () => {
      cy.get('[data-testid="test-date-edit-link"]').first().click();

      cy.get('#TestDate-HasScoreYes')
        .check({ force: true })
        .should('be.checked');
      cy.get('#TestDate-ScoreValue')
        .clear()
        .type('99')
        .should('have.value', '99');

      cy.get('button').contains('Update date').click();

      cy.location().should(loc => {
        expect(loc.pathname).to.eq(
          '/508/requests/6e224030-09d5-46f7-ad04-4bb851b36eab'
        );
      });
      cy.get('b').contains('Test 1: Initial');
      cy.get('b').contains('Test 1: Initial').siblings('p').contains('99.0%');
    });

    it('removes a test date', () => {
      cy.get('[data-testid="test-date-edit-link"]').then(els => {
        const numOfTestDates = els.length;

        cy.get('[data-testid="test-date-delete-button"]').first().click();
        cy.get('button').contains('Remove test date').click();

        cy.get('[data-testid="alert"]');
        cy.get('[data-testid="test-date-edit-link"]').should(
          'have.length',
          numOfTestDates - 1
        );
      });
    });
  });
});
