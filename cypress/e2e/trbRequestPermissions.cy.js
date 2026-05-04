const owner = { name: 'USR1' };
const admin = { name: 'ABCD', role: 'EASI_TRB_ADMIN_D' };
const unrelatedUser = { name: 'USR2' };
const trbLead = { name: 'TEST' };

const requestNames = {
  draft: 'Case 1 - Draft request form',
  completed: 'Case 2 - Request form complete',
  draftGuidanceLetter: 'Case 6 - Draft guidance letter',
  completedGuidanceLetter: 'Case 9 - Guidance letter sent',
  relation: 'Case 12 - Completed request form with New System Relation',
  withAttendees: 'Case 15 - Completed request form with Attendees',
  relatedTable: 'Case 17 - Completed request with related system (0A)'
};

const notFoundHeading = 'This page cannot be found.';
const taskListHeading = 'Task list';
const attendeesHeading = 'Attendees';
const supportingDocumentsHeading = 'Supporting documents';
const uploadDocumentHeading = 'Upload a document';
const adminRequestHeading = 'TRB request details';
const guidanceLetterIncompleteHeading = 'Guidance letter incomplete';
const guidanceLetterDownloadLabel = 'Download guidance letter as PDF';
const guidanceLetterQuestionsHeading =
  'Have questions about this guidance letter?';
const relatedLcidsLabel =
  'Select any Life Cycle IDs (LCIDs) pertaining to this request.';
const assignLeadHeading = 'Assign an Admin lead for this request';

const requestUrls = {
  draft: null,
  completed: null,
  draftGuidanceLetter: null,
  completedGuidanceLetter: null,
  relation: null,
  withAttendees: null,
  relatedTable: null
};

const loginAs = ({ name, role } = {}) => {
  cy.localLogin({ name, role });
};

