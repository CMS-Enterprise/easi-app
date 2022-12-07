cy.governanceReviewTeam = {
  grtActions: {
    /**
     * Select system intake action
     *
     * Run before filling out email notification form and selecting recipients
     */
    selectAction: ({
      /** Name of system intake - used to find link in system intakes table */
      intakeName,
      /** Action radio button ID - used to select action */
      actionId
    }) => {
      // Click system intake link from home screen
      cy.contains('a', intakeName).should('be.visible').click();

      // Click actions link
      cy.get('[data-testid="grt-nav-actions-link"]').click();

      // Expand actions list
      cy.get('button[data-testid="collapsable-link"]').click();

      // Select action type
      cy.get(`#${actionId}`).check({ force: true }).should('be.checked');
      cy.get('button[type="submit"]').click();

      // Wait for contacts query to complete
      // This ensures contacts are loaded and form initial values are set before cypress starts filling out fields
      cy.wait('@getSystemIntakeContacts')
        .its('response.statusCode')
        .should('eq', 200);
    }
  }
};
