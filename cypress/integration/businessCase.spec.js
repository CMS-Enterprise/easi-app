describe('The Business Case Form', () => {
  let intakeId;
  const systemIntake = {
    status: 'NEED_BIZ_CASE',
    requestType: 'NEW',
    requester: 'John Requester',
    component: 'Center for Consumer Information and Insurance Oversight',
    businessOwner: 'John BusinessOwner',
    businessOwnerComponent:
      'Center for Consumer Information and Insurance Oversight',
    productManager: 'John ProductManager',
    productManagerComponent:
      'Center for Consumer Information and Insurance Oversight',
    isso: '',
    trbCollaborator: '',
    oitSecurityCollaborator: '',
    eaCollaborator: '',
    projectName: 'Easy Access to System Information',
    existingFunding: false,
    fundingNumber: '',
    businessNeed: 'Business Need: The quick brown fox jumps over the lazy dog.',
    solution: 'The quick brown fox jumps over the lazy dog.',
    processStatus: 'The project is already funded',
    eaSupportRequest: false,
    existingContract: 'No',
    grtReviewEmailBody: ''
  };
  before(() => {
    cy.login();
    cy.wait(1000);
    cy.saveLocalStorage().then(() => {
      cy.getAccessToken().then(accessToken => {
        cy.request({
          method: 'POST',
          url: Cypress.env('systemIntakeApi'),
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          body: systemIntake
        }).then(response => {
          intakeId = response.body.id;
        });
      });
    });
  });

  beforeEach(() => {
    cy.restoreLocalStorage();

    cy.visit(`/governance-task-list/${intakeId}`);
    cy.get('[data-testid="start-biz-case-btn"]').click();
  });

  it('fills out all business case fields', () => {
    // General Request Information
    // Autofilled Fields from System Intake
    cy.get('#BusinessCase-RequestName').should(
      'have.value',
      systemIntake.projectName
    );

    cy.get('#BusinessCase-RequesterName').should(
      'have.value',
      systemIntake.requester
    );

    cy.get('#BusinessCase-BusinessOwnerName').should(
      'have.value',
      systemIntake.businessOwner
    );

    cy.get('#BusinessCase-RequesterPhoneNumber')
      .type('1234567890')
      .should('have.value', '1234567890');

    cy.contains('button', 'Next').click();

    // Request Description
    // Autofilled Field from System Intake
    cy.get('#BusinessCase-BusinessNeed').should(
      'have.value',
      systemIntake.businessNeed
    );

    cy.get('#BusinessCase-CmsBenefit')
      .type('CMS Benefit: The quick brown fox jumps over the lazy dog.')
      .should(
        'have.value',
        'CMS Benefit: The quick brown fox jumps over the lazy dog.'
      );

    cy.get('#BusinessCase-PriorityAlignment')
      .type('Priority Alignment: The quick brown fox jumps over the lazy dog.')
      .should(
        'have.value',
        'Priority Alignment: The quick brown fox jumps over the lazy dog.'
      );

    cy.get('#BusinessCase-SuccessIndicators')
      .type('Success Indicators: The quick brown fox jumps over the lazy dog.')
      .should(
        'have.value',
        'Success Indicators: The quick brown fox jumps over the lazy dog.'
      );

    cy.contains('button', 'Next').click();

    cy.businessCase.asIsSolution.fillNonBranchingFields();

    cy.contains('button', 'Next').click();

    cy.businessCase.preferredSolution.fillAllFields();

    cy.contains('button', 'Next').click();

    cy.businessCase.alternativeASolution.fillAllFields();

    cy.contains('button', 'Next').click();

    cy.get('h1').contains('Check your answers before sending');
    cy.window()
      .its('store')
      .invoke('getState')
      .its('businessCase')
      .its('form')
      .should('deep.include', {
        requestName: 'Easy Access to System Information',
        requester: {
          name: 'John Requester',
          phoneNumber: '1234567890'
        },
        businessOwner: {
          name: 'John BusinessOwner'
        },
        businessNeed:
          'Business Need: The quick brown fox jumps over the lazy dog.',
        cmsBenefit: 'CMS Benefit: The quick brown fox jumps over the lazy dog.',
        priorityAlignment:
          'Priority Alignment: The quick brown fox jumps over the lazy dog.',
        successIndicators:
          'Success Indicators: The quick brown fox jumps over the lazy dog.',
        asIsSolution: {
          title: 'Test As is Solution',
          summary: 'As is Solution Summary',
          pros: 'As is Solution Pros',
          cons: 'As is Solution Cons',
          estimatedLifecycleCost: {
            year1: [{ phase: 'Development', cost: '0' }],
            year2: [{ phase: 'Development', cost: '0' }],
            year3: [{ phase: 'Development', cost: '0' }],
            year4: [{ phase: 'Operations and Maintenance', cost: '0' }],
            year5: [{ phase: 'Operations and Maintenance', cost: '0' }]
          },
          costSavings: 'As is Solution Cost Savings'
        },
        preferredSolution: {
          title: 'Preferred Solution Title',
          summary: 'Preferred Solution Summary',
          acquisitionApproach: 'Preferred Solution Acquisition approach',
          security: {
            isApproved: false,
            isBeingReviewed: 'YES'
          },
          hosting: {
            cloudServiceType: 'Saas',
            location: 'AWS',
            type: 'cloud'
          },
          hasUserInterface: 'YES',
          pros: 'Preferred Solution Pros',
          cons: 'Preferred Solution Cons',
          estimatedLifecycleCost: {
            year1: [{ phase: 'Development', cost: '0' }],
            year2: [{ phase: 'Development', cost: '0' }],
            year3: [{ phase: 'Development', cost: '0' }],
            year4: [{ phase: 'Operations and Maintenance', cost: '0' }],
            year5: [{ phase: 'Operations and Maintenance', cost: '0' }]
          },
          costSavings: '0'
        },
        alternativeA: {
          title: 'Alternative A Title',
          summary: 'Alternative A Summary',
          acquisitionApproach: 'Alternative A AcquisitionApproach',
          security: {
            isApproved: false,
            isBeingReviewed: 'YES'
          },
          hosting: {
            cloudServiceType: 'Saas',
            location: 'AWS',
            type: 'cloud'
          },
          hasUserInterface: 'YES',
          pros: 'Alternative A Pros',
          cons: 'Alternative A Cons',
          estimatedLifecycleCost: {
            year1: [{ phase: 'Development', cost: '0' }],
            year2: [{ phase: 'Development', cost: '0' }],
            year3: [{ phase: 'Development', cost: '0' }],
            year4: [{ phase: 'Operations and Maintenance', cost: '0' }],
            year5: [{ phase: 'Operations and Maintenance', cost: '0' }]
          },
          costSavings: 'Alternative A Cost Savings'
        }
      });
  });
});
