cy.accessibility = {
  addAndRemoveDocument: () => {
    cy.get('[data-testid="upload-new-document"]').click();
    cy.contains('h1', 'Upload a document to');

    // select document
    cy.get('[data-testid="file-upload-input"]').attachFile('test.pdf');

    // enter the document type
    cy.contains('.usa-radio', 'Awarded VPAT')
      .find('input')
      .check({ force: true });

    // click upload button
    cy.get('[data-testid="upload-document"]').click();

    cy.contains('.usa-alert', 'test.pdf uploaded to');
    // verify that the document is in the list

    cy.get('[data-testid="accessibility-documents-list"] tbody tr')
      .should('have.length', 1)
      .first()
      .within(row => {
        cy.contains('Awarded VPAT');
        cy.contains('Virus scan in progress...');

        const url = row.attr('data-testurl');
        const path = new URL(url).pathname;

        // Mark file as passing virus scan
        cy.exec(`scripts/tag_minio_file ${path} CLEAN`);
      });

    cy.reload();

    // view document
    cy.get('[data-testid="accessibility-documents-list"] tbody tr')
      .first()
      .within(() => {
        cy.get('[data-testid="view-document"]').should('exist');

        // remove document
        cy.get('[data-testid="remove-document"]').click();
      });

    cy.get('[data-testid="remove-document-confirm"]').click();

    // no documents are listed
    cy.contains('.usa-alert--success', 'Awarded VPAT removed from TACO');
  }
};
