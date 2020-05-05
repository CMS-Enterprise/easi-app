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
    cy.systemIntake.contactDetails.fillNonBranchingFields();

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
    cy.systemIntake.requestDetails.fillNonBranchingFields();

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

    cy.get('button')
      .contains('Next')
      .click();

    // Request Details
    cy.systemIntake.requestDetails.fillNonBranchingFields();

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

  it('displays contact details error messages', () => {
    cy.get('button')
      .contains('Next')
      .click();

    cy.get('[data-testid="system-intake-errors"]');
  });

  it('displays request details error messages', () => {
    cy.systemIntake.contactDetails.fillNonBranchingFields();

    cy.get('#IntakeForm-HasIssoNo')
      .check({ force: true })
      .should('be.checked');

    cy.get('#IntakeForm-NoGovernanceTeam')
      .check({ force: true })
      .should('be.checked');

    cy.get('button')
      .contains('Next')
      .click();

    cy.get('h1').contains('Request details');

    cy.get('button')
      .contains('Next')
      .click();

    cy.get('[data-testid="system-intake-errors"]');
  });
});
