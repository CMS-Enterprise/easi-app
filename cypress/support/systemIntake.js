cy.systemIntake = {
  contactDetails: {
    fillNonBranchingFields: () => {
      cy.get('#IntakeForm-RequesterComponent')
        .select('Center for Medicare')
        .should('have.value', 'Center for Medicare');

      cy.get('#react-select-IntakeForm-BusinessOwnerName-input')
        .type('Jerry Seinfeld, SF13')
        .type('{downarrow}{enter}')
        .should('have.value', 'Jerry Seinfeld, SF13');

      cy.get('#IntakeForm-BusinessOwnerComponent')
        .select('Center for Medicare')
        .should('have.value', 'Center for Medicare');

      cy.get('#react-select-IntakeForm-ProductManagerName-input')
        .type('Jerry Seinfeld, SF13')
        .type('{downArrow}{enter}')
        .should('have.value', 'Jerry Seinfeld, SF13');

      cy.get('#IntakeForm-ProductManagerComponent')
        .select('Center for Medicare')
        .should('have.value', 'Center for Medicare');
    }
  },
  requestDetails: {
    fillNonBranchingFields: () => {
      cy.get('#IntakeForm-ContractName')
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
    }
  },
  contractDetails: {
    addFundingSource: ({ fundingNumber, sources, restart }) => {
      if (restart) cy.get('[data-testid="fundingSourcesAction-add"').click();

      if (fundingNumber) {
        cy.get('#IntakeForm-FundingNumber')
          .clear()
          .type(fundingNumber)
          .should('have.value', fundingNumber);
      }

      if (sources) {
        sources.forEach(source => {
          cy.get('#IntakeForm-FundingSources').type(`${source}{enter}{esc}`);
          cy.get(`[data-testid="multiselect-tag--${source}"]`);
        });
      }

      cy.get('[data-testid="fundingSourcesAction-save"').click();
    }
  }
};
