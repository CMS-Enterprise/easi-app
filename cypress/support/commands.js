// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import { DateTime } from 'luxon';

import 'cypress-file-upload';

/** Get an element by data-testid attribute */
Cypress.Commands.add('getByTestId', (testId, options = {}) =>
  cy.get(`[data-testid="${testId}"]`, options)
);

const getMinioUploadPathFromUrl = url => {
  const match = url?.match(/(\/easi-app-file-uploads\/[^?]*)/);

  if (!match) {
    throw new Error(`Unable to determine MinIO upload path from URL: ${url}`);
  }

  return match[1];
};

const GET_TRB_REQUEST_DOCUMENT_URLS_QUERY = `
  query GetTRBRequestDocumentUrls($id: UUID!) {
    trbRequest(id: $id) {
      id
      documents {
        id
        url
        fileName
      }
    }
  }
`;

const listMinioUploads = () =>
  cy
    .exec('/mc --no-color --json ls -r local/easi-app-file-uploads')
    .then(({ stdout }) => {
      const trimmed = stdout.trim();

      if (!trimmed) {
        return [];
      }

      return trimmed
        .split('\n')
        .filter(Boolean)
        .map(line => JSON.parse(line))
        .filter(item => item.type === 'file');
    });

Cypress.Commands.add('getLatestMinioUploadKey', () =>
  listMinioUploads().then(files => {
    const latestFile = [...files].sort(
      (a, b) =>
        new Date(b.lastModified).valueOf() - new Date(a.lastModified).valueOf()
    )[0];

    return latestFile?.key || null;
  })
);

Cypress.Commands.add('markMinioUploadAsCleanByUrl', url =>
  cy.exec(`scripts/tag_minio_file ${getMinioUploadPathFromUrl(url)} CLEAN`)
);

Cypress.Commands.add(
  'getTrbRequestDocumentUrl',
  (requestID, documentID, attempt = 0) =>
    cy
      .request('POST', '/api/graph/query', {
        operationName: 'GetTRBRequestDocumentUrls',
        query: GET_TRB_REQUEST_DOCUMENT_URLS_QUERY,
        variables: { id: requestID }
      })
      .then(({ body }) => {
        if (body?.errors?.length) {
          throw new Error(body.errors[0].message);
        }

        const document = body?.data?.trbRequest?.documents?.find(
          item => item.id === documentID
        );

        if (document?.url) {
          return document.url;
        }

        if (attempt >= 10) {
          throw new Error(
            `TRB request document URL for ${documentID} was not available after ${
              attempt + 1
            } attempts`
          );
        }

        return cy
          .wait(500)
          .then(() =>
            cy.getTrbRequestDocumentUrl(requestID, documentID, attempt + 1)
          );
      })
);

Cypress.Commands.add(
  'markNewMinioUploadAsClean',
  ({ previousKey = null, attempt = 0 } = {}) =>
    listMinioUploads().then(files => {
      const latestFile = [...files].sort(
        (a, b) =>
          new Date(b.lastModified).valueOf() -
          new Date(a.lastModified).valueOf()
      )[0];

      if (!latestFile || (previousKey && latestFile.key === previousKey)) {
        if (attempt >= 10) {
          throw new Error(
            `A new MinIO upload was not available after ${attempt + 1} attempts`
          );
        }

        return cy.wait(500).then(() =>
          cy.markNewMinioUploadAsClean({
            previousKey,
            attempt: attempt + 1
          })
        );
      }

      return cy.exec(
        `scripts/tag_minio_file /easi-app-file-uploads/${latestFile.key} CLEAN`
      );
    })
);

/**
 * Returns a date string in MM/dd/yyyy format
 *
 * Accepts an options object with years, months, and days to adjust the date
 *
 * Ex: cy.getDateString({ years: 1, months: 0, days: 0 }) returns date one year in future
 */
Cypress.Commands.add(
  'getDateString',
  ({ years, months = 0, days = 0 } = {}) => {
    const date = DateTime.now().plus({ years, months, days });
    const formatted = date.toFormat('MM/dd/yyyy');
    return cy.wrap(formatted);
  }
);
