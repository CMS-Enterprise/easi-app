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

Cypress.Commands.add('markMinioUploadAsCleanByUrl', url =>
  cy.exec(`scripts/tag_minio_file ${getMinioUploadPathFromUrl(url)} CLEAN`)
);

const getGraphQLAuthHeader = () =>
  cy.window({ log: false }).then(win => {
    const localAuth = win.localStorage.getItem('dev-user-config');
    if (localAuth) {
      try {
        if (JSON.parse(localAuth).favorLocalAuth) {
          return `Local ${localAuth}`;
        }
      } catch (_error) {
        // Fall through and try other auth sources if local storage is malformed.
      }
    }

    const oktaTokenStorage = win.localStorage.getItem('okta-token-storage');
    if (oktaTokenStorage) {
      try {
        const parsed = JSON.parse(oktaTokenStorage);
        const accessToken = parsed?.accessToken?.accessToken;
        if (accessToken) {
          return `Bearer ${accessToken}`;
        }
      } catch (_error) {
        // Fall through so the caller can fail with a clearer auth error.
      }
    }

    return null;
  });

const getTrbRequestDocumentUrlsQuery = `
  query GetTRBRequestDocumentUrls($id: UUID!) {
    trbRequest(id: $id) {
      id
      documents {
        id
        fileName
        url
      }
    }
  }
`;

Cypress.Commands.add('markTrbRequestDocumentAsClean', (requestId, fileName) =>
  getGraphQLAuthHeader().then(authHeader => {
    expect(
      authHeader,
      'GraphQL auth header for marking TRB request documents as clean'
    ).to.not.equal(null);

    return cy
      .request({
        method: 'POST',
        url: '/api/graph/query',
        headers: {
          Authorization: authHeader
        },
        body: {
          operationName: 'GetTRBRequestDocumentUrls',
          query: getTrbRequestDocumentUrlsQuery,
          variables: {
            id: requestId
          }
        }
      })
      .then(({ body }) => {
        expect(body?.errors).to.eq(undefined);

        const document = body?.data?.trbRequest?.documents?.find(
          item => item.fileName === fileName
        );

        expect(document, `TRB document named "${fileName}"`).to.not.equal(
          undefined
        );
        expect(document.url).to.include('/easi-app-file-uploads/');

        return cy.markMinioUploadAsCleanByUrl(document.url);
      });
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
