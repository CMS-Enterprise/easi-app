cy.systemIntake = {
  contactDetails: {
    fillNonBranchingFields: () => {
      cy.get('#IntakeForm-RequesterComponent')
        .select('Center for Medicare')
        .should('have.value', 'Center for Medicare');

      cy.get('#react-select-IntakeForm-BusinessOwnerName-input')
        .type('Audrey')
        .wait(2000)
        .type('{downarrow}{enter}')
        .should('have.value', 'Audrey Abrams, ADMI (audrey.abrams@local.fake)');

      cy.get('#IntakeForm-BusinessOwnerEmail').should(
        'have.value',
        'audrey.abrams@local.fake'
      );

      cy.get('#IntakeForm-BusinessOwnerComponent')
        .select('CMS Wide')
        .should('have.value', 'CMS Wide');

      cy.get('#react-select-IntakeForm-ProductManagerName-input')
        .type('Delphia')
        .wait(2000)
        .type('{downArrow}{enter}')
        .should('have.value', 'Delphia Green, GBRG (delphia.green@local.fake)');

      cy.get('#IntakeForm-ProductManagerEmail').should(
        'have.value',
        'delphia.green@local.fake'
      );

      cy.get('#IntakeForm-ProductManagerComponent')
        .select('Office of Legislation')
        .should('have.value', 'Office of Legislation');
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

      cy.get('#IntakeForm-HasUiChangesNo')
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
