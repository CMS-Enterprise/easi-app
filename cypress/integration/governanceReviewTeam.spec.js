describe('Governance Review Team', () => {
  beforeEach(() => {
    cy.server();
    cy.route('GET', '/api/v1/system_intakes?status=open').as('getOpenIntakes');
    cy.localLogin({ name: 'GRTB', role: 'EASI_D_GOVTEAM' });
    cy.wait('@getOpenIntakes').its('status').should('equal', 200);
  });

  it('can assign Admin Lead', () => {
    cy.visit(
      '/governance-review-team/af7a3924-3ff7-48ec-8a54-b8b4bc95610b/intake-request'
    );
    cy.get('[data-testid="admin-lead"]').contains('Not Assigned');
    cy.contains('button', 'Change').click();
    cy.get('input[value="Ann Rudolph"]').check({ force: true });
    cy.get('[data-testid="button"]').contains('Save').click();
    cy.get('dd[data-testid="admin-lead"]').contains('Ann Rudolph');
  });

  it('can add GRT/GRB dates', () => {
    // Selecting name based on pre-seeded data
    // A Completed Intake Form - af7a3924-3ff7-48ec-8a54-b8b4bc95610b
    cy.get('a').contains('A Completed Intake Form').click();
    cy.get(
      'a[href="/governance-review-team/af7a3924-3ff7-48ec-8a54-b8b4bc95610b/dates"]'
    ).click();

    cy.get('#Dates-GrtDateMonth').clear().type('11').should('have.value', '11');
    cy.get('#Dates-GrtDateDay').clear().type('24').should('have.value', '24');
    cy.get('#Dates-GrtDateYear')
      .clear()
      .type('2020')
      .should('have.value', '2020');

    cy.get('#Dates-GrbDateMonth').clear().type('12').should('have.value', '12');
    cy.get('#Dates-GrbDateDay').clear().type('25').should('have.value', '25');
    cy.get('#Dates-GrbDateYear')
      .clear()
      .type('2020')
      .should('have.value', '2020');

    cy.get('button[type="submit"]').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.eq(
        '/governance-review-team/af7a3924-3ff7-48ec-8a54-b8b4bc95610b/intake-request'
      );
    });

    cy.get(
      'a[href="/governance-review-team/af7a3924-3ff7-48ec-8a54-b8b4bc95610b/dates"]'
    ).click();

    cy.get('#Dates-GrtDateMonth').should('have.value', '11');
    cy.get('#Dates-GrtDateDay').should('have.value', '24');
    cy.get('#Dates-GrtDateYear').should('have.value', '2020');

    cy.get('#Dates-GrbDateMonth').should('have.value', '12');
    cy.get('#Dates-GrbDateDay').should('have.value', '25');
    cy.get('#Dates-GrbDateYear').should('have.value', '2020');

    cy.visit('/');
    cy.wait('@getOpenIntakes').its('status').should('equal', 200);

    cy.get('[data-testid="af7a3924-3ff7-48ec-8a54-b8b4bc95610b-row"]').contains(
      'td',
      'November 24 2020'
    );
    cy.get('[data-testid="af7a3924-3ff7-48ec-8a54-b8b4bc95610b-row"]').contains(
      'td',
      'December 25 2020'
    );
  });

  it('can add a note', () => {
    // Selecting name based on pre-seeded data
    // A Completed Intake Form - af7a3924-3ff7-48ec-8a54-b8b4bc95610b
    cy.get('a').contains('A Completed Intake Form').click();
    cy.get(
      'a[href="/governance-review-team/af7a3924-3ff7-48ec-8a54-b8b4bc95610b/notes"]'
    ).click();

    cy.get('[data-testid="user-note"]').then(notes => {
      const numOfNotes = notes.length;

      const noteFixture = 'Test note';

      cy.get('#GovernanceReviewTeam-Note')
        .type(noteFixture)
        .should('have.value', noteFixture);

      cy.get('button[type="submit"]').click();

      cy.get('[data-testid="user-note"]').should('have.length', numOfNotes + 1);

      // .first() is the most recent note we just created
      cy.get('[data-testid="user-note"]').first().contains(noteFixture);
      cy.get('[data-testid="user-note"]').first().contains('User GRTB');
    });
  });

  it('can issue a Lifecycle ID', () => {
    // Selecting name based on pre-seeded data
    // A Completed Intake Form - af7a3924-3ff7-48ec-8a54-b8b4bc95610b
    cy.get('a').contains('A Completed Intake Form').click();
    cy.get(
      'a[href="/governance-review-team/af7a3924-3ff7-48ec-8a54-b8b4bc95610b/actions"]'
    )
      .contains('Take an action')
      .click();

    cy.get('button[data-testid="collapsable-link"]').click();
    cy.get('#issue-lcid').check({ force: true }).should('be.checked');
    cy.get('button[type="submit"]').click();

    cy.get('#IssueLifecycleIdForm-NewLifecycleIdYes')
      .check({ force: true })
      .should('be.checked');
    cy.get('#IssueLifecycleIdForm-ExpirationDateMonth')
      .clear()
      .type('12')
      .should('have.value', '12');
    cy.get('#IssueLifecycleIdForm-ExpirationDateDay')
      .clear()
      .type('25')
      .should('have.value', '25');
    cy.get('#IssueLifecycleIdForm-ExpirationDateYear')
      .clear()
      .type('2020')
      .should('have.value', '2020');
    cy.get('#IssueLifecycleIdForm-Scope')
      .type('Scope')
      .should('have.value', 'Scope');
    cy.get('#IssueLifecycleIdForm-NextSteps')
      .type('Next steps')
      .should('have.value', 'Next steps');
    cy.get('#IssueLifecycleIdForm-Feedback')
      .type('Feedback')
      .should('have.value', 'Feedback');
    cy.get('button[type="submit"]').click();

    cy.get('[data-testid="action-note"]')
      .first()
      .contains('Issued Lifecycle ID with no further governance');

    cy.get(
      'a[href="/governance-review-team/af7a3924-3ff7-48ec-8a54-b8b4bc95610b/decision"]'
    ).click();

    cy.contains('h1', 'Decision - Approved');
    cy.contains('.easi-review-row dt', 'Lifecycle ID')
      .siblings('dd')
      .invoke('text')
      .then(text => {
        expect(text.length).to.equal(6);
      });
    cy.contains('.easi-review-row dt', 'Lifecycle ID Expiration')
      .siblings('dd')
      .contains('December 25 2020');
    cy.contains('.easi-review-row dt', 'Lifecycle ID Scope')
      .siblings('dd')
      .contains('Scope');
    cy.contains('.easi-review-row dt', 'Next Steps')
      .siblings('dd')
      .contains('Next steps');
  });
});
