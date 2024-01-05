import { DateTime } from 'luxon';

import governaceReviewTeam from '../../src/i18n/en-US/articles/governanceReviewTeam';

describe('Governance Review Team', () => {
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

  it('can issue a new Life Cycle ID', () => {
    cy.contains('a', 'Closable Request').should('be.visible').click();

    cy.get('[data-testid="grt-nav-actions-link"]').click();

    cy.get('#grt-action__resolutions').check({ force: true });

    cy.contains('button', 'Continue').click();

    cy.get('#grt-resolution__issue-lcid').check({ force: true });

    cy.contains('button', 'Next').should('not.be.disabled').click();

    // Complete action form

    const expirationDate = DateTime.local().plus({ year: 1 });
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
    const expirationDate = DateTime.local().plus({ year: 1 });
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

    const expirationDate = DateTime.local().plus({ year: 2 });
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

    cy.get('dd').contains(expirationDate.toFormat('MMMM d, yyyy'));
    cy.get('dd').contains(scope);
    cy.get('dd').contains(nextSteps);
    cy.get('dd').contains(costBaseline);
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

    const retirementDate = DateTime.local().plus({ year: 2 });
    cy.get('#retiresAt').type(retirementDate.toFormat('MM/dd/yyyy'));

    cy.contains('button', 'Complete action').should('not.be.disabled').click();

    // Check form submit was successful

    cy.get('div[data-testid="alert"]').contains(
      'Life Cycle ID 000010 is now retired.'
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
    cy.get('#retiresAt').should('have.value', '01/05/2026');

    // Complete action form

    const retirementDate = DateTime.local()
      .plus({ month: 1, year: 2 })
      .toFormat('MM/dd/yyyy');

    cy.get('#retiresAt').clear();
    cy.get('#retiresAt').type(retirementDate);

    cy.contains('button', 'Complete action').should('not.be.disabled').click();

    // Check form submit was successful

    cy.get('div[data-testid="alert"]').contains(
      'Life Cycle ID 000006 is now retired.'
    );

    // Check retirement date updated

    cy.get('[data-testid="grt-nav-actions-link"]').click();

    cy.get('#grt-action__manage-lcid').check({ force: true });

    cy.contains('button', 'Continue').click();

    cy.get('#grt-lcid-action__retire').check({ force: true });

    cy.contains('button', 'Next').should('not.be.disabled').click();

    cy.get('#retiresAt').should('have.value', retirementDate);
  });

  it.skip('can close a request', () => {
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

    cy.get('[data-testid="request-state"]').contains('Closed');

    cy.visit('/');
    cy.get('[data-testid="view-closed-intakes-btn"]').click();
    cy.get('[data-testid="20cbcfbf-6459-4c96-943b-e76b83122dbf-row"]').contains(
      'td',
      'Not an IT Governance request'
    );
  });

  it.skip('can add additional contact as email recipient', () => {
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
});
