import { DateTime } from 'luxon';

cy.emailNotifications = {
  sendEmail: ({ itInvestmentMailbox = false, feedback = true }) => {
    // Requester
    cy.get('input#ABCD-Requester').should('be.checked');
    // IT Governance
    cy.get('input#contact-itGovernanceMailbox').should('be.checked');
    // IT Investment
    if (itInvestmentMailbox) {
      cy.get('input#contact-itInvestmentMailbox').should('be.checked');
    }
    // Feedback field
    if (feedback) {
      cy.get('textarea[name="feedback"]').type('Test email');
    }
    // Submit form
    cy.contains('button', 'Complete action and send email').click();
  },
  fillIssueLCIDFields: LCID => {
    // Issue existing LCID
    cy.get('#IssueLifecycleIdForm-NewLifecycleIdNo').check({ force: true });
    cy.get('#IssueLifecycleIdForm-LifecycleId').type(LCID);

    // LCID expiration date
    const futureDate = DateTime.local().plus({ year: 1 });
    cy.get('#IssueLifecycleIdForm-ExpirationDateMonth').type(
      futureDate.month.toString()
    );
    cy.get('#IssueLifecycleIdForm-ExpirationDateDay').type(
      futureDate.day.toString()
    );
    cy.get('#IssueLifecycleIdForm-ExpirationDateYear').type(
      futureDate.year.toString()
    );

    cy.get('#IssueLifecycleIdForm-Scope').type('Scope of Lifecycle ID');
    cy.get('#IssueLifecycleIdForm-NextSteps').type('Next steps in process');
  },
  fillExtendLCIDFields: () => {
    // LCID expiration date
    const futureDate = DateTime.local().plus({ year: 1 });
    cy.get('#ExtendLifecycleId-expirationDateMonth').type(
      futureDate.month.toString()
    );
    cy.get('#ExtendLifecycleId-expirationDateDay').type(
      futureDate.day.toString()
    );
    cy.get('#ExtendLifecycleId-expirationDateYear').type(
      futureDate.year.toString()
    );

    cy.get('#ExtendLifecycleIdForm-Scope').type('Scope of Lifecycle ID');
    cy.get('#ExtendLifecycleIdForm-NextSteps').type('Next steps in process');
  }
};
