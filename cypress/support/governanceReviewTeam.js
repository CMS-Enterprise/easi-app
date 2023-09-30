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
      cy.contains('a', intakeName).should('be.visible').click({ force: true });

      // Click actions link
      cy.get('[data-testid="grt-nav-actions-link"]').click({ force: true });

      // Expand actions list
      cy.get('button[data-testid="collapsable-link"]').click({ force: true });

      // Select action type
      cy.get(`#${actionId}`).as('option').check({ force: true });
      cy.get('@option').should('be.checked');

      cy.get('button[type="submit"]').click({ force: true });

      // Wait for contacts query to complete
      // This ensures contacts are loaded and form initial values are set before cypress starts filling out fields
      cy.wait('@getSystemIntakeContacts')
        .its('response.statusCode')
        .should('eq', 200);
    }
  }
};
