import cmsGovernanceTeams from '../../src/constants/enums/cmsGovernanceTeams';

describe('The System Intake Form', () => {
  before(() => {
    // TODO: We shouldn't be logging in for every test suite.
    // We should find a way to login programmatically.
    cy.visit('/login');

    cy.get('#okta-signin-username').type(Cypress.env('username'));
    cy.get('#okta-signin-password').type(Cypress.env('password'));
    cy.get('#okta-signin-submit').click();
    cy.task('generateOTP', Cypress.env('otpSecret')).then(token => {
      cy.get('input[type="tel"]').type(token);
    });
    cy.get('input[type="submit"').click();
    cy.location('pathname', { timeout: 20000 }).should('equal', '/');
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.visit('/system/new');
  });

  it('fills out minimum required fields (smoke test)', () => {
    // Contact Details
    cy.get('#IntakeForm-Requester')
      .type('Casey Doe')
      .should('have.value', 'Casey Doe');

    cy.get('#IntakeForm-RequesterComponent')
      .select('Center for Medicare')
      .should('have.value', 'Center for Medicare');

    cy.get('#IntakeForm-BusinessOwner')
      .type('Casey Doe')
      .should('have.value', 'Casey Doe');

    cy.get('#IntakeForm-BusinessOwnerComponent')
      .select('Center for Medicare')
      .should('have.value', 'Center for Medicare');

    cy.get('#IntakeForm-ProductManager')
      .type('Casey Doe')
      .should('have.value', 'Casey Doe');

    cy.get('#IntakeForm-ProductManagerComponent')
      .select('Center for Medicare')
      .should('have.value', 'Center for Medicare');

    cy.get('#IntakeForm-HasIssoNo')
      .check({ force: true })
      .should('be.checked');

    cy.get('#IntakeForm-NoGovernanceTeam')
      .check({ force: true })
      .should('be.checked');

    cy.get('button')
      .contains('Next')
      .click();

    // Request Details
    cy.get('#IntakeForm-RequestName')
      .type('Test Request Name')
      .should('have.value', 'Test Request Name');

    cy.get('#IntakeForm-BusinessNeed')
      .type('This is my business need.')
      .should('have.value', 'This is my business need.');

    cy.get('#IntakeForm-BusinessSolution')
      .type('This is my business solution.')
      .should('have.value', 'This is my business solution.');

    cy.get('#IntakeForm-NeedsEaSupportNo')
      .check({ force: true })
      .should('be.checked');

    cy.get('#IntakeForm-CurrentStage')
      .select('Just an idea')
      .should('have.value', 'Just an idea');

    cy.get('#IntakeForm-HasContract')
      .select('No')
      .should('have.value', 'No');

    cy.get('#IntakeForm-HasFundingSourceNo')
      .check({ force: true })
      .should('be.checked');

    cy.get('button')
      .contains('Next')
      .click();

    // Review
    cy.get('h1').contains('Check your answers before sending');
  });

  it('displays and fills conditional fields', () => {
    // Contact Details
    cy.get('#IntakeForm-Requester')
      .type('Casey Doe')
      .should('have.value', 'Casey Doe');

    cy.get('#IntakeForm-RequesterComponent')
      .select('Center for Medicare')
      .should('have.value', 'Center for Medicare');

    cy.get('#IntakeForm-BusinessOwner')
      .type('Casey Doe')
      .should('have.value', 'Casey Doe');

    cy.get('#IntakeForm-BusinessOwnerComponent')
      .select('Center for Medicare')
      .should('have.value', 'Center for Medicare');

    cy.get('#IntakeForm-ProductManager')
      .type('Casey Doe')
      .should('have.value', 'Casey Doe');

    cy.get('#IntakeForm-ProductManagerComponent')
      .select('Center for Medicare')
      .should('have.value', 'Center for Medicare');

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

    cy.get('button')
      .contains('Next')
      .click();

    // Request Details
    cy.get('#IntakeForm-RequestName')
      .type('Test Request Name')
      .should('have.value', 'Test Request Name');

    cy.get('#IntakeForm-BusinessNeed')
      .type('This is my business need.')
      .should('have.value', 'This is my business need.');

    cy.get('#IntakeForm-BusinessSolution')
      .type('This is my business solution.')
      .should('have.value', 'This is my business solution.');

    cy.get('#IntakeForm-NeedsEaSupportYes')
      .check({ force: true })
      .should('be.checked');

    cy.get('#IntakeForm-CurrentStage')
      .select('Just an idea')
      .should('have.value', 'Just an idea');

    cy.get('#IntakeForm-HasContract')
      .select('No')
      .should('have.value', 'No');

    cy.get('#IntakeForm-HasFundingSourceYes')
      .check({ force: true })
      .should('be.checked');

    cy.get('#IntakeForm-FundingNumber')
      .type('111111')
      .should('have.value', '111111');

    cy.get('button')
      .contains('Next')
      .click();

    // Review
    cy.get('h1').contains('Check your answers before sending');
  });
});
