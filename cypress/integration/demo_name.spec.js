describe('The Demo Name Sample', () => {
  it('visits the page', () => {
    cy.visit('http://localhost:3000');
    cy.title().should('eq', 'CMS EASi');
  });
});
