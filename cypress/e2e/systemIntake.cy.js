import cmsGovernanceTeams from '../../src/constants/enums/cmsGovernanceTeams';
import { BASIC_USER_PROD } from '../../src/constants/jobCodes';

describe('The System Intake Form', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'E2E1', role: BASIC_USER_PROD });

    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'UpdateSystemIntakeRequestDetails') {
        req.alias = 'updateRequestDetails';
      }

      if (req.body.operationName === 'GetSystemIntakeContactsQuery') {
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
    cy.get('#RequestType-NewSystem').check({ force: true });
    cy.contains('button', 'Continue').click();
    cy.contains('a', 'Get started').click();
    cy.wait(1000);

    cy.get('#relationType-newSystem').check({ force: true });
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
    // Contact Details
    cy.systemIntake.contactDetails.fillNonBranchingFields();

    // Test "Business owner same as requester" checkbox
    cy.get('#businessOwnerSameAsRequester')
      .check({ force: true })
      .should('be.checked');

    // Business Owner name should be disabled when checkbox is checked
    cy.get('#react-select-businessOwnerCommonName-input').should('be.disabled');

    // Check that business owner fields updated to display requester values
    cy.get('#react-select-businessOwnerCommonName-input').should(
      'have.value',
      // Requester name shows as User E2E1 instead of "EndToEnd One" (their actual name) during testing
      'User E2E1, E2E1 (endtoend.one@local.fake)'
    );
    cy.get('#businessOwnerEmail').should(
      'have.value',
      'endtoend.one@local.fake'
    );
    cy.get('#businessOwnerComponent').should(
      'have.value',
      'Center for Medicare'
    );

    cy.get('#issoIsPresentFalse').check({ force: true }).should('be.checked');

    cy.get('#governanceTeamsIsPresentFalse')
      .check({ force: true })
      .should('be.checked');

    cy.contains('button', 'Next').click();

    cy.wait('@updateContactDetails');

    // Request Details
    cy.systemIntake.requestDetails.fillNonBranchingFields();

    cy.get('#currentStage')
      .select('Just an idea')
      .should('have.value', 'Just an idea');

    cy.contains('button', 'Next').click();

    // Contract Details
    cy.get('#currentAnnualSpending')
      .type('Mock Current Annual Spend')
      .should('have.value', 'Mock Current Annual Spend');

    cy.get('#currentAnnualSpendingITPortion')
      .type('Mock Current Annual Spend IT Portion')
      .should('have.value', 'Mock Current Annual Spend IT Portion');

    cy.get('#plannedYearOneSpending')
      .type('Mock Planned First Year Annual Spend')
      .should('have.value', 'Mock Planned First Year Annual Spend');

    cy.get('#plannedYearOneSpendingITPortion')
      .type('Mock Planned First Year Annual Spend IT Portion')
      .should('have.value', 'Mock Planned First Year Annual Spend IT Portion');

    cy.get('#contractNotNeeded').check({ force: true }).should('be.checked');

    cy.contains('button', 'Next').click();

    cy.contains('button', 'Continue without documents').click();

    // Review
    cy.contains('h1', 'Check your answers before sending');

    // Submit
    cy.contains('button', 'Send my intake request').click();
    cy.contains('h1', 'Your Intake Request has been submitted');
  });

  it('displays and fills conditional fields', () => {
    // Contact Details
    cy.systemIntake.contactDetails.fillNonBranchingFields();

    // Test "same as requester" checkbox

    // ISSO
    cy.get('#issoIsPresentTrue').check({ force: true }).should('be.checked');

    cy.get('#react-select-issoCommonName-input')
      .type('Rudolph')
      .wait(2000)
      .type('{downArrow}{enter}')
      .should('have.value', 'Rudolph Pagac, POJG (rudolph.pagac@local.fake)');

    cy.get('#issoComponent')
      .select('Center for Program Integrity')
      .should('have.value', 'Center for Program Integrity');

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

    // Request Details
    cy.systemIntake.requestDetails.fillNonBranchingFields();

    cy.get('#currentStage')
      .select('Just an idea')
      .should('have.value', 'Just an idea');

    cy.contains('button', 'Next').click();

    // Contract Details
    const fundingNumber = '123456';

    cy.systemIntake.contractDetails.addFundingSource({
      fundingNumber,
      sources: ['Fed Admin', 'Research'],
      restart: true
    });
    cy.get(`#fundingSource${fundingNumber}`);

    cy.get('#currentAnnualSpending')
      .type('Mock Current Annual Spend')
      .should('have.value', 'Mock Current Annual Spend');

    cy.get('#currentAnnualSpendingITPortion')
      .type('Mock Current Annual Spend IT Portion')
      .should('have.value', 'Mock Current Annual Spend IT Portion');

    cy.get('#plannedYearOneSpending')
      .type('Mock Planned First Year Annual Spend')
      .should('have.value', 'Mock Planned First Year Annual Spend');

    cy.get('#plannedYearOneSpendingITPortion')
      .type('Mock Planned First Year Annual Spend IT Portion')
      .should('have.value', 'Mock Planned First Year Annual Spend IT Portion');

    cy.get('#contractHaveContract').check({ force: true }).should('be.checked');

    cy.get('#contractor')
      .type('TrussWorks, Inc.')
      .should('have.value', 'TrussWorks, Inc.');

    cy.get('#contractNumbers')
      .type('123456-7890')
      .should('have.value', '123456-7890');

    cy.get('#contractStartMonth').type('1').should('have.value', '1');

    cy.get('#contractStartDay').type('2').should('have.value', '2');

    cy.get('#contractStartYear').type('2020').should('have.value', '2020');

    cy.get('#contractEndMonth').type('12').should('have.value', '12');

    cy.get('#contractEndDay').type('29').should('have.value', '29');

    cy.get('#contractEndYear').type('2021').should('have.value', '2021');

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
    cy.contains('h3', 'Confirm you want to remove test.pdf.');
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

    cy.contains('.easi-review-row dt', /^Requester$/)
      .siblings('dd')
      .contains('EndToEnd One');

    cy.contains('.easi-review-row dt', 'Requester Component')
      .siblings('dd')
      .contains('Center for Medicare');

    cy.contains('.easi-review-row dt', "CMS Business Owner's Name")
      .siblings('dd')
      .contains('Audrey Abrams');

    cy.contains('.easi-review-row dt', 'CMS Business Owner Component')
      .siblings('dd')
      .contains('CMS Wide');

    cy.contains('.easi-review-row dt', 'CMS Project/Product Manager or lead')
      .siblings('dd')
      .contains('Delphia Green');

    cy.contains(
      '.easi-review-row dt',
      'CMS Project/Product manager or lead Component'
    )
      .siblings('dd')
      .contains('Office of Legislation');

    cy.contains(
      '.easi-review-row dt',
      'Does your project have an Information System Security Officer (ISSO)?'
    )
      .siblings('dd')
      .contains('Yes, Rudolph Pagac');

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
      .contains(
        /^Enterprise Architecture, Enterprise Architecture Collaborator$/
      );

    cy.contains('.easi-review-row dt', 'Project Name')
      .siblings('dd')
      .contains('Test Request Name');

    cy.contains('dt', 'What is your business need?')
      .siblings('dd')
      .contains('This is my business need.');

    cy.contains('dt', 'How are you thinking of solving it?')
      .siblings('dd')
      .contains('This is my business solution');

    cy.contains(
      '.easi-review-row dt',
      'Do you need Enterprise Architecture (EA) support?'
    )
      .siblings('dd')
      .contains('No');

    cy.contains(
      '.easi-review-row dt',
      'Does your project involve any user interface component, or changes to an interface component?'
    )
      .siblings('dd')
      .contains('No');

    cy.contains('.easi-review-row dt', 'Where are you in the process?')
      .siblings('dd')
      .contains('Just an idea');

    cy.contains(
      '.easi-review-row dt',
      'Which existing funding sources will fund this project?'
    )
      .siblings('dd')
      .get(`li#fundingSource${fundingNumber}`);

    cy.get('#systemIntakeDocuments').contains('td', 'test.pdf');
  });

  it('saves on back click', () => {
    cy.systemIntake.contactDetails.fillNonBranchingFields();
    cy.get('#issoIsPresentFalse').check({ force: true }).should('be.checked');

    cy.get('#governanceTeamsIsPresentFalse')
      .check({ force: true })
      .should('be.checked');

    cy.contains('button', 'Next').click();
    cy.wait('@updateContactDetails');

    cy.contains('h1', 'Request details');

    cy.get('#requestName')
      .type('Test Request Name')
      .should('have.value', 'Test Request Name');

    cy.contains('button', 'Back').click();
    cy.wait('@updateRequestDetails');
  });
});
