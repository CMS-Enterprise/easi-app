const owner = { name: 'USR1' };
const admin = { name: 'ABCD', role: 'EASI_TRB_ADMIN_D' };
const unrelatedUser = { name: 'USR2' };
const trbLead = { name: 'TEST' };

const requestNames = {
  completed: 'Case 2 - Request form complete',
  draftGuidanceLetter: 'Case 6 - Draft guidance letter',
  completedGuidanceLetter: 'Case 9 - Guidance letter sent',
  relation: 'Case 12 - Completed request form with New System Relation',
  relatedTable: 'Case 17 - Completed request with related system (0A)'
};

const notFoundHeading = 'This page cannot be found.';
const taskListHeading = 'Task list';
const supportingDocumentsHeading = 'Supporting documents';
const adminRequestHeading = 'TRB request details';
const guidanceLetterIncompleteHeading = 'Guidance letter incomplete';
const guidanceLetterDownloadLabel = 'Download guidance letter as PDF';
const guidanceLetterQuestionsHeading =
  'Have questions about this guidance letter?';

const requestUrls = {
  completed: null,
  draftGuidanceLetter: null,
  completedGuidanceLetter: null,
  relation: null,
  relatedTable: null
};

const loginAs = ({ name, role } = {}) => {
  cy.localLogin({ name, role });
};

const getRequestUrls = requestName => {
  cy.intercept('POST', '/api/graph/query', req => {
    if (req.body.operationName === 'GetTRBRequests') {
      req.alias = 'getTrbRequests';
    }
  });

  return cy
    .visit('/trb')
    .wait('@getTrbRequests')
    .then(({ response }) => {
      const requests = response?.body?.data?.myTrbRequests || [];
      const request = requests.find(item => item.name === requestName);

      expect(request, `request named "${requestName}"`).to.not.equal(undefined);

      const { id } = request;

      return {
        id,
        taskListHref: `/trb/task-list/${id}`,
        requesterDocumentsHref: `/trb/task-list/${id}/documents`,
        adminRequestHref: `/trb/${id}/request`,
        adminDocumentsHref: `/trb/${id}/documents`,
        adminAdditionalInfoHref: `/trb/${id}/additional-information`,
        requesterRelationHref: `/trb/link/${id}`,
        adminRelationHref: `/trb/${id}/additional-information/link`,
        guidanceLetterHref: `/trb/guidance-letter/${id}`
      };
    });
};

describe('TRB request permissions', () => {
  before(() => {
    loginAs(owner);

    getRequestUrls(requestNames.completed).then(urls => {
      requestUrls.completed = urls;
    });

    getRequestUrls(requestNames.draftGuidanceLetter).then(urls => {
      requestUrls.draftGuidanceLetter = urls;
    });

    getRequestUrls(requestNames.completedGuidanceLetter).then(urls => {
      requestUrls.completedGuidanceLetter = urls;
    });

    getRequestUrls(requestNames.relation).then(urls => {
      requestUrls.relation = urls;
    });

    getRequestUrls(requestNames.relatedTable).then(urls => {
      requestUrls.relatedTable = urls;
    });

    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('lets the request owner view the task list and supporting documents', () => {
    loginAs(owner);

    cy.visit(requestUrls.completed.taskListHref);
    cy.contains('h1', taskListHeading).should('be.visible');
    cy.contains(requestNames.completed).should('be.visible');

    cy.visit(requestUrls.completed.requesterDocumentsHref);
    cy.contains('h1', supportingDocumentsHeading).should('be.visible');
    cy.contains('a', 'Add a document').should('be.visible');
  });

  it('blocks an unrelated user from the requester task list view', () => {
    loginAs(unrelatedUser);

    cy.visit(requestUrls.completed.taskListHref);
    cy.contains('h1', notFoundHeading).should('be.visible');
  });

  it('blocks a TRB lead from the requester task list view', () => {
    loginAs(trbLead);

    cy.visit(requestUrls.completed.taskListHref);
    cy.contains('h1', notFoundHeading).should('be.visible');
  });

  it('keeps admin TRB pages admin-only for the requester', () => {
    loginAs(owner);

    cy.visit(requestUrls.completed.adminRequestHref);
    cy.contains('h1', notFoundHeading).should('be.visible');
  });

  it('lets a TRB admin view admin pages and keeps supporting documents read-only', () => {
    loginAs(admin);

    cy.visit(requestUrls.completed.adminRequestHref);
    cy.contains(adminRequestHeading).should('be.visible');
    cy.contains(requestNames.completed).should('be.visible');

    cy.visit(requestUrls.completed.adminDocumentsHref);
    cy.contains('h1', supportingDocumentsHeading).should('be.visible');
    cy.contains('a', 'Add a document').should('not.exist');
    cy.contains('button', 'Remove').should('not.exist');
  });

  it('shows draft guidance letters as incomplete to the requester', () => {
    loginAs(owner);

    cy.visit(requestUrls.draftGuidanceLetter.guidanceLetterHref);
    cy.contains(guidanceLetterIncompleteHeading).should('be.visible');
    cy.contains(
      'The Technical Review Board is still compiling the guidance letter for this project.'
    ).should('be.visible');
  });

  it('shows completed guidance letters to the requester', () => {
    loginAs(owner);

    cy.visit(requestUrls.completedGuidanceLetter.guidanceLetterHref);
    cy.contains(guidanceLetterDownloadLabel).should('be.visible');
    cy.contains(guidanceLetterQuestionsHeading).should('be.visible');
  });

  it('blocks an unrelated user from the completed guidance letter view', () => {
    loginAs(unrelatedUser);

    cy.visit(requestUrls.completedGuidanceLetter.guidanceLetterHref);
    cy.contains('h1', notFoundHeading).should('be.visible');
  });

  it('shows the requester the relation-management entry point on the task list', () => {
    loginAs(owner);

    cy.visit(requestUrls.relation.taskListHref);
    cy.contains('h4', 'Additional request information').should('be.visible');
    cy.contains('View or edit system information').should('be.visible');
  });

  it('shows the TRB admin the additional-information page for a related request', () => {
    loginAs(admin);

    cy.visit(requestUrls.relation.adminAdditionalInfoHref);
    cy.contains('h1', 'Additional information').should('be.visible');
    cy.contains(
      'This request is for a completely new system, service, or contract and may not have other requests related to it.'
    ).should('be.visible');
  });

  it('shows related TRB rows and hides inaccessible IT Gov rows on the admin related-requests table', () => {
    loginAs(admin);

    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'GetTRBRequestRelatedRequests') {
        req.alias = 'getTrbRequestRelatedRequests';
      }
    });

    cy.visit(requestUrls.relatedTable.adminAdditionalInfoHref);
    cy.wait('@getTrbRequestRelatedRequests');

    cy.contains('h2', 'Related requests').should('be.visible');
    cy.contains(
      'a',
      'Case 14 - Completed request form with Existing System Relation'
    ).should('be.visible');
    cy.contains('Related Intake 1 (system 0A)').should('not.exist');
  });
});
