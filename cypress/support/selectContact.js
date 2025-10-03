/** Command to select contact from CedarContactSelect component and confirm value */
Cypress.Commands.add('selectContact', ({ commonName, euaUserId, email }) => {
  const optionText = `${commonName}, ${euaUserId} (${email})`;

  cy.getByTestId('cedar-contact-select').type(commonName);

  cy.get('#react-select-userAccount-option-0')
    .should('have.text', optionText)
    .click();

  cy.getByTestId('cedar-contact-select').should('have.value', optionText);
});
