describe('Governance Review Team', () => {
  beforeEach(() => {
    cy.server();
    cy.route('GET', '/api/v1/system_intakes?status=open').as('getOpenIntakes');
    cy.localLogin({ name: 'GRTB', role: 'EASI_D_GOVTEAM' });
    cy.visit('/');
  });

  it('can add GRT/GRB dates', () => {
    cy.wait('@getOpenIntakes');

    // Selecting name based on pre-seeded data
    // A Completed Intake Form - af7a3924-3ff7-48ec-8a54-b8b4bc95610b
    cy.get('a').contains('A Completed Intake Form').click();
    cy.get(
      'a[href="/governance-review-team/af7a3924-3ff7-48ec-8a54-b8b4bc95610b/dates"]'
    ).click();

    cy.get('#Dates-GrtDateMonth').clear().type('11').should('have.value', '11');
    cy.get('#Dates-GrtDateDay').clear().type('24').should('have.value', '24');
    cy.get('#Dates-GrtDateYear')
      .clear()
      .type('2020')
      .should('have.value', '2020');

    cy.get('#Dates-GrbDateMonth').clear().type('12').should('have.value', '12');
    cy.get('#Dates-GrbDateDay').clear().type('25').should('have.value', '25');
    cy.get('#Dates-GrbDateYear')
      .clear()
      .type('2020')
      .should('have.value', '2020');

    cy.get('button[data-testid="button"]').contains('Save').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.eq(
        '/governance-review-team/af7a3924-3ff7-48ec-8a54-b8b4bc95610b/intake-request'
      );
    });

    cy.get(
      'a[href="/governance-review-team/af7a3924-3ff7-48ec-8a54-b8b4bc95610b/dates"]'
    ).click();

    cy.get('#Dates-GrtDateMonth').should('have.value', '11');
    cy.get('#Dates-GrtDateDay').should('have.value', '24');
    cy.get('#Dates-GrtDateYear').should('have.value', '2020');

    cy.get('#Dates-GrbDateMonth').should('have.value', '12');
    cy.get('#Dates-GrbDateDay').should('have.value', '25');
    cy.get('#Dates-GrbDateYear').should('have.value', '2020');
  });
});
