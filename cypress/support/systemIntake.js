cy.systemIntake = {
  contactDetails: {
    fillNonBranchingFields: () => {
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
    }
  },
  requestDetails: {
    fillNonBranchingFields: () => {
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
    }
  }
};
