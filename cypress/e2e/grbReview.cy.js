describe('GRB review', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'E2E2', role: 'EASI_D_GOVTEAM' });
  });

  it('completes required fields', () => {
    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'UpdateSystemIntakeGRBReviewType') {
        req.alias = 'updateReviewType';
      }
    });

    cy.visit('/it-governance/5af245bc-fc54-4677-bab1-1b3e798bb43c/grb-review');

    cy.contains('button', 'Set up GRB review').click();

    cy.get('input#grbReviewTypeStandard').should('be.checked');

    cy.get('input#grbReviewTypeAsync').check({ force: true });

    cy.contains('button', 'Next').click();

    cy.wait('@updateReviewType').its('response.statusCode').should('eq', 200);
  });
});
