const requester = { name: 'USR1' };
const requesterFormIntakeId = '43fe5a4e-525c-40da-b0f6-3b36b5f84cc1';

const linkedSystemsFormRoute = `/linked-systems-form/${requesterFormIntakeId}`;
const contactDetailsRoute = `/system/${requesterFormIntakeId}/contact-details`;

describe('CEDAR permissions', () => {
  beforeEach(() => {
    cy.localLogin(requester);
  });

  it('lets a requester access Cedar systems while adding a linked system', () => {
    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'GetCedarSystems') {
        req.alias = 'getCedarSystems';
      }
    });

    cy.visit(linkedSystemsFormRoute);

    cy.contains('h1', 'Add a system link').should('be.visible');
    cy.wait('@getCedarSystems').its('response.statusCode').should('eq', 200);
    cy.getByTestId('cedarSystemID')
      .find('option')
      .its('length')
      .should('be.gt', 1);
    cy.contains('We were unable to retrieve Cedar Systems').should('not.exist');
  });

  it('lets a requester search for a Cedar contact when adding an additional contact', () => {
    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'GetCedarContacts') {
        req.alias = 'getCedarContacts';
      }
    });

    cy.visit(contactDetailsRoute);

    cy.contains('h1', 'Contact details').should('be.visible');
    cy.contains('button', 'Add another contact').click();

    cy.selectContact({
      commonName: 'Audrey Abrams',
      euaUserId: 'ADMI',
      email: 'audrey.abrams@local.fake'
    });

    cy.wait('@getCedarContacts').its('response.statusCode').should('eq', 200);
    cy.contains('button', 'Add contact').should('be.visible');
  });
});
