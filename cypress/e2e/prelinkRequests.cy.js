describe('Creating requests from the workspace that are linked to cedar systems', () => {
  const systemName = 'Office of Funny Walks';

  it('links a system for new TRB and IT Gov requests', () => {
    // Must use ABCD user to check against .isMySystem from BE seeded data
    cy.localLogin({ name: 'ABCD' });

    cy.visit('/systems?table-type=my-systems#systemsTable');
    cy.contains('a', systemName).click();

    cy.url().as('workspaceUrl', { type: 'static' });

    // TRB Request
    cy.get('[data-testid="new-request-trb"]a').click();
    cy.contains('a', 'Start').click();
    cy.contains('button', 'Continue').click();

    cy.get(`[data-testid="multiselect-tag--${systemName} (OFW)"]`).should(
      'be.visible'
    );

    // IT Gov
    cy.get('@workspaceUrl').then(url => cy.visit(url));
    cy.get('[data-testid="new-request-itgov"]a').click();
    cy.get('#RequestType-NewSystem').check({ force: true });
    cy.contains('button', 'Continue').click();
    cy.contains('a', 'Get started').click();

    cy.contains('button', 'Add a system').click();
    cy.get('[data-testid="cedarSystemID"]').select(
      '{11AB1A00-1234-5678-ABC1-1A001B00CC1B}'
    );

    cy.get('#partialSupport').check({ force: true });

    cy.contains('button', 'Add system').click();
    cy.get('[data-testid="table"]')
      .contains('td', 'Office of Funny Walks')
      .should('be.visible');
  });
});