const selectFirstRequestLinkSystem = () => {
  cy.get('.easi-multiselect input[id$="-input"]')
    .first()
    .as('requestLinkInput');
  cy.get('@requestLinkInput').click({
    force: true
  });
  cy.get('.usa-combo-box__list-option:visible')
    .should('have.length.at.least', 1)
    .first()
    .click({ force: true });
  cy.get('[data-testid^="multiselect-tag--"]').should(
    'have.length.at.least',
    1
  );
  cy.get('@requestLinkInput').type('{esc}', { force: true });
  cy.get('.usa-combo-box__list-option:visible').should('not.exist');
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
        requesterAttendeesHref: `/trb/task-list/${id}/attendees`,
        requesterAttendeesListHref: `/trb/task-list/${id}/attendees/list`,
        requesterBasicHref: `/trb/requests/${id}/basic`,
        requesterDocumentsHref: `/trb/task-list/${id}/documents`,
        requesterDocumentUploadHref: `/trb/task-list/${id}/documents/upload`,
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

    getRequestUrls(requestNames.draft).then(urls => {
      requestUrls.draft = urls;
    });

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

    getRequestUrls(requestNames.withAttendees).then(urls => {
      requestUrls.withAttendees = urls;
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

  it('lets the request owner reach the standalone attendees and upload routes', () => {
    loginAs(owner);

    cy.visit(requestUrls.withAttendees.requesterAttendeesHref);
    cy.contains('h1', attendeesHeading).should('be.visible');

    cy.visit(requestUrls.completed.requesterDocumentsHref);
    cy.contains('h1', supportingDocumentsHeading).should('be.visible');

    cy.visit(requestUrls.completed.requesterDocumentUploadHref);
    cy.contains('h1', uploadDocumentHeading).should('be.visible');
  });

  it('lets the request owner add and remove attendees from the standalone attendees route', () => {
    loginAs(owner);

    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'CreateTRBRequestAttendee') {
        req.alias = 'createTrbRequestAttendee';
      }

      if (req.body.operationName === 'UpdateTRBRequestAttendee') {
        req.alias = 'updateTrbRequestAttendee';
      }

      if (req.body.operationName === 'DeleteTRBRequestAttendee') {
        req.alias = 'deleteTrbRequestAttendee';
      }
    });

    cy.visit(requestUrls.withAttendees.requesterAttendeesListHref);
    cy.trbRequest.attendees.fillRequiredFields({
      userInfo: {
        commonName: 'Anabelle Jerde',
        euaUserId: 'JTTC'
      },
      component: 'Center for Medicare',
      role: 'PRIVACY_ADVISOR'
    });
    cy.contains('button', 'Add attendee').click();

    cy.wait('@createTrbRequestAttendee')
      .its('response.body.errors')
      .should('not.exist');
    cy.contains('.usa-alert__text', 'Your attendee has been added.').should(
      'be.visible'
    );
    cy.get('#trbAttendee-JTTC').as('newAttendee').should('be.visible');

    cy.get('@newAttendee').contains('Edit').click();
    cy.trbRequest.attendees.fillRequiredFields({
      role: 'CRA'
    });
    cy.contains('button', 'Save').click();

    cy.wait('@updateTrbRequestAttendee')
      .its('response.body.errors')
      .should('not.exist');
    cy.contains('.usa-alert__text', 'Your attendee has been edited.').should(
      'be.visible'
    );
    cy.get('@newAttendee').contains('CRA').should('be.visible');

    cy.get('@newAttendee').contains('button', 'Remove').click();
    cy.contains('button', 'Remove attendee').click();

    cy.wait('@deleteTrbRequestAttendee')
      .its('response.body.errors')
      .should('not.exist');
    cy.contains('.usa-alert__text', 'Your attendee has been removed.').should(
      'be.visible'
    );
    cy.get('@newAttendee').should('not.exist');
  });

  it('lets the request owner upload documents from the standalone upload route', () => {
    loginAs(owner);

    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'DeleteTRBRequestDocument') {
        req.alias = 'deleteTrbRequestDocument';
      }
    });

    cy.getTrbRequestDocuments(requestUrls.completed.id).then(
      existingDocuments => {
        const existingDocumentIDs = existingDocuments.map(
          document => document.id
        );

        cy.visit(requestUrls.completed.requesterDocumentUploadHref);
        cy.get('input[name=fileData]').selectFile('cypress/fixtures/test.pdf', {
          force: true
        });
        cy.get('#documentType-ARCHITECTURE_DIAGRAM').check({ force: true });
        cy.contains('button', 'Upload document').should('not.be.disabled');
        cy.contains('button', 'Upload document').click();

        cy.url().should(
          'include',
          requestUrls.completed.requesterDocumentsHref
        );
        cy.contains(
          '.usa-alert__text',
          'Your document has been uploaded and is being scanned.'
        ).should('be.visible');

        cy.contains('td', 'test.pdf').should('be.visible');
        cy.contains('td', 'Virus scan in progress...').should('be.visible');

        return cy
          .getNewTrbRequestDocumentUrl(
            requestUrls.completed.id,
            existingDocumentIDs
          )
          .then(url => cy.markMinioUploadAsCleanByUrl(url));
      }
    );

    cy.reload();

    cy.contains('#systemIntakeDocuments td', 'test.pdf', {
      timeout: 20000
    }).should('be.visible');

    cy.contains('#systemIntakeDocuments tr', 'test.pdf')
      .should('be.visible')
      .within(() => {
        cy.contains('button', 'Remove').click();
      });
    cy.contains('button', 'Remove document').click();

    cy.wait('@deleteTrbRequestDocument')
      .its('response.body.errors')
      .should('not.exist');
    cy.contains(
      '.usa-alert__text',
      'You have successfully removed test.pdf.'
    ).should('be.visible');
    cy.contains('#systemIntakeDocuments td', 'test.pdf').should('not.exist');
  });

  it('uses the requester-safe LCID lookup on the TRB basic form', () => {
    loginAs(owner);

    const operationNames = [];

    cy.intercept('POST', '/api/graph/query', req => {
      operationNames.push(req.body.operationName);

      if (req.body.operationName === 'GetTRBRequestLcidOptions') {
        req.alias = 'getTrbRequestLcidOptions';
      }
    });

    cy.visit(requestUrls.draft.requesterBasicHref);
    cy.wait('@getTrbRequestLcidOptions');

    cy.contains('label', relatedLcidsLabel).should('be.visible');
    cy.get('#systemIntakes').click({ force: true });
    cy.contains('000001').should('be.visible');

    cy.then(() => {
      expect(operationNames).to.include('GetTRBRequestLcidOptions');
      expect(operationNames).not.to.include('GetSystemIntakesWithLCIDS');
    });
  });

  it('lets the request owner save TRB basic form changes from the seeded request flow', () => {
    loginAs(owner);

    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'UpdateTRBRequestAndForm') {
        req.alias = 'updateTrbRequestAndForm';
      }
    });

    cy.visit(requestUrls.draft.requesterBasicHref);

    cy.get('[name=name]').clear().type('Case 1 - Draft request form updated');
    cy.get('#systemIntakes').click({ force: true });
    cy.contains('.usa-combo-box__list-option', '000001 -').click({
      force: true
    });
    cy.get('[data-testid^="multiselect-tag--"]')
      .contains('000001 -')
      .should('be.visible');

    cy.contains('button', 'Save and exit').click();

    cy.wait('@updateTrbRequestAndForm')
      .its('response.body.errors')
      .should('not.exist');
    cy.url().should('include', requestUrls.draft.taskListHref);

    cy.visit(requestUrls.draft.requesterBasicHref);
    cy.get('[name=name]').should(
      'have.value',
      'Case 1 - Draft request form updated'
    );
    cy.get('[data-testid^="multiselect-tag--"]')
      .contains('000001')
      .should('be.visible');
  });

  it('keeps the requester form accessible when requesterInfo is unavailable', () => {
    loginAs(owner);

    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'GetTRBRequest') {
        req.alias = 'getTrbRequest';
        req.continue(res => {
          if (res.body?.data?.trbRequest?.requesterInfo) {
            res.body.data.trbRequest.requesterInfo.euaUserId = '';
          }
        });
      }

      if (req.body.operationName === 'GetTRBRequestAttendees') {
        req.alias = 'getTrbRequestAttendees';
      }
    });

    cy.visit(requestUrls.draft.requesterBasicHref);
    cy.wait('@getTrbRequest');
    cy.wait('@getTrbRequestAttendees');

    cy.contains(
      '.usa-step-indicator__heading-text .long',
      'Basic request details'
    ).should('be.visible');
    cy.contains('h1', notFoundHeading).should('not.exist');
  });

  it('blocks an unrelated user from the requester task list view', () => {
    loginAs(unrelatedUser);

    cy.visit(requestUrls.completed.taskListHref);
    cy.contains('h1', notFoundHeading).should('be.visible');
  });

  it('blocks an unrelated user from the TRB basic form LCID lookup', () => {
    loginAs(unrelatedUser);

    const operationNames = [];

    cy.intercept('POST', '/api/graph/query', req => {
      operationNames.push(req.body.operationName);
    });

    cy.visit(requestUrls.draft.requesterBasicHref);
    cy.contains('h1', notFoundHeading).should('be.visible');

    cy.then(() => {
      expect(operationNames).not.to.include('GetTRBRequestLcidOptions');
    });
  });

  it('shows an unrelated user the standalone document upload route', () => {
    loginAs(unrelatedUser);

    cy.visit(requestUrls.completed.requesterDocumentUploadHref);
    cy.contains('h1', uploadDocumentHeading).should('be.visible');
  });

  it('shows an unrelated user the standalone documents route even when the query is denied', () => {
    loginAs(unrelatedUser);

    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'GetTRBRequestDocuments') {
        req.alias = 'getTrbRequestDocuments';
      }
    });

    cy.visit(requestUrls.completed.requesterDocumentsHref);
    cy.wait('@getTrbRequestDocuments')
      .its('response.body.errors.0.message')
      .should('include', 'unauthorized to access TRB request');

    cy.contains('h1', supportingDocumentsHeading).should('be.visible');
    cy.contains('a', 'Add a document').should('be.visible');
  });

  it('shows an unrelated user the standalone attendees route even when the query is denied', () => {
    loginAs(unrelatedUser);

    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'GetTRBRequestAttendees') {
        req.alias = 'getTrbRequestAttendees';
      }
    });

    cy.visit(requestUrls.withAttendees.requesterAttendeesHref);
    cy.wait('@getTrbRequestAttendees')
      .its('response.body.errors.0.message')
      .should('include', 'unauthorized to access TRB request');

    cy.url().should(
      'include',
      requestUrls.withAttendees.requesterAttendeesHref
    );
    cy.contains('h1', attendeesHeading).should('be.visible');
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

  it('loads TRB lead options on the admin request page', () => {
    loginAs(admin);

    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'GetTRBLeadOptions') {
        req.alias = 'getTrbLeadOptions';
      }
    });

    cy.visit(requestUrls.draft.adminRequestHref);
    cy.wait('@getTrbLeadOptions')
      .its('response.body.data.trbLeadOptions')
      .should('have.length.greaterThan', 0);
    cy.contains('button', 'Assign a TRB Lead').click();
    cy.contains(assignLeadHeading).should('be.visible');
  });

  it('lets a TRB admin reach the standalone requester attendees and upload routes', () => {
    loginAs(admin);

    cy.visit(requestUrls.withAttendees.requesterAttendeesHref);
    cy.contains('h1', attendeesHeading).should('be.visible');

    cy.visit(requestUrls.completed.requesterDocumentsHref);
    cy.contains('h1', supportingDocumentsHeading).should('be.visible');
    cy.contains('a', 'Add a document').should('be.visible');

    cy.visit(requestUrls.completed.requesterDocumentUploadHref);
    cy.contains('h1', uploadDocumentHeading).should('be.visible');
  });

  it('denies attendee creation for a TRB admin on the standalone requester attendees route', () => {
    loginAs(admin);

    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'CreateTRBRequestAttendee') {
        req.alias = 'createTrbRequestAttendee';
      }
    });

    cy.visit(requestUrls.withAttendees.requesterAttendeesListHref);
    cy.trbRequest.attendees.fillRequiredFields({
      userInfo: {
        commonName: 'Anabelle Jerde',
        euaUserId: 'JTTC'
      },
      component: 'Center for Medicare',
      role: 'PRIVACY_ADVISOR'
    });
    cy.contains('button', 'Add attendee').click();

    cy.wait('@createTrbRequestAttendee')
      .its('response.body.errors.0.message')
      .should('include', 'unauthorized to modify TRB request');
    cy.contains('.usa-alert__text', 'Your attendee has been added.').should(
      'not.exist'
    );
  });

  it('denies document upload for a TRB admin on the standalone requester upload route', () => {
    loginAs(admin);

    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'CreateTRBRequestDocument') {
        req.alias = 'createTrbRequestDocument';
      }
    });

    cy.visit(requestUrls.completed.requesterDocumentUploadHref);
    cy.get('input[name=fileData]').selectFile('cypress/fixtures/test.pdf', {
      force: true
    });
    cy.get('#documentType-ARCHITECTURE_DIAGRAM').check({ force: true });
    cy.contains('button', 'Upload document').should('not.be.disabled');
    cy.contains('button', 'Upload document').click();

    cy.url().should(
      'include',
      requestUrls.completed.requesterDocumentUploadHref
    );
    cy.contains(
      'There was a problem uploading your document. Please try again'
    ).should('be.visible');
    cy.contains(
      '.usa-alert__text',
      'Your document has been uploaded and is being scanned.'
    ).should('not.exist');
  });

  it('lets a TRB lead reach the standalone requester attendees and upload routes', () => {
    loginAs(trbLead);

    cy.visit(requestUrls.withAttendees.requesterAttendeesHref);
    cy.contains('h1', attendeesHeading).should('be.visible');

    cy.visit(requestUrls.completed.requesterDocumentsHref);
    cy.contains('h1', supportingDocumentsHeading).should('be.visible');
    cy.contains('a', 'Add a document').should('be.visible');

    cy.visit(requestUrls.completed.requesterDocumentUploadHref);
    cy.contains('h1', uploadDocumentHeading).should('be.visible');
  });

  it('denies attendee creation for a TRB lead on the standalone requester attendees route', () => {
    loginAs(trbLead);

    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'CreateTRBRequestAttendee') {
        req.alias = 'createTrbRequestAttendee';
      }
    });

    cy.visit(requestUrls.withAttendees.requesterAttendeesListHref);
    cy.trbRequest.attendees.fillRequiredFields({
      userInfo: {
        commonName: 'Anabelle Jerde',
        euaUserId: 'JTTC'
      },
      component: 'Center for Medicare',
      role: 'PRIVACY_ADVISOR'
    });
    cy.contains('button', 'Add attendee').click();

    cy.wait('@createTrbRequestAttendee')
      .its('response.body.errors.0.message')
      .should('include', 'unauthorized to modify TRB request');
    cy.contains('.usa-alert__text', 'Your attendee has been added.').should(
      'not.exist'
    );
  });

  it('denies document upload for a TRB lead on the standalone requester upload route', () => {
    loginAs(trbLead);

    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'CreateTRBRequestDocument') {
        req.alias = 'createTrbRequestDocument';
      }
    });

    cy.visit(requestUrls.completed.requesterDocumentUploadHref);
    cy.get('input[name=fileData]').selectFile('cypress/fixtures/test.pdf', {
      force: true
    });
    cy.get('#documentType-ARCHITECTURE_DIAGRAM').check({ force: true });
    cy.contains('button', 'Upload document').should('not.be.disabled');
    cy.contains('button', 'Upload document').click();

    cy.url().should(
      'include',
      requestUrls.completed.requesterDocumentUploadHref
    );
    cy.contains(
      'There was a problem uploading your document. Please try again'
    ).should('be.visible');
    cy.contains(
      '.usa-alert__text',
      'Your document has been uploaded and is being scanned.'
    ).should('not.exist');
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

  it('lets a TRB admin update and unlink request relations from the admin relation form', () => {
    loginAs(admin);

    cy.intercept('POST', '/api/graph/query', req => {
      if (req.body.operationName === 'GetTRBRequestRelation') {
        req.alias = 'getTrbRequestRelation';
      }

      if (req.body.operationName === 'SetTrbRequestRelationExistingService') {
        req.alias = 'setTrbRequestRelationExistingService';
      }

      if (req.body.operationName === 'SetTrbRequestRelationExistingSystem') {
        req.alias = 'setTrbRequestRelationExistingSystem';
      }

      if (req.body.operationName === 'SetTrbRequestRelationNewSystem') {
        req.alias = 'setTrbRequestRelationNewSystem';
      }

      if (req.body.operationName === 'UnlinkTrbRequestRelation') {
        req.alias = 'unlinkTrbRequestRelation';
      }
    });

    cy.visit(requestUrls.relation.adminRelationHref);
    cy.wait('@getTrbRequestRelation')
      .its('response.statusCode')
      .should('eq', 200);

    cy.get('#relationType-existingService').check({ force: true });
    cy.get('#contractName').clear().type('TRB existing service contract');
    cy.contains('button', 'Save changes').click();

    cy.wait('@setTrbRequestRelationExistingService')
      .its('response.body.errors')
      .should('not.exist');
    cy.url().should('include', requestUrls.relation.adminAdditionalInfoHref);

    cy.visit(requestUrls.relation.adminRelationHref);
    cy.wait('@getTrbRequestRelation')
      .its('response.statusCode')
      .should('eq', 200);

    cy.get('#relationType-existingSystem').check({ force: true });
    selectFirstRequestLinkSystem();
    cy.contains('button', 'Save changes').should('not.be.disabled').click();

    cy.wait('@setTrbRequestRelationExistingSystem')
      .its('response.body.errors')
      .should('not.exist');
    cy.url().should('include', requestUrls.relation.adminAdditionalInfoHref);

    cy.visit(requestUrls.relation.adminRelationHref);
    cy.wait('@getTrbRequestRelation')
      .its('response.statusCode')
      .should('eq', 200);

    cy.get('#relationType-newSystem').check({ force: true });
    cy.contains('button', 'Save changes').click();

    cy.wait('@setTrbRequestRelationNewSystem')
      .its('response.body.errors')
      .should('not.exist');
    cy.url().should('include', requestUrls.relation.adminAdditionalInfoHref);

    cy.visit(requestUrls.relation.adminRelationHref);
    cy.wait('@getTrbRequestRelation')
      .its('response.statusCode')
      .should('eq', 200);

    cy.contains('button', 'or, unlink all information').click();
    cy.contains('button', 'Unlink').click();

    cy.wait('@unlinkTrbRequestRelation')
      .its('response.body.errors')
      .should('not.exist');
    cy.url().should('include', requestUrls.relation.adminAdditionalInfoHref);
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
