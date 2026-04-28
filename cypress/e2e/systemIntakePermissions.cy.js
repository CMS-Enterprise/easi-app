const owner = { name: 'USR1' };
const admin = { name: 'ABCD', role: 'EASI_D_GOVTEAM' };
const grbReviewer = { name: 'USR2' };

const requesterFormIntakeId = '43fe5a4e-525c-40da-b0f6-3b36b5f84cc1';
const adminManagedIntakeId = 'a2fa0d4b-909f-45d8-ad8c-90f22cf0db19';
const reviewedIntakeId = 'b569ae1e-bf04-4c1b-96a5-b9604d74d979';

const notFoundHeading = 'This page cannot be found.';
const contactDetailsHeading = 'Contact details';
const requestDetailsHeading = 'Request details';
const contractDetailsHeading = 'Contract details';
const requestHomeHeading = 'Request home';
const addPocHeading = 'Add a project point of contact';
const relationEntryPointCta = 'Answer';
const systemInformationHeading = 'System information';
const editSystemInformationLink = 'Edit system information';

const loginAs = ({ name, role } = {}) => {
  cy.localLogin({ name, role });
};

const requesterFormRoutes = {
  contactDetails: `/system/${requesterFormIntakeId}/contact-details`,
  requestDetails: `/system/${requesterFormIntakeId}/request-details`,
  contractDetails: `/system/${requesterFormIntakeId}/contract-details`,
  taskList: `/governance-task-list/${requesterFormIntakeId}`
};

const adminManagedIntakeRoutes = {
  contactDetails: `/system/${adminManagedIntakeId}/contact-details`,
  requestDetails: `/system/${adminManagedIntakeId}/request-details`,
  contractDetails: `/system/${adminManagedIntakeId}/contract-details`,
  adminRequestHome: `/it-governance/${adminManagedIntakeId}/request-home`,
  adminAddPoc: `/it-governance/${adminManagedIntakeId}/add-point-of-contact`,
  adminSystemInformation: `/it-governance/${adminManagedIntakeId}/system-information`
};

const reviewedIntakeRoutes = {
  contactDetails: `/system/${reviewedIntakeId}/contact-details`,
  requestDetails: `/system/${reviewedIntakeId}/request-details`,
  contractDetails: `/system/${reviewedIntakeId}/contract-details`,
  linkedSystems: `/linked-systems/${reviewedIntakeId}`
};

describe('System intake permissions', () => {
  it('lets an IT Gov admin query requester update email data', () => {
    loginAs(admin);

    cy.request('POST', '/api/graph/query', {
      operationName: 'GetRequesterUpdateEmailData',
      query: `
        query GetRequesterUpdateEmailData {
          requesterUpdateEmailData {
            requesterEmail
          }
        }
      `
    }).then(({ body }) => {
      expect(body.errors).to.equal(undefined);
      expect(body.data.requesterUpdateEmailData).to.be.an('array');
    });
  });

  it('blocks a non-GRT user from querying requester update email data', () => {
    loginAs(owner);

    cy.request({
      method: 'POST',
      url: '/api/graph/query',
      failOnStatusCode: false,
      body: {
        operationName: 'GetRequesterUpdateEmailData',
        query: `
          query GetRequesterUpdateEmailData {
            requesterUpdateEmailData {
              requesterEmail
            }
          }
        `
      }
    }).then(({ body, status }) => {
      expect(status).to.equal(200);
      expect(body.data).to.equal(null);
      expect(body.errors[0].message).to.contain('User is unauthorized');
    });
  });

  it('lets the owner access requester intake form pages and the relation-management entry point', () => {
    loginAs(owner);

    cy.visit(requesterFormRoutes.contactDetails);
    cy.contains('h1', contactDetailsHeading).should('be.visible');

    cy.visit(requesterFormRoutes.requestDetails);
    cy.contains('h1', requestDetailsHeading).should('be.visible');

    cy.visit(requesterFormRoutes.contractDetails);
    cy.contains('h1', contractDetailsHeading).should('be.visible');

    cy.visit(requesterFormRoutes.taskList);
    cy.contains('button', relationEntryPointCta).should('be.visible');
  });

  it('blocks an IT Gov admin from requester-only intake form pages', () => {
    loginAs(admin);

    cy.visit(requesterFormRoutes.contactDetails);
    cy.contains('h1', notFoundHeading).should('be.visible');

    cy.visit(requesterFormRoutes.requestDetails);
    cy.contains('h1', notFoundHeading).should('be.visible');

    cy.visit(requesterFormRoutes.contractDetails);
    cy.contains('h1', notFoundHeading).should('be.visible');
  });

  it('lets an IT Gov admin access admin contact-management and relation-management entry points', () => {
    loginAs(admin);

    cy.visit(adminManagedIntakeRoutes.adminRequestHome);
    cy.contains('h1', requestHomeHeading).should('be.visible');

    cy.visit(adminManagedIntakeRoutes.adminAddPoc);
    cy.contains('h1', addPocHeading).should('be.visible');

    cy.visit(adminManagedIntakeRoutes.adminSystemInformation);
    cy.contains('h1', systemInformationHeading).should('be.visible');
    cy.contains('a', editSystemInformationLink).should('be.visible');
  });

  it('blocks a GRB reviewer from requester-only intake form pages on a reviewed intake', () => {
    loginAs(grbReviewer);

    cy.visit(reviewedIntakeRoutes.contactDetails);
    cy.contains('h1', notFoundHeading).should('be.visible');

    cy.visit(reviewedIntakeRoutes.requestDetails);
    cy.contains('h1', notFoundHeading).should('be.visible');

    cy.visit(reviewedIntakeRoutes.contractDetails);
    cy.contains('h1', notFoundHeading).should('be.visible');
  });

  it('blocks a GRB reviewer from intake relation-management pages', () => {
    loginAs(grbReviewer);

    cy.visit(reviewedIntakeRoutes.linkedSystems);
    cy.contains('h1', notFoundHeading).should('be.visible');
  });
});
