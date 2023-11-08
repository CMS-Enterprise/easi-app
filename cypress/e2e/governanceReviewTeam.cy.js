import { DateTime } from 'luxon';

import governaceReviewTeam from '../../src/i18n/en-US/articles/governanceReviewTeam';

describe('Governance Review Team', () => {
  const futureDatetime = DateTime.local().plus({ year: 1 });
  const futureDateYear = futureDatetime.year;

  beforeEach(() => {
    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'GetSystemIntake') {
        req.alias = 'getSystemIntake';
      }
      if (req.body.operationName === 'GetSystemIntakeContactsQuery') {
        req.alias = 'getSystemIntakeContacts';
      }
    });

    cy.localLogin({ name: 'E2E2', role: 'EASI_D_GOVTEAM' });
  });

  it('can assign Admin Lead', () => {
    cy.visit(
      '/governance-review-team/af7a3924-3ff7-48ec-8a54-b8b4bc95610b/intake-request'
    );
    cy.get('[data-testid="admin-lead"]').contains('Not Assigned');
    cy.contains('button', 'Change').click();

    const firstGovTeamMember = governaceReviewTeam.adminLeads.members[0];
    cy.get(`input[value='${firstGovTeamMember}']`).check({ force: true });

    cy.get('[data-testid="button"]').contains('Save').click();
    cy.wait('@getSystemIntake').its('response.statusCode').should('eq', 200);
    cy.get('span[data-testid="admin-lead"]').contains(firstGovTeamMember);
  });

  it('can add GRT/GRB dates', () => {
    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'UpdateSystemIntakeReviewDates') {
        req.alias = 'updateDates';
      }
    });

    // Selecting name based on pre-seeded data
    // A Completed Intake Form - af7a3924-3ff7-48ec-8a54-b8b4bc95610b
    cy.contains('a', 'A Completed Intake Form').should('be.visible').click();
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
    cy.wait('@updateDates').its('response.statusCode').should('eq', 200);

    cy.location().should(loc => {
      expect(loc.pathname).to.eq(
        '/governance-review-team/af7a3924-3ff7-48ec-8a54-b8b4bc95610b/intake-request'
      );
    });

    cy.wait('@getSystemIntake').its('response.statusCode').should('eq', 200);

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

    cy.get('[data-testid="af7a3924-3ff7-48ec-8a54-b8b4bc95610b-row"]').contains(
      'td',
      '11/24/2020'
    );
    cy.get('[data-testid="af7a3924-3ff7-48ec-8a54-b8b4bc95610b-row"]').contains(
      'td',
      '12/25/2020'
    );
  });

  it('can add a note', () => {
    // Selecting name based on pre-seeded data
    // A Completed Intake Form - af7a3924-3ff7-48ec-8a54-b8b4bc95610b
    cy.contains('a', 'A Completed Intake Form').should('be.visible').click();
    cy.get(
      'a[href="/governance-review-team/af7a3924-3ff7-48ec-8a54-b8b4bc95610b/notes"]'
    ).click();

    cy.get('[data-testid="user-note"]').then(notes => {
      const numOfNotes = notes.length;

      const noteFixture = 'Test note';

      cy.get('#GovernanceReviewTeam-Note')
        .type(noteFixture)
        .should('have.html', `<p>${noteFixture}</p>`);

      cy.get('button[type="submit"]').click();

      cy.get('[data-testid="user-note"]').should('have.length', numOfNotes + 1);

      // .first() is the most recent note we just created
      cy.get('[data-testid="user-note"]').first().contains(noteFixture);
      cy.get('[data-testid="user-note"]').first().contains('User E2E2');
    });
  });

  it('can edit a note', () => {
    // Selecting name based on pre-seeded data
    // A Completed Intake Form - af7a3924-3ff7-48ec-8a54-b8b4bc95610b
    cy.contains('a', 'A Completed Intake Form').should('be.visible').click();
    cy.get(
      'a[href="/governance-review-team/af7a3924-3ff7-48ec-8a54-b8b4bc95610b/notes"]'
    ).click();

    cy.get('[data-testid="user-note"]').then(() => {
      cy.get('#GovernanceReviewTeam-EditNoteButton').click();

      const noteFixture = 'Test note';
      cy.get('#GovernanceReviewTeam-EditNote').should(
        'have.html',
        `<p>${noteFixture}</p>`
      );

      cy.get('#GovernanceReviewTeam-EditNote')
        .type(' edited', { force: true })
        .should('have.html', '<p>Test note edited</p>');

      cy.get('#GovernanceReviewTeam-SaveEditsButton').click({ force: true });

      cy.get('[data-testid="user-note"]').first().contains('Test note edited');
    });
  });

  it('can remove/archive a note', () => {
    // Selecting name based on pre-seeded data
    // A Completed Intake Form - af7a3924-3ff7-48ec-8a54-b8b4bc95610b
    cy.contains('a', 'A Completed Intake Form').should('be.visible').click();
    cy.get(
      'a[href="/governance-review-team/af7a3924-3ff7-48ec-8a54-b8b4bc95610b/notes"]'
    ).click();

    cy.get('[data-testid="user-note"]').then(notes => {
      const numOfNotes = notes.length;

      cy.get('#GovernanceReviewTeam-RemoveNoteButton').click();

      cy.get('#GovernanceReviewTeam-SaveArchiveButton').click({ force: true });

      cy.get('[data-testid="user-note"]').should('have.length', numOfNotes - 1);
    });
  });

  it('can issue a Life Cycle ID', () => {
    // Selecting name based on pre-seeded data
    // A Completed Intake Form - af7a3924-3ff7-48ec-8a54-b8b4bc95610b
    cy.governanceReviewTeam.grtActions.selectAction({
      intakeName: 'A Completed Intake Form',
      actionId: 'issue-lcid'
    });

    cy.get('#grtActionEmailRecipientFields').should('be.visible');

    cy.get('#IssueLifecycleIdForm-NewLifecycleIdYes').check({ force: true });
    cy.get('#IssueLifecycleIdForm-NewLifecycleIdYes').should('be.checked');

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
      .type(futureDateYear)
      .should('have.value', futureDateYear);
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
      .contains('Issued Life Cycle ID with no further governance');

    cy.get(
      'a[href="/governance-review-team/af7a3924-3ff7-48ec-8a54-b8b4bc95610b/decision"]'
    ).click();

    cy.contains('h1', 'Decision - Approved');
    cy.get('[data-testid="grt-current-status"]')
      .invoke('text')
      .then(text => {
        expect(text.length).to.equal(28);
      });
    cy.contains('dt', 'Life Cycle ID issued');

    cy.get(
      'a[href="/governance-review-team/af7a3924-3ff7-48ec-8a54-b8b4bc95610b/lcid"]'
    ).click();
    cy.contains('dt', 'Life Cycle ID Expiration')
      .siblings('dd')
      .contains(`December 25, ${futureDateYear}`);
    cy.contains('dt', 'Life Cycle ID Scope').siblings('dd').contains('Scope');
    cy.contains('dt', 'Next Steps').siblings('dd').contains('Next steps');
  });

  it('can close a request', () => {
    // Selecting name based on pre-seeded data
    // Closable Request - 20cbcfbf-6459-4c96-943b-e76b83122dbf
    cy.governanceReviewTeam.grtActions.selectAction({
      intakeName: 'Closable Request',
      actionId: 'no-governance'
    });

    cy.get('#SubmitActionForm-Feedback')
      .type('Feedback')
      .should('have.value', 'Feedback');

    cy.get('button[type="submit"]').click();

    cy.wait('@getSystemIntake').its('response.statusCode').should('eq', 200);

    cy.get('[data-testid="grt-status"]').contains('Closed');

    cy.visit('/');
    cy.get('[data-testid="view-closed-intakes-btn"]').click();
    cy.get('[data-testid="20cbcfbf-6459-4c96-943b-e76b83122dbf-row"]').contains(
      'td',
      'Closed'
    );
  });

  it('can add additional contact as email recipient', () => {
    cy.contains('a', 'Ready for business case').should('be.visible').click();
    cy.get('[data-testid="grt-nav-actions-link"]').click();

    cy.contains('.usa-radio', 'Request a draft business case').click();

    cy.contains('button', 'Continue').click();

    cy.contains('button', 'more recipients').click();

    cy.contains('button', 'Add another recipient').click();

    // Add additional contact
    cy.get('#react-select-IntakeForm-ContactCommonName-input')
      .type('Aaron A')
      .wait(1000)
      .type('{downArrow}{enter}')
      .should('have.value', 'Aaron Adams, ADMN (aaron.adams@local.fake)');

    cy.get('#IntakeForm-ContactComponent')
      .select('Center for Medicare')
      .should('have.value', 'Center for Medicare');

    cy.get('#IntakeForm-ContactRole')
      .select('Product Owner')
      .should('have.value', 'Product Owner');

    cy.contains('button', 'Add recipient').click();

    // Check that contact is automatically selected
    cy.get('input[value="aaron.adams@local.fake"]').should('be.checked');
  });

  it('can extend a Life Cycle ID', () => {
    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'GetAdminNotesAndActions') {
        req.alias = 'getAdminNotesAndActions';
      }
    });

    cy.get('button').contains('Closed requests').click();

    // Navigate to intake and select action
    cy.governanceReviewTeam.grtActions.selectAction({
      intakeName: 'With LCID Issued',
      actionId: 'extend-lcid'
    });

    cy.get('#ExtendLifecycleId-expirationDateMonth')
      .type('08')
      .should('have.value', '08');
    cy.get('#ExtendLifecycleId-expirationDateDay')
      .type('31')
      .should('have.value', '31');
    cy.get('#ExtendLifecycleId-expirationDateYear')
      .type(futureDateYear)
      .should('have.value', futureDateYear);

    cy.get('#ExtendLifecycleIdForm-Scope')
      .type('Scope')
      .should('have.value', 'Scope');

    cy.get('#ExtendLifecycleIdForm-NextSteps')
      .type('Next Steps')
      .should('have.value', 'Next Steps');

    cy.get('#ExtendLifecycleIdForm-CostBaseline')
      .type('Cost Baseline')
      .should('have.value', 'Cost Baseline');

    cy.get('button[type="submit"]').click();

    cy.wait('@getAdminNotesAndActions');
    cy.get('h1').contains('Admin team notes');
  });

  it('can extend a Life Cycle ID with no Cost Baseline', () => {
    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'GetAdminNotesAndActions') {
        req.alias = 'getAdminNotesAndActions';
      }
    });

    cy.get('button').contains('Closed requests').click();

    // Navigate to intake and select action
    cy.governanceReviewTeam.grtActions.selectAction({
      intakeName: 'With LCID Issued',
      actionId: 'extend-lcid'
    });

    cy.get('#ExtendLifecycleId-expirationDateMonth')
      .type('08')
      .should('have.value', '08');
    cy.get('#ExtendLifecycleId-expirationDateDay')
      .type('31')
      .should('have.value', '31');
    cy.get('#ExtendLifecycleId-expirationDateYear')
      .type(futureDateYear)
      .should('have.value', futureDateYear);

    cy.get('#ExtendLifecycleIdForm-Scope')
      .type('Scope')
      .should('have.value', 'Scope');

    cy.get('#ExtendLifecycleIdForm-NextSteps')
      .type('Next Steps')
      .should('have.value', 'Next Steps');

    cy.get('button[type="submit"]').click();

    cy.wait('@getAdminNotesAndActions');
    cy.get('h1').contains('Admin team notes');
  });
});
