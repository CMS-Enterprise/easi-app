describe('The Business Case Form', () => {
  let intakeId;
  const systemIntake = {
    status: 'SUBMITTED',
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
    fundingSource: '',
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
    cy.saveLocalStorage();
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

  beforeEach(() => {
    cy.restoreLocalStorage();

    cy.visit('/');
    cy.get(`[data-intakeid="${intakeId}"]`)
      .get('button')
      .contains('Start my Business Case')
      .click();
  });

  it('fills out minimum required fields', () => {
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

    cy.businessCase.preferredSolution.fillNonBranchingFields();

    cy.contains('button', 'Next').click();

    cy.businessCase.alternativeASolution.fillNonBranchingFields();

    cy.contains('button', 'Next').click();

    cy.get('h1').contains('Check your answers before sending');
  });
});
