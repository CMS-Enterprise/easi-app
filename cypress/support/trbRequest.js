cy.trbRequest = {
  basicDetails: {
    fillRequiredFields: () => {
      cy.get('[name=name]').clear().type('Test Request Name');
      cy.get('[name=component]').select(
        'Center for Medicaid and CHIP Services'
      );
      cy.get('[name=needsAssistanceWith]').type('Assistance');
      cy.get('#hasSolutionInMind-no').check({ force: true });
      cy.get('[name=whereInProcess]').select(
        'I_HAVE_AN_IDEA_AND_WANT_TO_BRAINSTORM'
      );
      cy.get('#hasExpectedStartEndDates-no').check({ force: true });
      cy.get('#collabGroups-Security').check({ force: true });
      cy.get('[name=collabDateSecurity]').type('October/November 2022');
    }
  },
  attendees: {
    fillRequiredFields: attendee => {
      if (attendee.userInfo && !attendee.id) {
        const { commonName, euaUserId } = attendee.userInfo;
        cy.get('#react-select-euaUserId-input').type(
          `${commonName}, ${euaUserId}`
        );

        // Wait for cedar contacts query to complete
        cy.wait('@getCedarContacts')
          .its('response.statusCode')
          .should('eq', 200);

        cy.get('#react-select-euaUserId-input')
          .type('{downarrow}{enter}')
          .should('have.value', `${commonName}, ${euaUserId}`);
      }

      if (attendee.component) {
        cy.get('#component')
          .select(attendee.component)
          .should('have.value', attendee.component);
      }

      if (attendee.role) {
        cy.get('#role')
          .select(attendee.role)
          .should('have.value', attendee.role);
      }
    }
  }
};
