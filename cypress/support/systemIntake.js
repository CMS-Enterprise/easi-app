// Note [Specific Cypress wait duration on Okta search]
// 2000ms seems to work well for this. Sadly, 1000ms sometimes isn't enough for the dropdown to appear,
// and 3000 causes issue with autosave. This is definitely a bit hacky...
// TODO: fix this in the future if it causes more headache

const testSystemIntakeName = 'Test Request Name';
cy.systemIntake = {
  contactDetails: {
    fillNonBranchingFields: () => {
      cy.getByTestId('contact-row-E2E1').contains('button', 'Edit').click();

      cy.getByTestId('component-select').select('Center for Medicare (CM)');

      cy.get('#roles').click();
      cy.contains('label', 'Cloud Navigator').click();
      cy.get('#roles').click();

      cy.contains('button', 'Save changes').click();

      cy.getByTestId('contact-row-E2E1').contains('Cloud Navigator');
      cy.getByTestId('contact-row-E2E1').contains('CM');

      cy.contains('button', 'Add another contact').click();

      cy.selectContact({
        commonName: 'Aaron Adams',
        euaUserId: 'ADMN',
        email: 'aaron.adams@local.fake'
      });

      cy.getByTestId('component-select').select(
        'Center for Program Integrity (CPI)'
      );

      cy.get('#roles').click();
      cy.contains('label', 'Business Owner').click();
      cy.get('#roles').click();

      cy.contains('button', 'Add contact').click();

      cy.getByTestId('contact-row-ADMN').contains('Aaron Adams');
      cy.getByTestId('contact-row-ADMN').contains('CPI');
      cy.getByTestId('contact-row-ADMN').contains('Business Owner');

      cy.contains('button', 'Add another contact').click();

      cy.selectContact({
        commonName: 'Annetta Lockman',
        euaUserId: 'LW40',
        email: 'annetta.lockman@local.fake'
      });

      cy.getByTestId('component-select').select('Office of Legislation (OL)');

      cy.get('#roles').click();
      cy.contains('label', 'Product Manager').click();
      cy.contains('label', 'Privacy Advisor').click();
      cy.get('#roles').click();

      cy.contains('button', 'Add contact').click();

      cy.getByTestId('contact-row-LW40').contains('Annetta Lockman');
      cy.getByTestId('contact-row-LW40').contains('OL');
      cy.getByTestId('contact-row-LW40').contains(
        'Product Manager, Privacy Advisor'
      );
    }
  },
  requestDetails: {
    fillNonBranchingFields: () => {
      cy.get('#requestName')
        .type(testSystemIntakeName)
        .should('have.value', testSystemIntakeName);

      cy.get('#businessNeed')
        .type('This is my business need.')
        .should('have.value', 'This is my business need.');

      cy.get('#businessSolution')
        .type('This is my business solution.')
        .should('have.value', 'This is my business solution.');

      cy.get('#usesAiTechTrue').check({ force: true }).should('be.checked');

      cy.get('#needsEaSupportFalse')
        .check({ force: true })
        .should('be.checked');

      cy.get('#hasUiChangesFalse').check({ force: true }).should('be.checked');

      cy.get('#usingSoftwareNo').check({ force: true }).should('be.checked');
    }
  },
  contractDetails: {
    addFundingSource: ({ projectNumber, investments, restart }) => {
      if (restart) cy.get('[data-testid="addFundingSourceButton"]').click();

      if (projectNumber) {
        cy.get('#projectNumber').clear();
        cy.get('#projectNumber').type(projectNumber);
        cy.get('#projectNumber').should('have.value', projectNumber);
      }

      if (investments) {
        investments.forEach(investment => {
          cy.get('#investments').type(`${investment}{enter}`);
          cy.get(`[data-testid="multiselect-tag--${investment}"]`);
          cy.get('#investments').click();
        });
      }

      cy.get('[data-testid="submitFundingSourceButton"]').click();
    }
  }
};

export default testSystemIntakeName;
