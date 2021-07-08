import cmsGovernanceTeams from '../../src/constants/enums/cmsGovernanceTeams';

describe('The System Intake Form', () => {
  beforeEach(() => {
    cy.server();
    cy.localLogin({ name: 'TEST' });
    cy.route('PUT', '/api/v1/system_intake').as('putSystemIntake');
    cy.visit('/system/request-type');
    cy.get('#RequestType-NewSystem').check({ force: true });
    cy.contains('button', 'Continue').click();
    cy.contains('a', 'Get started').click();
    cy.wait(1000);
    cy.contains('a', 'Start').click();
    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/system\/.{36}\/contact-details/);
    });
    cy.contains('h1', 'Contact details');
  });

  it('fills out minimum required fields (smoke test)', () => {
    // Contact Details
    cy.systemIntake.contactDetails.fillNonBranchingFields();

    cy.get('#IntakeForm-HasIssoNo').check({ force: true }).should('be.checked');

    cy.get('#IntakeForm-NoGovernanceTeam')
      .check({ force: true })
      .should('be.checked');

    cy.contains('button', 'Next').click();

    cy.wait('@putSystemIntake');

    // Request Details
    cy.systemIntake.requestDetails.fillNonBranchingFields();

    cy.contains('button', 'Next').click();

    // Contract Details
    cy.get('#IntakeForm-CurrentStage')
      .select('Just an idea')
      .should('have.value', 'Just an idea');

    cy.get('#IntakeForm-HasFundingSourceNo')
      .check({ force: true })
      .should('be.checked');

    cy.get('#IntakeForm-CostsExpectingIncreaseNo')
      .check({ force: true })
      .should('be.checked');

    cy.get('#IntakeForm-ContractNotNeeded')
      .check({ force: true })
      .should('be.checked');

    cy.contains('button', 'Next').click();

    cy.wait('@putSystemIntake');
    cy.wait(1000);
    // Review
    cy.contains('h1', 'Check your answers before sending');

    cy.window()
      .its('store')
      .invoke('getState')
      .its('systemIntake')
      .its('systemIntake')
      .should('deep.include', {
        requestName: 'Test Request Name',
        requester: {
          name: 'User TEST',
          component: 'Center for Medicare',
          email: ''
        },
        businessOwner: {
          name: 'Casey Doe',
          component: 'Center for Medicare'
        },
        productManager: {
          name: 'Casey Doe',
          component: 'Center for Medicare'
        },
        isso: {
          isPresent: false,
          name: ''
        },
        governanceTeams: {
          isPresent: false,
          teams: []
        },
        fundingSource: {
          isFunded: false,
          fundingNumber: '',
          source: ''
        },
        costs: {
          isExpectingIncrease: 'NO',
          expectedIncreaseAmount: ''
        },
        contract: {
          hasContract: 'NOT_NEEDED',
          contractor: '',
          vehicle: '',
          startDate: {
            month: '',
            day: '',
            year: ''
          },
          endDate: {
            month: '',
            day: '',
            year: ''
          }
        },
        businessNeed: 'This is my business need.',
        businessSolution: 'This is my business solution.',
        currentStage: 'Just an idea',
        needsEaSupport: false
      });
  });

  it('displays and fills conditional fields', () => {
    // Contact Details
    cy.systemIntake.contactDetails.fillNonBranchingFields();

    cy.get('#IntakeForm-HasIssoYes')
      .check({ force: true })
      .should('be.checked');

    cy.get('#IntakeForm-IssoName')
      .type('Taylor Smith')
      .should('have.value', 'Taylor Smith');

    cy.get('#IntakeForm-YesGovernanceTeams')
      .check({ force: true })
      .should('be.checked');

    cmsGovernanceTeams.forEach(team => {
      cy.get(`#governanceTeam-${team.key}`)
        .check({ force: true })
        .should('be.checked');

      cy.get(`#IntakeForm-${team.key}-Collaborator`)
        .type(`${team.value} Collaborator`)
        .should('have.value', `${team.value} Collaborator`);
    });

    cy.contains('button', 'Next').click();

    cy.wait('@putSystemIntake');

    // Request Details
    cy.systemIntake.requestDetails.fillNonBranchingFields();

    cy.contains('button', 'Next').click();

    // Contract Details
    cy.get('#IntakeForm-CurrentStage')
      .select('Just an idea')
      .should('have.value', 'Just an idea');

    cy.get('#IntakeForm-HasFundingSourceYes')
      .check({ force: true })
      .should('be.checked');

    cy.get('#IntakeForm-FundingSource')
      .select('CLIA')
      .should('have.value', 'CLIA');

    cy.get('#IntakeForm-FundingNumber')
      .type('111111')
      .should('have.value', '111111');

    cy.get('#IntakeForm-CostsExpectingIncreaseYes')
      .check({ force: true })
      .should('be.checked');

    cy.get('#IntakeForm-CostsExpectedIncrease')
      .type('99999')
      .should('have.value', '99999');

    cy.get('#IntakeForm-ContractHaveContract')
      .check({ force: true })
      .should('be.checked');

    cy.get('#IntakeForm-Contractor')
      .type('TrussWorks, Inc.')
      .should('have.value', 'TrussWorks, Inc.');

    cy.get('#IntakeForm-Vehicle')
      .type('Fixed Price Contract')
      .should('have.value', 'Fixed Price Contract');

    cy.get('#IntakeForm-ContractStartMonth')
      .type('1')
      .should('have.value', '1');

    cy.get('#IntakeForm-ContractStartDay').type('2').should('have.value', '2');

    cy.get('#IntakeForm-ContractStartYear')
      .type('2020')
      .should('have.value', '2020');

    cy.get('#IntakeForm-ContractEndMonth')
      .type('12')
      .should('have.value', '12');

    cy.get('#IntakeForm-ContractEndDay').type('29').should('have.value', '29');

    cy.get('#IntakeForm-ContractEndYear')
      .type('2021')
      .should('have.value', '2021');

    cy.contains('button', 'Next').click();

    cy.wait('@putSystemIntake');

    // Review
    cy.contains('h1', 'Check your answers before sending');

    cy.contains('.easi-review-row dt', /^Requester$/)
      .siblings('dd')
      .contains('User TEST');

    cy.contains('.easi-review-row dt', 'Requester Component')
      .siblings('dd')
      .contains('Center for Medicare');

    cy.contains('.easi-review-row dt', "CMS Business Owner's Name")
      .siblings('dd')
      .contains('Casey Doe');

    cy.contains('.easi-review-row dt', 'CMS Business Owner Component')
      .siblings('dd')
      .contains('Center for Medicare');

    cy.contains('.easi-review-row dt', 'CMS Project/Product Manager or lead')
      .siblings('dd')
      .contains('Casey Doe');

    cy.contains(
      '.easi-review-row dt',
      'CMS Project/Product manager or lead Component'
    )
      .siblings('dd')
      .contains('Center for Medicare');

    cy.contains(
      '.easi-review-row dt',
      'Does your project have an Information System Security Officer (ISSO)?'
    )
      .siblings('dd')
      .contains('Yes, Taylor Smith');

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

    cy.contains('.easi-review-row dt', 'Where are you in the process?')
      .siblings('dd')
      .contains('Just an idea');

    cy.contains('.easi-review-row dt', 'Does the project have funding')
      .siblings('dd')
      .contains('Yes, CLIA, 111111');
  });

  it('displays contact details error messages', () => {
    cy.contains('button', 'Next').click();

    cy.get('[data-testid="system-intake-errors"]');
  });

  it('displays request details error messages', () => {
    cy.systemIntake.contactDetails.fillNonBranchingFields();

    cy.get('#IntakeForm-HasIssoNo').check({ force: true }).should('be.checked');

    cy.get('#IntakeForm-NoGovernanceTeam')
      .check({ force: true })
      .should('be.checked');

    cy.contains('button', 'Next').click();

    cy.contains('h1', 'Request details');

    cy.contains('button', 'Next').click();

    cy.get('[data-testid="system-intake-errors"]');
  });

  it('saves on back click', () => {
    cy.systemIntake.contactDetails.fillNonBranchingFields();
    cy.get('#IntakeForm-HasIssoNo').check({ force: true }).should('be.checked');

    cy.get('#IntakeForm-NoGovernanceTeam')
      .check({ force: true })
      .should('be.checked');

    cy.contains('button', 'Next').click();
    cy.wait('@putSystemIntake');

    cy.contains('h1', 'Request details');

    cy.get('#IntakeForm-RequestName')
      .type('Test Request Name')
      .should('have.value', 'Test Request Name');

    cy.contains('button', 'Back').click();
    cy.wait('@putSystemIntake');
  });
});

describe('users who got lost', () => {
  it('redirects to the system type page if somebody managed to skip it', () => {
    cy.server();
    cy.localLogin({ name: 'TEST' });
    cy.visit('/system/new');
    cy.location().should(loc => {
      expect(loc.pathname).to.equal('/system/request-type');
    });
  });
});

describe('office user', () => {
  it.only('can assign Admin Lead', () => {
    cy.localLogin({ name: 'OFFI', role: 'EASI_D_GOVTEAM' });
    cy.visit(
      'governance-review-team/af7a3924-3ff7-48ec-8a54-b8b4bc95610b/intake-request'
    );
    cy.get('[data-testid="adminLead"]').contains('Not assigned');
    cy.contains('button', 'Change').click();
    cy.get('input[value="Ann Rudolph"]').check({ force: true });
    cy.get('[data-testid="button"]').contains('Save').click();
    cy.get('dd[data-testid="adminLead"]').contains('Ann Rudolph');
  });
});
