import cmsGovernanceTeams from '../../src/constants/enums/cmsGovernanceTeams';
import SystemIntakeSoftwareAcquisitionMethods from '../../src/constants/enums/SystemIntakeSoftwareAcquisitionMethods';
import { BASIC_USER_PROD } from '../../src/constants/jobCodes';
import testSystemIntakeName from '../support/systemIntake';

describe('The System Intake Form', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'E2E1', role: BASIC_USER_PROD });

    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'UpdateSystemIntakeRequestDetails') {
        req.alias = 'updateRequestDetails';
      }

      if (req.body.operationName === 'GetSystemIntakeContacts') {
        req.alias = 'getSystemIntakeContacts';
      }

      if (req.body.operationName === 'CreateSystemIntakeContact') {
        req.alias = 'createContact';
      }

      if (req.body.operationName === 'UpdateSystemIntakeContactDetails') {
        req.alias = 'updateContactDetails';
      }

      if (req.body.operationName === 'UpdateSystemIntakeContractDetails') {
        req.alias = 'updateContractDetails';
      }
    });

    cy.visit('/system/request-type');
    cy.get('[data-testid="start-button--new"]').click();
    cy.contains('a', 'Continue').click();
    cy.wait(1000);

    cy.contains(
      'label',
      'or, check this box if this project does not support or use any existing CMS systems'
    ).click();
    cy.contains('button', 'Continue to task list').click();

    cy.get('li[data-testid="fill-out-the-intake-request-form"]')
      .contains('button', 'Start')
      .click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/system\/.{36}\/contact-details/);
    });

    // Wait for contacts query to complete
    cy.wait('@getSystemIntakeContacts')
      .its('response.statusCode')
      .should('eq', 200);

    cy.contains('h1', 'Contact details');
  });

  it('fills out minimum required fields (smoke test)', () => {
    // Contact details
    cy.systemIntake.contactDetails.fillNonBranchingFields();

    // Test "Business Owner same as requester" checkbox
    cy.get('#businessOwnerSameAsRequester')
      .check({ force: true })
      .should('be.checked');

    // Business Owner name should be disabled when checkbox is checked
    cy.get('#react-select-businessOwnerCommonName-input').should('be.disabled');

    // Check that Business Owner fields updated to display requester values
    cy.get('#react-select-businessOwnerCommonName-input').should(
      'have.value',
      // Requester name shows as User E2E1 instead of "EndToEnd One" (their actual name) during testing
      'User E2E1, E2E1 (endtoend.one@local.fake)'
    );

    cy.get('#businessOwnerComponent').should(
      'have.value',
      'Center for Medicare'
    );

    cy.get('#governanceTeamsIsPresentFalse')
      .check({ force: true })
      .should('be.checked');

    cy.contains('button', 'Next').click();

    cy.wait('@updateContactDetails');

    // Request details
    cy.systemIntake.requestDetails.fillNonBranchingFields();

    cy.get('#currentStage').select('Other').should('have.value', 'Other');

    cy.contains('button', 'Next').click();

    // Contract details
    cy.systemIntake.contractDetails.addFundingSource({
      projectNumber: '123456',
      investments: ['Fed Admin', 'Research'],
      restart: true
    });

    cy.get('#currentAnnualSpending')
      .type('123456')
      .should('have.value', '123456');

    cy.get('#currentAnnualSpendingITPortion')
      .type('23')
      .should('have.value', '23');

    cy.get('#plannedYearOneSpending')
      .type('654321')
      .should('have.value', '654321');

    cy.get('#plannedYearOneSpendingITPortion')
      .type('99')
      .should('have.value', '99');

    cy.get('#contractNotNeeded').check({ force: true }).should('be.checked');

    cy.contains('button', 'Next').click();

    cy.contains('button', 'Continue without documents').click();

    // Review
    cy.contains('h1', 'Check your answers before sending');

    // Submit
    cy.contains('button', 'Send my Intake Request').click();
    cy.contains('h1', 'Success!');
  });

  it.only('displays and fills conditional fields', () => {
    // Contact details
    cy.systemIntake.contactDetails.fillNonBranchingFields();

    // Test "same as requester" checkbox

    // Add additional contact
    cy.contains('button', 'Add another contact').click();

    cy.get('#react-select-IntakeForm-ContactCommonName-input')
      .type('Annetta Lockman')
      .wait(2000)
      .type('{downArrow}{enter}')
      .should(
        'have.value',
        'Annetta Lockman, LW40 (annetta.lockman@local.fake)'
      );

    cy.get('#IntakeForm-ContactComponent')
      .select('Other')
      .should('have.value', 'Other');

    cy.get('#IntakeForm-ContactRole')
      .select('Product Owner')
      .should('have.value', 'Product Owner');

    cy.contains('button', 'Add contact').click(1000);

    cy.contains('p', 'Annetta Lockman, Other');

    // Governance teams
    cy.get('#governanceTeamsIsPresentTrue')
      .check({ force: true })
      .should('be.checked');

    cmsGovernanceTeams.forEach(team => {
      cy.get(`#governanceTeam-${team.key}`)
        .check({ force: true })
        .should('be.checked');

      cy.get(`#governanceTeam-${team.key}-collaborator`)
        .type(`${team.name} Collaborator`)
        .should('have.value', `${team.name} Collaborator`);
    });

    cy.contains('button', 'Next').click();

    cy.wait('@updateContactDetails');

    // Request details
    cy.systemIntake.requestDetails.fillNonBranchingFields();

    cy.get('#currentStage').select('Other').should('have.value', 'Other');

    cy.get('#usingSoftwareYes').check({ force: true }).should('be.checked');

    Object.values(SystemIntakeSoftwareAcquisitionMethods).forEach(acqMethod => {
      cy.get(`#software-acquisition-${acqMethod}`)
        .check({ force: true })
        .should('be.checked');
    });

    cy.contains('button', 'Next').click();

    // Contract details
    const projectNumber = '123456';

    cy.systemIntake.contractDetails.addFundingSource({
      projectNumber,
      investments: ['Fed Admin', 'Research'],
      restart: true
    });
    cy.get(`[data-testid="fundingSource${projectNumber}"]`);

    cy.get('#currentAnnualSpending')
      .type('123456')
      .should('have.value', '123456');

    cy.get('#currentAnnualSpendingITPortion')
      .type('23')
      .should('have.value', '23');

    cy.get('#plannedYearOneSpending')
      .type('654321')
      .should('have.value', '654321');

    cy.get('#plannedYearOneSpendingITPortion')
      .type('99')
      .should('have.value', '99');

    cy.get('#contractHaveContract').check({ force: true }).should('be.checked');

    cy.get('#contractor')
      .type('TrussWorks, Inc.')
      .should('have.value', 'TrussWorks, Inc.');

    cy.get('#contractNumbers')
      .type('123456-7890')
      .should('have.value', '123456-7890');

    cy.getDateString({ months: 1 }).then(startDate => {
      cy.get('#contractStartDate').type(startDate);
    });

    cy.getDateString({ months: 2 }).then(endDate => {
      cy.get('#contractEndDate').type(endDate);
    });

    cy.contains('button', 'Next').click();

    cy.wait('@updateContractDetails');

    // Document Upload

    cy.contains('h1', 'Additional documentation');

    cy.contains('button', 'Add a document').click();

    cy.contains('h1', 'Upload a document');
    cy.get('input[name=fileData]').selectFile('cypress/fixtures/test.pdf');
    cy.get('#documentType-SOO_SOW').check({ force: true });
    cy.get('#version-HISTORICAL').check({ force: true });
    cy.contains('button', 'Upload document').click();

    cy.contains(
      '.usa-alert__text',
      'Your document has been uploaded and is being scanned.'
    ).should('be.visible');
    cy.contains('td', 'test.pdf').should('be.visible');
    cy.contains('td', 'Virus scan in progress...').should('be.visible');

    // Upload second document using other type fields
    cy.contains('button', 'Add another document').click();

    cy.contains('h1', 'Upload a document');
    cy.get('input[name=fileData]').selectFile('cypress/fixtures/test.pdf');
    cy.get('#documentType-OTHER').check({ force: true });
    cy.get('#version-CURRENT').check({ force: true });
    cy.get('#otherTypeDescription')
      .type('Test document')
      .should('have.value', 'Test document');
    cy.contains('button', 'Upload document').click();

    cy.contains('td', 'Test document').should('be.visible');

    // Mark first document as passing virus scan
    cy.get('[data-testurl]')
      .first()
      .within(el => {
        const url = el.attr('data-testurl');
        const filepath = url.match(/(\/easi-app-file-uploads\/[^?]*)/)[1];
        cy.exec(`scripts/tag_minio_file ${filepath} CLEAN`);
      });

    cy.reload();

    // Delete first document
    cy.contains('button', 'Remove').click();
    cy.contains('h3', 'Remove test.pdf?');
    cy.contains('button', 'Remove document').click();

    cy.contains(
      '.usa-alert__text',
      'You have successfully removed test.pdf'
    ).should('be.visible');
    cy.get('#systemIntakeDocuments')
      .contains('td', 'test.pdf')
      .should('have.length', 1);

    cy.contains('button', 'Next').click();

    // Review
    cy.contains('h1', 'Check your answers before sending');

    cy.contains('.easi-review-row dt', /^Requester name$/)
      .siblings('dd')
      .contains('EndToEnd One');

    cy.contains('.easi-review-row dt', 'Requester component')
      .siblings('dd')
      .contains('Center for Medicare');

    cy.contains('.easi-review-row dt', 'CMS Business Owner')
      .siblings('dd')
      .contains('Audrey Abrams');

    cy.contains('.easi-review-row dt', 'CMS Business Owner component')
      .siblings('dd')
      .contains('CMS Wide');

    cy.contains('.easi-review-row dt', 'CMS Project/Product Manager or Lead')
      .siblings('dd')
      .contains('Delphia Green');

    cy.contains(
      '.easi-review-row dt',
      'CMS Project/Product Manager or Lead component'
    )
      .siblings('dd')
      .contains('Office of Legislation');

    cy.contains('.easi-review-row dt', 'I have started collaborating with')
      .siblings('dd')
      .eq(0)
      .contains(
        /^Technical Review Board, Technical Review Board Collaborator$/
      );

    cy.contains('.easi-review-row dt', 'I have started collaborating with')
      .siblings('dd')
      .eq(1)
      .contains(
        /^OIT's Security and Privacy Group, OIT's Security and Privacy Group Collaborator$/
      );

    cy.contains('.easi-review-row dt', 'I have started collaborating with')
      .siblings('dd')
      .eq(2)
      .contains(/^508 Clearance Officer, 508 Clearance Officer Collaborator$/);

    cy.contains('.easi-review-row dt', 'Contract/request title')
      .siblings('dd')
      .contains(testSystemIntakeName);

    cy.contains(
      'dt',
      'What is your business need that this contract/request will meet?'
    )
      .siblings('dd')
      .contains('This is my business need.');

    cy.contains('dt', 'How are you thinking of solving it?')
      .siblings('dd')
      .contains('This is my business solution');

    cy.contains(
      '.easi-review-row dt',
      'Does your request need Enterprise Architecture support?'
    )
      .siblings('dd')
      .contains('No');

    cy.contains(
      '.easi-review-row dt',
      'Does this project plan to use AI technologies?'
    )
      .siblings('dd')
      .contains('Yes');

    cy.contains(
      '.easi-review-row dt',
      'Does your project involve any user interface component or changes to an interface component?'
    )
      .siblings('dd')
      .contains('No');

    cy.contains(
      '.easi-review-row dt',
      'Do you plan to use software products to fulfill your business needs?'
    )
      .siblings('dd')
      .contains('Yes');

    cy.contains('.easi-review-row dt', 'What is your project status?')
      .siblings('dd')
      .contains('Other');

    cy.contains(
      '.easi-review-row dt',
      'Which existing funding sources will fund this project?'
    )
      .siblings('dd')
      .get(`[data-testid="fundingSource${projectNumber}"]`);

    cy.get('#systemIntakeDocuments').contains('td', 'test.pdf');
  });

  it('saves on back click', () => {
    cy.systemIntake.contactDetails.fillNonBranchingFields();

    cy.get('#governanceTeamsIsPresentFalse')
      .check({ force: true })
      .should('be.checked');

    cy.contains('button', 'Next').click();
    cy.wait('@updateContactDetails');

    cy.contains('h1', 'Request details');

    cy.get('#requestName')
      .type(testSystemIntakeName)
      .should('have.value', testSystemIntakeName);

    cy.contains('button', 'Back').click();
    cy.wait('@updateRequestDetails');
  });

  it('archives a system intake', () => {
    cy.visit('/system/making-a-request');

    cy.contains('a', 'Start a new request').click();

    cy.get('[data-testid="start-button--new"]').click();

    cy.contains('a', 'Continue').click();

    cy.visit('/');

    cy.contains('a', 'Draft').click();

    cy.contains('button', 'Remove your request').click();

    cy.contains('button', 'Remove request').click();

    cy.url().should('eq', 'http://localhost:3000/');
  });
});
