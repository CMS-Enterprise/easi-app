/* eslint-disable no-unused-expressions */
// eslint no-unused-expressions disabled to avoid throwing errors with Chai assertions
/// <reference types="cypress" />

// mailcatcher API returns email addresses surrounded by angle brackets, i.e. <abcd@local.fake> (applies to requesterEmail and grtEmail)
const euaIDRequester = 'ABCD';
const requesterEmail = `<${euaIDRequester}@local.fake>`;

// use the MAILCATCHER_API_ADDRESS environment variable if present (i.e. when running in CI),
// if not, fallback to localhost:1080
const mailcatcherHost =
  Cypress.env('MAILCATCHER_API_ADDRESS') || 'http://localhost:1080';

// generate our own LCIDs to avoid issues if >9 LCIDs are generated on the same day (see EASI-2037)
let nextLCID = 0;
const generateNewLCID = () => {
  const lcid = nextLCID;
  nextLCID += 1;
  return lcid.toString().padStart(6, '0');
};

// TODO: Remove skip after removing "notifyMultipleRecipients" feature flag
describe.skip('Email notifications', () => {
  // create system intake through UI
  // UUID for system intake can then be accessed with cy.get('@intakeId')
  beforeEach(() => {
    cy.localLogin({ name: euaIDRequester, role: 'EASI_D_GOVTEAM' });

    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'UpdateSystemIntakeContactDetails') {
        req.alias = 'updateContactDetails';
      }

      if (req.body.operationName === 'SubmitIntake') {
        req.alias = 'submitIntake';
      }
    });

    cy.visit('/system/request-type');
    cy.get('#RequestType-NewSystem').check({ force: true });
    cy.contains('button', 'Continue').click();
    cy.contains('a', 'Get started').click();
    cy.wait(1000);
    cy.contains('a', 'Start').click();

    // copied from systemIntake.spec.js smoke test
    cy.systemIntake.contactDetails.fillNonBranchingFields();
    cy.get('#IntakeForm-HasIssoNo').check({ force: true });
    cy.get('#IntakeForm-NoGovernanceTeam').check({ force: true });
    cy.contains('button', 'Next').click();
    cy.wait('@updateContactDetails');
    cy.systemIntake.requestDetails.fillNonBranchingFields();
    cy.get('#IntakeForm-CurrentStage').select('Just an idea');
    cy.contains('button', 'Next').click();
    cy.get('#IntakeForm-CostsExpectingIncreaseNo').check({ force: true });
    cy.get('#IntakeForm-ContractNotNeeded').check({ force: true });
    cy.contains('button', 'Next').click();
    cy.contains('h1', 'Check your answers before sending');
    cy.contains('button', 'Send my intake request').click();

    // get intake ID
    const guidRegex = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;
    cy.location().then(location => {
      const match = guidRegex.exec(location.pathname);

      expect(match).to.not.be.null;

      const intakeId = match[0];
      cy.wrap(intakeId).as('intakeId');
    });
  });

  it('Requests business case', () => {
    // Go to intake action form
    cy.get('@intakeId').then(intakeId => {
      cy.visit(`/governance-review-team/${intakeId}/actions/need-biz-case`);
    });

    // Send feedback
    cy.emailNotifications.sendEmail({
      itInvestmentMailbox: false,
      feedback: true
    });
    cy.contains('h1', 'Intake Request');

    // Check mailcatcher API for what emails have been sent
    cy.request(`${mailcatcherHost}/messages`).then(mailcatcherResponse => {
      expect(mailcatcherResponse.status).to.eq(200);

      const notification = mailcatcherResponse.body.findLast(email =>
        email.recipients.includes(requesterEmail)
      );

      expect(notification, `mail not sent to requester: ${requesterEmail}`).not
        .to.be.undefined;
    });
  });

  it('Issues LCID', () => {
    // Go to intake action form
    cy.get('@intakeId').then(intakeId => {
      cy.visit(`/governance-review-team/${intakeId}/actions/issue-lcid`);
    });

    // Issue LCID and send feedback
    const LCID = generateNewLCID();
    cy.emailNotifications.fillIssueLCIDFields(LCID);
    cy.emailNotifications.sendEmail({ itInvestmentMailbox: true });
    cy.get('[data-testid="grt-notes-view"]');

    // Check mailcatcher API for what emails have been sent
    cy.request(`${mailcatcherHost}/messages`).then(mailcatcherResponse => {
      expect(mailcatcherResponse.status).to.eq(200);

      const notification = mailcatcherResponse.body.findLast(email =>
        email.recipients.includes(requesterEmail)
      );

      expect(notification, `mail not sent to requester: ${requesterEmail}`).not
        .to.be.undefined;
    });
  });

  it('Extends LCID', () => {
    // Go to intake action form
    cy.get('@intakeId').then(intakeId => {
      cy.visit(`/governance-review-team/${intakeId}/actions/issue-lcid`);
    });

    // Issue LCID
    const LCID = generateNewLCID();
    cy.emailNotifications.fillIssueLCIDFields(LCID);
    cy.contains('button', 'Complete action without sending an email').click();

    // Go to intake action form
    cy.get('@intakeId').then(intakeId => {
      cy.visit(`/governance-review-team/${intakeId}/actions/extend-lcid`);
    });

    // Extend LCID
    cy.emailNotifications.fillExtendLCIDFields();
    cy.emailNotifications.sendEmail({
      itInvestmentMailbox: true,
      feedback: false
    });
    cy.get('[data-testid=grt-notes-view]');

    // check mailcatcher API for what emails have been sent
    cy.request(`${mailcatcherHost}/messages`).then(mailcatcherResponse => {
      expect(mailcatcherResponse.status).to.eq(200);

      const notification = mailcatcherResponse.body.find(email =>
        email.recipients.includes(requesterEmail)
      );

      expect(notification, `mail not sent to requester: ${requesterEmail}`).not
        .to.be.undefined;
    });
  });

  it('Closes intake request', () => {
    // Go to intake action form
    cy.get('@intakeId').then(intakeId => {
      cy.visit(`/governance-review-team/${intakeId}/actions/no-governance`);
    });

    // Close intake request
    cy.emailNotifications.sendEmail({
      itInvestmentMailbox: true
    });
    cy.contains('h1', 'Intake Request');

    // check mailcatcher API for what emails have been sent
    cy.request(`${mailcatcherHost}/messages`).then(mailcatcherResponse => {
      expect(mailcatcherResponse.status).to.eq(200);

      const notification = mailcatcherResponse.body.find(email =>
        email.recipients.includes(requesterEmail)
      );

      expect(notification, `mail not sent to requester: ${requesterEmail}`).not
        .to.be.undefined;
    });
  });

  it('Sends not an IT governance request feedback', () => {
    // Go to intake action form
    cy.get('@intakeId').then(intakeId => {
      cy.visit(`/governance-review-team/${intakeId}/actions/not-it-request`);
    });

    // Send feedback
    cy.emailNotifications.sendEmail({
      itInvestmentMailbox: true
    });
    cy.contains('h1', 'Intake Request');

    // check mailcatcher API for what emails have been sent
    cy.request(`${mailcatcherHost}/messages`).then(mailcatcherResponse => {
      expect(mailcatcherResponse.status).to.eq(200);

      const notification = mailcatcherResponse.body.find(email =>
        email.recipients.includes(requesterEmail)
      );

      expect(notification, `mail not sent to requester: ${requesterEmail}`).not
        .to.be.undefined;
    });
  });
});
