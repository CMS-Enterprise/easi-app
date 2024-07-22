// Note [Specific Cypress wait duration on Okta search]
// 2000ms seems to work well for this. Sadly, 1000ms sometimes isn't enough for the dropdown to appear,
// and 3000 causes issue with autosave. This is definitely a bit hacky...
// TODO: fix this in the future if it causes more headache

cy.systemIntake = {
  contactDetails: {
    fillNonBranchingFields: () => {
      cy.get('#requesterComponent')
        .select('Center for Medicare')
        .should('have.value', 'Center for Medicare');

      cy.get('#react-select-businessOwnerCommonName-input')
        .type('Audrey')
        .wait(2000) // See Note [Specific Cypress wait duration on Okta search]
        .type('{downarrow}{enter}')
        .should('have.value', 'Audrey Abrams, ADMI (audrey.abrams@local.fake)');

      cy.get('#businessOwnerEmail').should(
        'have.value',
        'audrey.abrams@local.fake'
      );

      cy.get('#businessOwnerComponent')
        .select('CMS Wide')
        .should('have.value', 'CMS Wide');

      cy.get('#react-select-productManagerCommonName-input')
        .type('Delphia')
        .wait(2000) // See Note [Specific Cypress wait duration on Okta search]
        .type('{downArrow}{enter}')
        .should('have.value', 'Delphia Green, GBRG (delphia.green@local.fake)');

      cy.get('#productManagerEmail').should(
        'have.value',
        'delphia.green@local.fake'
      );

      cy.get('#productManagerComponent')
        .select('Office of Legislation')
        .should('have.value', 'Office of Legislation');
    }
  },
  requestDetails: {
    fillNonBranchingFields: () => {
      cy.get('#requestName')
        .type('Test Request Name')
        .should('have.value', 'Test Request Name');

      cy.get('#businessNeed')
        .type('This is my business need.')
        .should('have.value', 'This is my business need.');

      cy.get('#businessSolution')
        .type('This is my business solution.')
        .should('have.value', 'This is my business solution.');

      cy.get('#needsEaSupportFalse')
        .check({ force: true })
        .should('be.checked');

      cy.get('#hasUiChangesFalse').check({ force: true }).should('be.checked');
    }
  },
  contractDetails: {
    addFundingSource: ({ fundingNumber, sources, restart }) => {
      if (restart) cy.get('[data-testid="fundingSourcesAction-add"]').click();

      if (fundingNumber) {
        cy.get('#fundingNumber')
          .clear()
          .type(fundingNumber)
          .should('have.value', fundingNumber);
      }

      if (sources) {
        sources.forEach(source => {
          cy.get('#sources').type(`${source}{enter}{esc}`);
          cy.get(`[data-testid="multiselect-tag--${source}"]`);
        });
      }

      cy.get('[data-testid="fundingSourcesAction-save"').click();
    }
  }
};
