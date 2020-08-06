import cmsGovernanceTeams from '../../src/constants/enums/cmsGovernanceTeams';

describe('The System Intake Form', () => {
  before(() => {
    cy.login();
    // TODO HACK
    cy.wait(1000);
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.server();
    cy.route('POST', '/api/v1/system_intake').as('postSystemIntake');
    cy.route('PUT', '/api/v1/system_intake').as('putSystemIntake');
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

    cy.contains('button', 'Next').click();

    cy.wait('@postSystemIntake');

    // Request Details
    cy.systemIntake.requestDetails.fillNonBranchingFields();

    cy.get('#IntakeForm-HasFundingSourceNo')
      .check({ force: true })
      .should('be.checked');

    cy.contains('button', 'Next').click();

    cy.wait('@putSystemIntake');

    // Review
    cy.contains('h1', 'Check your answers before sending');
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

    cy.wait('@postSystemIntake');

    // Request Details
    cy.systemIntake.requestDetails.fillNonBranchingFields();

    cy.get('#IntakeForm-HasFundingSourceYes')
      .check({ force: true })
      .should('be.checked');

    cy.get('#IntakeForm-FundingNumber')
      .type('111111')
      .should('have.value', '111111');

    cy.contains('button', 'Next').click();

    cy.wait('@putSystemIntake');

    // Review
    cy.contains('h1', 'Check your answers before sending');

    cy.contains('.easi-review-row dt', /^Requester$/)
      .siblings('dd')
      .contains('EASi Testing');

    cy.contains('.easi-review-row dt', 'Requester Component')
      .siblings('dd')
      .contains('Center for Medicare');

    cy.contains('.easi-review-row dt', "CMS Business/Product Owner's Name")
      .siblings('dd')
      .contains('Casey Doe');

    cy.contains('.easi-review-row dt', 'Business Owner Component')
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

    cy.contains('.easi-review-row dt', 'Request Name')
      .siblings('dd')
      .contains('Request Name');

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

    cy.contains(
      '.easi-review-row dt',
      'Do you currently have a contract in place?'
    )
      .siblings('dd')
      .contains('No');

    cy.contains('.easi-review-row dt', 'Does the project have funding')
      .siblings('dd')
      .contains('Yes, 111111');
  });

  it('displays contact details error messages', () => {
    cy.contains('button', 'Next').click();

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

    cy.contains('button', 'Next').click();

    cy.contains('h1', 'Request details');

    cy.contains('button', 'Next').click();

    cy.get('[data-testid="system-intake-errors"]');
  });
});
