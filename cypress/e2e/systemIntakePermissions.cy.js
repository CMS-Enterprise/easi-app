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
const itGovRequestsHeading = 'IT Governance requests';
const requesterUpdateEmailHeading = 'Requester update email';
const configureEmailListButton = 'Configure email list';

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

const addSystemLinkRoute = `/linked-systems-form/${requesterFormIntakeId}`;
const linkedSystemsRoute = `/linked-systems/${requesterFormIntakeId}`;
const linkedAdminSystemsRoute = `/linked-systems/${adminManagedIntakeId}`;
const adminSystemInformationLinkRoute = `/it-governance/${adminManagedIntakeId}/system-information/link`;
const cedarSystemId = '11ab1a00-1234-5678-abc1-1a001b00cc0a';
const systemName = 'Centers for Management Services';
const systemOption = `${systemName} (CMS)`;

describe('System intake permissions', () => {
  it('lets an IT Gov admin access requester update email configuration from the admin home', () => {
    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'GetRequesterUpdateEmailData') {
        req.alias = 'getRequesterUpdateEmailData';
      }
    });

    loginAs(admin);

    cy.contains('h1', itGovRequestsHeading).should('be.visible');
    cy.wait('@getRequesterUpdateEmailData')
      .its('response.statusCode')
      .should('eq', 200);
    cy.contains('h4', requesterUpdateEmailHeading).should('be.visible');
    cy.contains('button', configureEmailListButton).click();
    cy.get('[role="dialog"]').should('contain.text', configureEmailListButton);
  });

  it('hides requester update email configuration from non-admin users', () => {
    loginAs(owner);

    cy.contains('h3', 'My open requests').should('be.visible');
    cy.contains(requesterUpdateEmailHeading).should('not.exist');
    cy.contains('button', configureEmailListButton).should('not.exist');
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

  it('lets the owner add, edit, remove, and unlink systems from linked-systems routes', () => {
    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'GetSystemIntakeSystems') {
        req.alias = 'getSystemIntakeSystems';
      }

      if (req.body.operationName === 'GetSystemIntake') {
        req.alias = 'getSystemIntake';
      }

      if (req.body.operationName === 'GetCedarSystems') {
        req.alias = 'getCedarSystems';
      }

      if (req.body.operationName === 'GetSystemIntakeSystem') {
        req.alias = 'getSystemIntakeSystem';
      }

      if (req.body.operationName === 'AddSystemLink') {
        req.alias = 'addSystemLink';
      }

      if (req.body.operationName === 'UpdateSystemLink') {
        req.alias = 'updateSystemLink';
      }

      if (req.body.operationName === 'DeleteSystemLink') {
        req.alias = 'deleteSystemLink';
      }

      if (req.body.operationName === 'UnlinkSystemIntakeRelation') {
        req.alias = 'unlinkSystemIntakeRelation';
      }
    });

    loginAs(owner);

    cy.visit(addSystemLinkRoute);
    cy.wait('@getCedarSystems').its('response.statusCode').should('eq', 200);
    cy.contains('h1', 'Add a system link').should('be.visible');

    cy.getByTestId('cedarSystemID').select(systemOption);
    cy.get('#primarySupport').check({ force: true });
    cy.contains('button', 'Add system').click();

    cy.wait('@addSystemLink').its('response.statusCode').should('eq', 200);
    cy.contains('You linked').should('be.visible');
    cy.contains(systemName).should('be.visible');

    cy.contains('tr', systemName).within(() => {
      cy.contains('button', 'Edit').click();
    });

    cy.wait('@getSystemIntakeSystem')
      .its('response.statusCode')
      .should('eq', 200);
    cy.contains('h1', 'Edit a system link').should('be.visible');
    cy.get('#partialSupport').check({ force: true });
    cy.contains('button', 'Save changes').click();

    cy.wait('@updateSystemLink').its('response.statusCode').should('eq', 200);
    cy.contains('You saved changes').should('be.visible');
    cy.contains('tr', systemName).contains(
      'partially contributes financially',
      {
        matchCase: false
      }
    );

    cy.contains('tr', systemName).within(() => {
      cy.contains('button', 'Remove').click();
    });
    cy.contains('button', 'Remove linked system').click();

    cy.wait('@deleteSystemLink').its('response.statusCode').should('eq', 200);
    cy.contains('You have removed a linked system').should('be.visible');

    cy.visit(addSystemLinkRoute);
    cy.wait('@getCedarSystems').its('response.statusCode').should('eq', 200);
    cy.getByTestId('cedarSystemID').select(systemOption);
    cy.get('#primarySupport').check({ force: true });
    cy.contains('button', 'Add system').click();

    cy.wait('@addSystemLink').its('response.statusCode').should('eq', 200);
    cy.visit(linkedSystemsRoute);
    cy.wait('@getSystemIntakeSystems')
      .its('response.statusCode')
      .should('eq', 200);

    cy.get('#systemsUsed').check({ force: true });
    cy.contains('button', 'Remove linked systems').click();

    cy.wait('@unlinkSystemIntakeRelation')
      .its('response.statusCode')
      .should('eq', 200);
    cy.contains('You have removed all linked systems').should('be.visible');
  });

  it('lets an IT Gov admin manage linked systems through the linked systems page', () => {
    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'GetSystemIntakeSystems') {
        req.alias = 'getSystemIntakeSystems';
      }

      if (req.body.operationName === 'GetSystemIntake') {
        req.alias = 'getSystemIntake';
      }

      if (req.body.operationName === 'GetCedarSystems') {
        req.alias = 'getCedarSystems';
      }

      if (req.body.operationName === 'AddSystemLink') {
        req.alias = 'addSystemLink';
      }

      if (req.body.operationName === 'DeleteSystemLink') {
        req.alias = 'deleteSystemLink';
      }
    });

    loginAs(admin);

    cy.visit(adminManagedIntakeRoutes.adminSystemInformation);
    cy.contains('a', editSystemInformationLink).click();

    cy.wait('@getSystemIntakeSystems')
      .its('response.statusCode')
      .should('eq', 200);
    cy.url().should('include', linkedAdminSystemsRoute);

    cy.contains('button', 'Add a system').click();
    cy.wait('@getCedarSystems').its('response.statusCode').should('eq', 200);
    cy.contains('h1', 'Add a system link').should('be.visible');

    cy.getByTestId('cedarSystemID').select(systemOption);
    cy.get('#primarySupport').check({ force: true });
    cy.contains('button', 'Add system').click();

    cy.wait('@addSystemLink').its('response.statusCode').should('eq', 200);
    cy.contains('You linked').should('be.visible');
    cy.contains(systemName).should('be.visible');

    cy.contains('tr', systemName).within(() => {
      cy.contains('button', 'Remove').click();
    });
    cy.contains('button', 'Remove linked system').click();

    cy.wait('@deleteSystemLink').its('response.statusCode').should('eq', 200);
    cy.contains('You have removed a linked system').should('be.visible');
  });

  it('lets an IT Gov admin mark a request as a new system from the link form', () => {
    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'GetSystemIntakeRelation') {
        req.alias = 'getSystemIntakeRelation';
      }

      if (req.body.operationName === 'SetSystemIntakeRelationNewSystem') {
        req.alias = 'setNewSystemRelation';
      }
    });

    loginAs(admin);

    cy.visit(adminSystemInformationLinkRoute);
    cy.wait('@getSystemIntakeRelation')
      .its('response.statusCode')
      .should('eq', 200);

    cy.get('#relationType-newSystem').check({ force: true });
    cy.contains('button', 'Save changes').click();

    cy.wait('@setNewSystemRelation')
      .its('response.statusCode')
      .should('eq', 200);
    cy.location('pathname').should(
      'eq',
      `/it-governance/${adminManagedIntakeId}/system-information`
    );
  });

  it('lets an IT Gov admin link a request to an existing service from the link form', () => {
    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'GetSystemIntakeRelation') {
        req.alias = 'getSystemIntakeRelation';
      }

      if (req.body.operationName === 'SetSystemIntakeRelationExistingService') {
        req.alias = 'setExistingServiceRelation';
      }
    });

    loginAs(admin);

    cy.visit(adminSystemInformationLinkRoute);
    cy.wait('@getSystemIntakeRelation')
      .its('response.statusCode')
      .should('eq', 200);

    cy.get('#relationType-existingService').check({ force: true });
    cy.get('#contractName').clear().type('Existing service contract');
    cy.contains('button', 'Save changes').click();

    cy.wait('@setExistingServiceRelation')
      .its('response.statusCode')
      .should('eq', 200);
    cy.location('pathname').should(
      'eq',
      `/it-governance/${adminManagedIntakeId}/system-information`
    );
  });

  it('lets an IT Gov admin link a request to an existing system from the link form', () => {
    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'GetSystemIntakeRelation') {
        req.alias = 'getSystemIntakeRelation';
      }

      if (req.body.operationName === 'SetSystemIntakeRelationExistingSystem') {
        req.alias = 'setExistingSystemRelation';
      }
    });

    loginAs(admin);

    cy.visit(
      `${adminSystemInformationLinkRoute}?linkCedarSystemId=${encodeURIComponent(
        cedarSystemId
      )}`
    );
    cy.wait('@getSystemIntakeRelation')
      .its('response.statusCode')
      .should('eq', 200);

    cy.get('#relationType-existingSystem').check({ force: true });
    cy.contains('button', 'Save changes').click();

    cy.wait('@setExistingSystemRelation')
      .its('response.statusCode')
      .should('eq', 200);
    cy.location('pathname').should(
      'eq',
      `/it-governance/${adminManagedIntakeId}/system-information`
    );
  });
});
