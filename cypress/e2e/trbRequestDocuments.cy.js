describe.skip('Technical Assistance Request Documents', () => {
  it('can upload and then delete a document', () => {
    cy.localLogin({ name: 'E2E1' });

    cy.contains('a', 'Technical Assistance').click();
    cy.contains('a', 'Start a new request').click();
    cy.contains('a', /^Start$/).click();
    cy.contains('button', 'Continue').click();
    cy.contains(
      '[data-testid="fill-out-the-initial-request-form"] a',
      'Start'
    ).click();

    cy.trbRequest.basicDetails.fillRequiredFields();
    cy.contains('button', 'Next').click();

    cy.contains('.usa-step-indicator__heading-text', 'Subject areas').should(
      'be.visible'
    );

    cy.contains('.usa-step-indicator__segment-label', 'Attendees').click();
    cy.trbRequest.attendees.fillRequiredFields({
      component: 'CMS Wide',
      role: 'PRODUCT_OWNER'
    });
    cy.contains('button', 'Continue without adding attendees').click();

    cy.contains(
      '.usa-step-indicator__segment-label',
      'Supporting documents'
    ).click();

    cy.contains('a', 'Add a document').click();
    cy.contains('h1', 'Upload a document').should('be.visible');
    cy.get('input[name=fileData]').selectFile('cypress/fixtures/test.pdf');
    cy.get('#documentType-ARCHITECTURE_DIAGRAM').check({ force: true });
    cy.contains('button', 'Upload document').click();

    cy.contains(
      '.usa-alert__text',
      'Your document has been uploaded and is being scanned.'
    ).should('be.visible');
    cy.contains('td', 'test.pdf').as('fileItem').should('be.visible');
    cy.contains('td', 'Virus scan in progress...').should('be.visible');

    // Mark file as passing virus scan
    cy.get('[data-testurl]').within(el => {
      const url = el.attr('data-testurl');
      // console.log('url', url);
      const filepath = url.match(/(\/easi-app-file-uploads\/[^?]*)/)[1];
      cy.exec(`scripts/tag_minio_file ${filepath} CLEAN`);
    });

    cy.reload();

    // Delete it
    cy.get('@fileItem').should('be.visible');
    cy.contains('button', 'Remove').click();
    cy.get('@fileItem').should('not.exist');
  });
});
