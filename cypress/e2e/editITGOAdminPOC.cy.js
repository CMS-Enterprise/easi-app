import intake from '../../src/i18n/en-US/intake';
import requestHome from '../../src/i18n/en-US/requestHome';

describe('Editing IT Gov Admin POC', () => {
  it('can edit the IT Gov Admin POC', () => {
    cy.localLogin({ name: 'ABCD', role: 'EASI_D_GOVTEAM' });
    cy.visit(
      '/it-governance/a2fa0d4b-909f-45d8-ad8c-90f22cf0db19/request-home'
    );

    cy.contains('h1', requestHome.requestHome.title);

    cy.contains('tr', 'User One')
      .find('[data-testid="tooltipBody"]')
      .should('exist')
      .and(
        'have.text',
        intake.contactDetails.additionalContacts.requesterTooltip
      );

    cy.contains('tr', 'Ally Anderson').contains('button', 'Edit').click();

    cy.url().should('include', '/edit-point-of-contact');

    cy.contains('label', requestHome.addPOC.isRequester)
      .click()
      .get('#isRequester')
      .should('be.checked');

    cy.contains('button', 'Save changes').click();

    cy.contains('h1', requestHome.requestHome.title);

    cy.contains('tr', 'User One')
      .find('[data-testid="tooltipBody"]')
      .should('not.exist');

    cy.contains('tr', 'Ally Anderson')
      .find('[data-testid="tooltipBody"]')
      .should('exist')
      .and(
        'have.text',
        intake.contactDetails.additionalContacts.requesterTooltip
      );
  });
});
