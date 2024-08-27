import { DateTime } from 'luxon';

import governaceReviewTeam from '../../src/i18n/en-US/articles/governanceReviewTeam';

describe('Governance Review Team', () => {
  // Expiration and retirement dates
  // Matches pattern set in seed data: +1 year for expiration, +2 years for retirement
  const expirationDate = DateTime.local().plus({ year: 1 });
  const retirementDate = expirationDate.plus({ year: 1 });

  beforeEach(() => {
    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'GetSystemIntake') {
        req.alias = 'getSystemIntake';
      }
      if (req.body.operationName === 'GetGovernanceTaskList') {
        req.alias = 'getGovernanceTaskList';
      }
    });

    cy.localLogin({ name: 'E2E2', role: 'EASI_D_GOVTEAM' });
  });

  it('can assign Admin Lead', () => {
    cy.visit(
      '/it-governance/af7a3924-3ff7-48ec-8a54-b8b4bc95610b/intake-request'
    );
    cy.get('[data-testid="admin-lead"]').contains('Not Assigned');
    cy.contains('button', 'Assign').click();

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
      'a[href="/it-governance/af7a3924-3ff7-48ec-8a54-b8b4bc95610b/dates"]'
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
        '/it-governance/af7a3924-3ff7-48ec-8a54-b8b4bc95610b/intake-request'
      );
    });

    cy.wait('@getSystemIntake').its('response.statusCode').should('eq', 200);

    cy.get(
      'a[href="/it-governance/af7a3924-3ff7-48ec-8a54-b8b4bc95610b/dates"]'
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
      'a[href="/it-governance/af7a3924-3ff7-48ec-8a54-b8b4bc95610b/notes"]'
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
      'a[href="/it-governance/af7a3924-3ff7-48ec-8a54-b8b4bc95610b/notes"]'
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
      'a[href="/it-governance/af7a3924-3ff7-48ec-8a54-b8b4bc95610b/notes"]'
    ).click();

    cy.get('[data-testid="user-note"]').then(notes => {
      const numOfNotes = notes.length;

      cy.get('#GovernanceReviewTeam-RemoveNoteButton').click();

      cy.get('#GovernanceReviewTeam-SaveArchiveButton').click({ force: true });

      cy.get('[data-testid="user-note"]').should('have.length', numOfNotes - 1);
    });
  });

  it('can issue a new Life Cycle ID', () => {
    cy.contains('a', 'Closable Request').should('be.visible').click();

    cy.get('[data-testid="grt-nav-actions-link"]').click();

    cy.get('#grt-action__resolutions').check({ force: true });

    cy.contains('button', 'Continue').click();

    cy.get('#grt-resolution__issue-lcid').check({ force: true });

    cy.contains('button', 'Next').should('not.be.disabled').click();

    // Complete action form

    const scope = 'Test scope for issuing new LCID';
    const nextSteps = 'Test next steps for issuing new LCID';
    const costBaseline = 'Test next steps for issuing new LCID';

    cy.get('#useExistingLcid_false').check({ force: true });

    cy.get('#expiresAt').type(expirationDate.toFormat('MM/dd/yyyy'));
    cy.get('div#scope').type(scope);
    cy.get('div#nextSteps').type(nextSteps);
    cy.get('#stronglyRecommended').check({ force: true });
    cy.get('#costBaseline').type(costBaseline);

    cy.contains('button', 'Complete action').should('not.be.disabled').click();

    // Check decision was issued and request closed

    cy.get('[data-testid="request-state"').contains('Closed');
    cy.get('[data-testid="grt-current-status"]').contains(
      /LCID issued: [0-9]{6}/
    );

    // Check correct values are displayed on Life Cycle ID page

    cy.get('[data-testid="grt-nav-lifecycleID.title-link"]').click();

    cy.get('dd').contains(expirationDate.toFormat('MMMM d, yyyy'));
    cy.get('dd').contains(scope);
    cy.get('dd').contains(nextSteps);
    cy.get('dd').contains('Yes, strongly recommend');
    cy.get('dd').contains(costBaseline);
  });

  it('can issue an existing Life Cycle ID', () => {
    cy.contains('a', 'final biz case submitted').should('be.visible').click();

    cy.get('[data-testid="grt-nav-actions-link"]').click();

    cy.get('#grt-action__resolutions').check({ force: true });

    cy.contains('button', 'Continue').click();

    cy.get('#grt-resolution__issue-lcid').check({ force: true });

    cy.contains('button', 'Next').should('not.be.disabled').click();

    // Complete action form

    const lcid = '000001';
    const scope = 'Test scope for issuing existing LCID';
    const nextSteps = 'Test next steps for issuing existing LCID';
    const costBaseline = 'Test next steps for issuing existing LCID';

    cy.get('#useExistingLcid_true').check({ force: true });
    cy.get('#useExistingLcid').select(lcid).should('have.value', lcid);

    cy.get('#expiresAt').clear();
    cy.get('#expiresAt').type(expirationDate.toFormat('MM/dd/yyyy'));

    cy.get('div#scope').clear();
    cy.get('div#scope').type(scope);

    cy.get('div#nextSteps').clear();
    cy.get('div#nextSteps').type(nextSteps);

    cy.get('#stronglyRecommended').check({ force: true });

    cy.get('#costBaseline').clear();
    cy.get('#costBaseline').type(costBaseline);

    cy.contains('button', 'Complete action').should('not.be.disabled').click();

    // Check decision was issued and request closed

    cy.get('[data-testid="request-state"').contains('Closed');
    cy.get('[data-testid="grt-current-status"]').contains(
      `LCID issued: ${lcid}`
    );

    // Check correct values are displayed on Life Cycle ID page

    cy.get('[data-testid="grt-nav-lifecycleID.title-link"]').click();

    cy.get('dd').contains(lcid);
    cy.get('dd').contains(expirationDate.toFormat('MMMM d, yyyy'));
    cy.get('dd').contains(scope);
    cy.get('dd').contains(nextSteps);
    cy.get('dd').contains('Yes, strongly recommend');
    cy.get('dd').contains(costBaseline);
  });

  it('can update a Life Cycle ID', () => {
    cy.contains('button', 'Closed requests').click();

    cy.contains('a', 'Closable Request').should('be.visible').click();

    cy.get('[data-testid="grt-nav-actions-link"]').click();

    cy.get('#grt-action__manage-lcid').check({ force: true });

    cy.contains('button', 'Continue').click();

    cy.get('#grt-lcid-action__update').check({ force: true });

    cy.contains('button', 'Next').should('not.be.disabled').click();

    // Complete action form

    const scope = 'Updated test scope for issuing LCID';
    const nextSteps = 'Updated test next steps for issuing LCID';
    const costBaseline = 'Updated test cost baseline for issuing LCID';

    cy.get('#expiresAt').type(expirationDate.toFormat('MM/dd/yyyy'));
    cy.get('div#scope').type(scope);
    cy.get('div#nextSteps').type(nextSteps);
    cy.get('#costBaseline').type(costBaseline);

    cy.contains('button', 'Complete action').should('not.be.disabled').click();

    // Check form submit was successful
    cy.get('div[data-testid="alert"]').contains(
      /Life Cycle ID [0-9]{6} has been updated./
    );

    // Check updated values are displayed on Life Cycle ID page

    cy.get('[data-testid="grt-nav-lifecycleID.title-link"]').click();

    // Wait for task list query to complete
    cy.wait('@getGovernanceTaskList')
      .its('response.statusCode')
      .should('eq', 200);

    cy.get('dd').contains(expirationDate.toFormat('MMMM d, yyyy'));
    cy.get('dd').contains(scope);
    cy.get('dd').contains(nextSteps);
    cy.get('dd').contains(costBaseline);
  });

  it('can expire a Life Cycle ID', () => {
    cy.contains('button', 'Closed requests').click();

    cy.contains('a', 'Updated LCID').should('be.visible').click();

    cy.get('[data-testid="grt-nav-actions-link"]').click();

    cy.get('#grt-action__manage-lcid').check({ force: true });

    cy.contains('button', 'Continue').click();

    cy.get('#grt-lcid-action__expire').check({ force: true });

    cy.contains('button', 'Next').should('not.be.disabled').click();

    // Complete action form

    cy.get('div#reason').type('Test reason for expiring this Life Cycle ID');

    cy.contains('button', 'Complete action').should('not.be.disabled').click();

    // Check form submit was successful
    cy.get('div[data-testid="alert"]').contains(
      /Life Cycle ID [0-9]{6} is now expired./
    );
  });

  it('can retire a Life Cycle ID', () => {
    cy.contains('button', 'Closed requests').click();

    cy.contains('a', 'LCID issued').should('be.visible').click();

    cy.get('[data-testid="grt-nav-actions-link"]').click();

    cy.get('#grt-action__manage-lcid').check({ force: true });

    cy.contains('button', 'Continue').click();

    cy.get('#grt-lcid-action__retire').check({ force: true });

    cy.contains('button', 'Next').should('not.be.disabled').click();

    cy.contains('h3', 'Retire a Life Cycle ID');

    // Complete action form

    cy.get('#retiresAt').type(retirementDate.toFormat('MM/dd/yyyy'));

    cy.contains('button', 'Complete action').should('not.be.disabled').click();

    // Check form submit was successful
    cy.get('div[data-testid="alert"]').contains(
      /Life Cycle ID [0-9]{6} is now retired./
    );
  });

  it('can update a Life Cycle ID retirement date', () => {
    cy.contains('button', 'Closed requests').click();

    cy.contains('a', 'Retired LCID').should('be.visible').click();

    cy.get('[data-testid="grt-nav-actions-link"]').click();

    cy.get('#grt-action__manage-lcid').check({ force: true });

    cy.contains('button', 'Continue').click();

    cy.get('#grt-lcid-action__retire').check({ force: true });

    cy.contains('button', 'Next').should('not.be.disabled').click();

    cy.contains('h3', 'Change retirement date');

    // Check initial retirement date
    cy.get('#retiresAt').should(
      'have.value',
      retirementDate.toFormat('MM/dd/yyyy')
    );

    // Complete action form

    const updatedRetirementDate = retirementDate
      .plus({ month: 1 })
      .toFormat('MM/dd/yyyy');

    cy.get('#retiresAt').clear();
    cy.get('#retiresAt').type(updatedRetirementDate);

    cy.contains('button', 'Complete action').should('not.be.disabled').click();

    // Check form submit was successful
    cy.get('div[data-testid="alert"]').contains(
      /Life Cycle ID [0-9]{6} is now retired./
    );

    /* TODO: Fix bug where page reloads after "Manage Life Cycle ID" option is checked */

    // Check retirement date updated

    // cy.get('[data-testid="grt-nav-actions-link"]').click();

    // // Wait for task list query to complete
    // cy.wait('@getGovernanceTaskList')
    //   .its('response.statusCode')
    //   .should('eq', 200);

    // cy.get('#grt-action__manage-lcid').check({ force: true });

    /* Page is reloading here, which is clearing the selection and disabling the Continue button */

    // cy.contains('button', 'Continue').click();

    // cy.get('#grt-lcid-action__retire').check({ force: true });

    // cy.contains('button', 'Next').should('not.be.disabled').click();

    // cy.get('#retiresAt').should('have.value', updatedRetirementDate);
  });

  it('can progress to the GRT meeting step', () => {
    cy.contains('a', 'Draft Business Case').should('be.visible').click();

    cy.get('[data-testid="grt-nav-actions-link"]').click();

    cy.get('#grt-action__new-step').check({ force: true });

    cy.contains('button', 'Continue').click();

    // Complete action form

    cy.get('#GRT_MEETING').check({ force: true });

    cy.get('#meetingDate').type('01/01/2024');

    cy.contains('button', 'Complete action').should('not.be.disabled').click();

    // Check form submit was successful
    cy.get('div[data-testid="alert"]').contains(
      'Action complete. This request is now ready for a GRT meeting.'
    );

    // Check for correct status
    cy.get('[data-testid="grt-current-status"]').contains(
      'GRT meeting complete'
    );

    // Check GRT meeting date was set

    cy.get('[data-testid="grt-nav-dates.heading-link"]').click();

    cy.get('#Dates-GrtDateMonth').should('have.value', '1');
    cy.get('#Dates-GrtDateDay').should('have.value', '1');
    cy.get('#Dates-GrtDateYear').should('have.value', '2024');
  });

  it('can close a request', () => {
    cy.contains('a', 'grt meeting with date set in past')
      .should('be.visible')
      .click();

    cy.get('[data-testid="grt-nav-actions-link"]').click();

    cy.get('#grt-action__resolutions').check({ force: true });

    cy.contains('button', 'Continue').click();

    cy.get('#grt-resolution__close-request').check({ force: true });

    cy.contains('button', 'Next').should('not.be.disabled').click();

    // Complete action form

    cy.get('#reason').type('Reason for closing request');

    cy.contains('button', 'Complete action').should('not.be.disabled').click();

    // Check request state is set to Closed
    cy.get('[data-testid="request-state"').contains('Closed');

    // Check intake shows in admin table for closed requests
    cy.visit('/');
    cy.contains('button', 'Closed requests').click();
    cy.get('#system-intakes-table__closed').contains(
      'a',
      'grt meeting with date set in past'
    );
  });

  it('can re-open a request', () => {
    cy.contains('button', 'Closed requests').click();

    cy.contains('a', 'Closed Request').should('be.visible').click();

    cy.get('[data-testid="grt-nav-actions-link"]').click();

    cy.get('#grt-action__resolutions').check({ force: true });

    cy.contains('button', 'Continue').click();

    cy.get('#grt-resolution__re-open-request').check({ force: true });

    cy.contains('button', 'Next').should('not.be.disabled').click();

    // Complete action form

    cy.get('#reason').type('Reason for re-opening request');

    cy.contains('button', 'Complete action').should('not.be.disabled').click();

    // Check request state is set to Open
    cy.get('[data-testid="request-state"').contains('Open');

    // Check intake shows in admin table for closed requests
    cy.visit('/');
    cy.get('#system-intakes-table__open').contains('a', 'Closed Request');
  });

  it('can add additional contact as email recipient', () => {
    cy.contains('a', 'initial form filled and submitted')
      .should('be.visible')
      .click();

    cy.get('[data-testid="grt-nav-actions-link"]').click();

    cy.get('#grt-action__new-step').check({ force: true });

    cy.contains('button', 'Continue').click();

    // Add additional contact

    cy.contains('button', 'more recipients').click();

    cy.contains('button', 'Add another recipient').click();

    cy.get('#react-select-IntakeForm-ContactCommonName-input')
      .type('Aaron A')
      .wait(2000) // See Note [Specific Cypress wait duration on Okta search]
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
});
