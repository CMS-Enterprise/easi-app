/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-expressions */
// eslint no-restricted-syntax disabled to allow using for-of loops
// eslint no-unused-expressions disabled to avoid throwing errors with Chai assertions
/// <reference types="cypress" />
import { v4 as uuidv4 } from 'uuid';

// SHA-256 hash (used as key in LaunchDarkly flagdata.json) - 68942a05a8732638e45824ff0d8869b576b4144704581e8ff6acee9548aa28e6
const euaIDFeatureFlagSet = 'CYPT';

// SHA-256 hash (used as key in LaunchDarkly flagdata.json) - 4504a9c0c58fdc6d43a4e9ff7331aecc5041c082c32db26621bf0a94133bf54b
const euaIDFeatureFlagUnset = 'CYPF';

// mailcatcher API returns email addresses surrounded by angle brackets, i.e. <abcd@local.fake> (applies to requesterEmail and grtEmail)
const euaIDRequester = 'ABCD';
const requesterEmail = `<${euaIDRequester}@local.fake>`;

// This is the email address the backend will use for sending emails to the GRT inbox;
// When running in CI tests or a deployed environment, the backend pulls it from the GRT_EMAIL environment variable;
// when running locally, pkg/server/routes.go hardcodes the address in emailConfig for clarity
const grtEmail = `<${Cypress.env('GRT_EMAIL') || 'grt_email@cms.gov'}>`;

// must match subject set in pkg/email/issue_lcid.go
const issueLCIDEmailSubject = 'Your request has been approved';

// must match subject set in pkg/email/extend_lcid.go
const extendLCIDEmailSubject = 'Lifecycle ID Extended';

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

// create system intake through UI
// UUID for system intake can then be accessed with cy.get('@intakeId')
const createIntake = () => {
  cy.localLogin({ name: euaIDRequester });

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
  cy.get('#IntakeForm-HasFundingSourceNo').check({ force: true });
  cy.get('#IntakeForm-CostsExpectingIncreaseNo').check({ force: true });
  cy.get('#IntakeForm-ContractNotNeeded').check({ force: true });
  cy.contains('button', 'Next').click();
  cy.contains('h1', 'Check your answers before sending');
  cy.contains('button', 'Send my intake request').click();
  cy.wait('@submitIntake');

  // get intake ID
  const guidRegex = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;
  cy.location().then(location => {
    const match = guidRegex.exec(location.pathname);

    expect(match).to.not.be.null;

    const intakeId = match[0];
    cy.wrap(intakeId).as('intakeId');
  });
};

