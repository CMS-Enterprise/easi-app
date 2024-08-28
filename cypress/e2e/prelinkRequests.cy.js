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
    cy.get(`[data-testid="multiselect-tag--${systemName} (OFW)"]`).should(
      'be.visible'
    );
  });
});
