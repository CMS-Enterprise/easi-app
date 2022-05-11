/// <reference types="cypress" />
import { v4 as uuidv4 } from 'uuid';

describe('Email notifications', () => {
  describe('Issuing lifecycle IDs', () => {
    beforeEach(() => {
      // create system intake through UI
      cy.localLogin({ name: 'SWKJ' });

      cy.intercept('POST', '/api/graph/query', req => {
        if (req.body.operationName === 'UpdateSystemIntakeRequestDetails') {
          req.alias = 'updateRequestDetails';
        }

        if (req.body.operationName === 'UpdateSystemIntakeContactDetails') {
          req.alias = 'updateContactDetails';
        }

        if (req.body.operationName === 'UpdateSystemIntakeContractDetails') {
          req.alias = 'updateContractDetails';
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
        // eslint-disable-next-line no-unused-expressions
        expect(match).to.not.be.null;
        const intakeId = match[0];
        cy.wrap(intakeId).as('intakeId');
      });
    });

    describe('With feature flag set to allow multiple notifications', () => {
      it("Sends multiple emails to multiple recipients, without CC'ing GRT team", () => {
        // include UUIDs in recipient emails so they can be uniquely identified later
        const recipient1 = `abcd${uuidv4()}@local.fake`;
        const recipient2 = `efgh${uuidv4()}@local.fake`;

        // issue LCID through GQL
        cy.get('@intakeId').then(intakeId => {
          cy.task('issueLCID', {
            intakeId,
            recipientEmails: [recipient1, recipient2]
          });
        });

        // check mailcatcher API for what emails have been sent
        cy.request('http://localhost:1080/messages').then(
          mailcatcherResponse => {
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

            // eslint-disable-next-line no-unused-expressions
            expect(notification1, `mail not sent to recipient1: ${recipient1}`)
              .not.to.be.undefined;

            // eslint-disable-next-line no-unused-expressions
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
          }
        );
      });
    });
  });
});