describe.skip('Email notifications', () => {
  describe('Issuing lifecycle IDs', () => {
    describe('With feature flag set to allow multiple notifications', () => {
      it("Sends multiple emails to multiple recipients, without CC'ing GRT team", () => {
        createIntake();

        // include UUIDs in recipient emails so they can be uniquely identified later
        const recipient1 = `abcd${uuidv4()}@local.fake`;
        const recipient2 = `efgh${uuidv4()}@local.fake`;

        // issue LCID through GQL
        // TODO - EASI-2019 - go through UI instead of making GQL calls
        cy.get('@intakeId').then(intakeId => {
          cy.task('issueLCID', {
            euaId: euaIDFeatureFlagSet,
            intakeId,
            shouldSendEmail: true,
            recipientEmails: [recipient1, recipient2],
            scope: 'scope',
            lcid: generateNewLCID()
          });
        });

        // check mailcatcher API for what emails have been sent
        cy.request(`${mailcatcherHost}/messages`).then(mailcatcherResponse => {
          expect(mailcatcherResponse.status).to.eq(200);

          // mailcatcher API returns email addresses surrounded by angle brackets, i.e. <abcd@local.fake>
          const recipient1WithBrackets = `<${recipient1}>`;
          const recipient2WithBrackets = `<${recipient2}>`;

          const notification1 = mailcatcherResponse.body.find(email =>
            email.recipients.includes(recipient1WithBrackets)
          );
          const notification2 = mailcatcherResponse.body.find(email =>
            email.recipients.includes(recipient2WithBrackets)
          );

          expect(notification1, `mail not sent to recipient1: ${recipient1}`)
            .not.to.be.undefined;

          expect(notification2, `mail not sent to recipient2: ${recipient2}`)
            .not.to.be.undefined;

          // check that notifications were *not* sent to GRT team
          expect(
            notification1.recipients.length,
            `notification for recipient1 sent to other recipients`
          ).to.equal(1);
          expect(
            notification2.recipients.length,
            `notification for recipient2 sent to other recipients`
          ).to.equal(1);
        });
      });

      it("Doesn't send emails when no recipients are specified", () => {
        createIntake();

        // use for uniquely identifying any emails for issuing this LCID
        const scope = `scope-${uuidv4()}`;

        // issue LCID through GQL
        // TODO - EASI-2019 - go through UI instead of making GQL calls
        cy.get('@intakeId').then(intakeId => {
          cy.task('issueLCID', {
            euaId: euaIDFeatureFlagSet,
            intakeId,
            shouldSendEmail: true,
            recipientEmails: [],
            scope,
            lcid: generateNewLCID()
          });
        });

        // check mailcatcher API for what emails have been sent
        cy.request(`${mailcatcherHost}/messages`).then(mailcatcherResponse => {
          expect(mailcatcherResponse.status).to.eq(200);

          const lcidIssuingEmails = mailcatcherResponse.body.filter(
            email => email.subject === issueLCIDEmailSubject
          );

          // make sure of all the notifications sent for issuing LCIDs, none were sent for *this specific LCID* (indicated by scope)
          for (const email of lcidIssuingEmails) {
            cy.request(`${mailcatcherHost}/messages/${email.id}.html`).then(
              emailBodyResponse => {
                expect(emailBodyResponse.status).to.eq(200);
                expect(emailBodyResponse.body).not.to.include(scope);
              }
            );
          }
        });
      });
    });

    // TODO - EASI-2021 - should no longer be needed
    describe('Without feature flag for multiple notifications set', () => {
      it("Notifies requester and CC's GRT when shouldSendEmail is selected", () => {
        createIntake();

        // set scope message based on UUID so we can uniquely identify message
        const scope = `scope-${uuidv4()}`;

        // issue LCID through GQL
        cy.get('@intakeId').then(intakeId => {
          cy.task('issueLCID', {
            euaId: euaIDFeatureFlagUnset,
            intakeId,
            shouldSendEmail: true,
            recipientEmails: [],
            scope,
            lcid: generateNewLCID()
          });
        });

        // check mailcatcher API for what emails have been sent
        cy.request(`${mailcatcherHost}/messages`).then(mailcatcherResponse => {
          expect(mailcatcherResponse.status).to.eq(200);

          // this check isn't technically *required*, but it cuts down on the number of requests we have to make to Mailcatcher
          const emailsSentToMultipleRecipients = mailcatcherResponse.body.filter(
            email => email.recipients.length === 2
          );
          expect(emailsSentToMultipleRecipients.length).to.be.greaterThan(0);

          // make sure a notification was sent for issuing *this specific LCID* to both requester and GRT
          for (const email of emailsSentToMultipleRecipients) {
            cy.request(`${mailcatcherHost}/messages/${email.id}.html`).then(
              emailBodyResponse => {
                expect(emailBodyResponse.status).to.eq(200);
                if (emailBodyResponse.body.includes(scope)) {
                  const specificEmailMetadata = mailcatcherResponse.body.find(
                    emailMetadata => emailMetadata.id === email.id
                  );
                  cy.wrap(specificEmailMetadata).as('specificEmailMetadata');
                }
              }
            );
          }

          cy.get('@specificEmailMetadata').then(specificEmailMetadata => {
            expect(specificEmailMetadata).not.to.be.undefined;
            expect(specificEmailMetadata.recipients).to.have.length(2);
            expect(specificEmailMetadata.recipients).to.include(requesterEmail);
            expect(specificEmailMetadata.recipients).to.include(grtEmail);
          });
        });
      });

      it("Doesn't send emails when shouldSendEmail isn't selected", () => {
        createIntake();

        // set scope message based on UUID so we can uniquely identify message
        const scope = `scope-${uuidv4()}`;

        // issue LCID through GQL
        cy.get('@intakeId').then(intakeId => {
          cy.task('issueLCID', {
            euaId: euaIDFeatureFlagUnset,
            intakeId,
            shouldSendEmail: false,
            recipientEmails: [],
            scope,
            lcid: generateNewLCID()
          });
        });

        // check mailcatcher API for what emails have been sent
        cy.request(`${mailcatcherHost}/messages`).then(mailcatcherResponse => {
          expect(mailcatcherResponse.status).to.eq(200);

          const lcidIssuingEmails = mailcatcherResponse.body.filter(
            email => email.subject === issueLCIDEmailSubject
          );

          // make sure of all the notifications sent for issuing LCIDs, none were sent for *this specific LCID* (indicated by scope)
          for (const email of lcidIssuingEmails) {
            cy.request(`${mailcatcherHost}/messages/${email.id}.html`).then(
              emailBodyResponse => {
                expect(emailBodyResponse.status).to.eq(200);
                expect(emailBodyResponse.body).not.to.include(scope);
              }
            );
          }
        });
      });
    });
  });

  describe('Extending lifecycle IDs', () => {
    describe('With feature flag set to allow multiple notifications', () => {
      it("Sends multiple emails to multiple recipients, without CC'ing GRT team", () => {
        createIntake();

        // issue LCID through GQL
        // TODO - EASI-2019 - go through UI instead of making GQL calls
        cy.get('@intakeId').then(intakeId => {
          cy.task('issueLCID', {
            euaId: euaIDFeatureFlagSet,
            intakeId,
            shouldSendEmail: false,
            recipientEmails: [],
            scope: 'scope',
            lcid: generateNewLCID()
          });
        });

        // include UUIDs in recipient emails so they can be uniquely identified later
        const recipient1 = `abcd${uuidv4()}@local.fake`;
        const recipient2 = `efgh${uuidv4()}@local.fake`;

        // extend LCID through GQL
        // TODO - EASI-2019 - go through UI instead of making GQL calls
        cy.get('@intakeId').then(intakeId => {
          cy.task('extendLCID', {
            euaId: euaIDFeatureFlagSet,
            intakeId,
            shouldSendEmail: false,
            recipientEmails: [recipient1, recipient2],
            scope: 'scope'
          });
        });

        // check mailcatcher API for what emails have been sent
        cy.request(`${mailcatcherHost}/messages`).then(mailcatcherResponse => {
          expect(mailcatcherResponse.status).to.eq(200);

          // mailcatcher API returns email addresses surrounded by angle brackets, i.e. <abcd@local.fake>
          const recipient1WithBrackets = `<${recipient1}>`;
          const recipient2WithBrackets = `<${recipient2}>`;

          const notification1 = mailcatcherResponse.body.find(email =>
            email.recipients.includes(recipient1WithBrackets)
          );
          const notification2 = mailcatcherResponse.body.find(email =>
            email.recipients.includes(recipient2WithBrackets)
          );

          // check that notifications *were* sent to recipients
          expect(notification1, `mail not sent to recipient1: ${recipient1}`)
            .not.to.be.undefined;
          expect(notification2, `mail not sent to recipient2: ${recipient2}`)
            .not.to.be.undefined;

          // check that notifications were *not* sent to GRT team
          expect(
            notification1.recipients.length,
            `notification for recipient1 sent to other recipients`
          ).to.equal(1);
          expect(
            notification2.recipients.length,
            `notification for recipient2 sent to other recipients`
          ).to.equal(1);
        });
      });

      it("Doesn't send emails when no recipients are specified", () => {
        createIntake();

        // use for uniquely identifying any emails for extending this LCID
        const scope = `scope-${uuidv4()}`;

        // issue LCID and extend it through GQL
        // TODO - EASI-2019 - go through UI instead of making GQL calls
        cy.get('@intakeId').then(intakeId => {
          cy.task('issueLCID', {
            euaId: euaIDFeatureFlagSet,
            intakeId,
            shouldSendEmail: false,
            recipientEmails: [],
            scope: 'scope',
            lcid: generateNewLCID()
          });

          cy.task('extendLCID', {
            euaId: euaIDFeatureFlagSet,
            intakeId,
            shouldSendEmail: true,
            recipientEmails: [],
            scope
          });
        });

        // check mailcatcher API for what emails have been sent
        cy.request(`${mailcatcherHost}/messages`).then(mailcatcherResponse => {
          expect(mailcatcherResponse.status).to.eq(200);

          const lcidExtensionEmails = mailcatcherResponse.body.filter(
            email => email.subject === extendLCIDEmailSubject
          );

          // make sure of all the notifications sent for extending LCIDs, none were sent for *this specific LCID* (indicated by scope)
          for (const email of lcidExtensionEmails) {
            cy.request(`${mailcatcherHost}/messages/${email.id}.html`).then(
              emailBodyResponse => {
                expect(emailBodyResponse.status).to.eq(200);
                expect(emailBodyResponse.body).not.to.include(scope);
              }
            );
          }
        });
      });
    });

    describe('Without feature flag for multiple notifications set', () => {
      // doesn't notify GRT, because the "extend" action doesn't take the Feedback field for the email body
      // see Slack thread: https://cmsgov.slack.com/archives/C0305U1014Y/p1655388030813539?thread_ts=1655386769.035379&cid=C0305U1014Y
      it('Notifies requester (but not GRT) when shouldSendEmail is selected', () => {
        createIntake();

        // set scope message based on UUID so we can uniquely identify message
        const scope = `scope-${uuidv4()}`;

        // issue LCID and extend it through GQL
        cy.get('@intakeId').then(intakeId => {
          cy.task('issueLCID', {
            euaId: euaIDFeatureFlagUnset,
            intakeId,
            shouldSendEmail: true,
            recipientEmails: [],
            scope: 'scope', // *don't* use UUID
            lcid: generateNewLCID()
          });

          cy.task('extendLCID', {
            euaId: euaIDFeatureFlagUnset,
            intakeId,
            shouldSendEmail: true,
            recipientEmails: [],
            scope
          });
        });

        // check mailcatcher API for what emails have been sent
        cy.request(`${mailcatcherHost}/messages`).then(mailcatcherResponse => {
          expect(mailcatcherResponse.status).to.eq(200);

          const lcidExtensionEmails = mailcatcherResponse.body.filter(
            email => email.subject === extendLCIDEmailSubject
          );

          // make sure a notification was sent for extending *this specific LCID*
          for (const email of lcidExtensionEmails) {
            cy.request(`${mailcatcherHost}/messages/${email.id}.html`).then(
              emailBodyResponse => {
                expect(emailBodyResponse.status).to.eq(200);
                if (emailBodyResponse.body.includes(scope)) {
                  const specificEmailMetadata = mailcatcherResponse.body.find(
                    emailMetadata => emailMetadata.id === email.id
                  );
                  cy.wrap(specificEmailMetadata).as('specificEmailMetadata');
                }
              }
            );
          }

          cy.get('@specificEmailMetadata').then(specificEmailMetadata => {
            expect(specificEmailMetadata).not.to.be.undefined;
            expect(specificEmailMetadata.recipients).to.have.length(1);
            expect(specificEmailMetadata.recipients).to.include(requesterEmail);
          });
        });
      });

      it("Doesn't send emails when shouldSendEmail isn't selected", () => {
        createIntake();

        // set scope message based on UUID so we can uniquely identify message
        const scope = `scope-${uuidv4()}`;

        // issue LCID and extend it through GQL
        cy.get('@intakeId').then(intakeId => {
          cy.task('issueLCID', {
            euaId: euaIDFeatureFlagUnset,
            intakeId,
            shouldSendEmail: false,
            recipientEmails: [],
            scope,
            lcid: generateNewLCID()
          });

          cy.task('extendLCID', {
            euaId: euaIDFeatureFlagUnset,
            intakeId,
            shouldSendEmail: false,
            recipientEmails: [],
            scope
          });
        });

        // check mailcatcher API for what emails have been sent
        cy.request(`${mailcatcherHost}/messages`).then(mailcatcherResponse => {
          expect(mailcatcherResponse.status).to.eq(200);

          const lcidExtensionEmails = mailcatcherResponse.body.filter(
            email => email.subject === extendLCIDEmailSubject
          );

          // make sure of all the notifications sent for extending LCIDs, none were sent for *this specific LCID* (indicated by scope)
          for (const email of lcidExtensionEmails) {
            cy.request(`${mailcatcherHost}/messages/${email.id}.html`).then(
              emailBodyResponse => {
                expect(emailBodyResponse.status).to.eq(200);
                expect(emailBodyResponse.body).not.to.include(scope);
              }
            );
          }
        });
      });
    });
  });
});
