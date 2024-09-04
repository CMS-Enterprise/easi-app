import testSystemIntakeName from './systemIntake';

cy.trbRequest = {
  basicDetails: {
    fillRequiredFields: () => {
      cy.get('[name=name]').clear().type(testSystemIntakeName);
      cy.get('[name=component]').select(
        'Center for Medicaid and CHIP Services'
      );
      cy.get('[name=needsAssistanceWith]').type('Assistance');
      cy.get('#hasSolutionInMind-no').check({ force: true });
      cy.get('[name=whereInProcess]').select(
        'I_HAVE_AN_IDEA_AND_WANT_TO_BRAINSTORM'
      );
      cy.get('#hasExpectedStartEndDates-no').check({ force: true });
      cy.get('#systemIntakes').within(() => {
        cy.get("input[type='text']").click({ force: true });
      });
      cy.get('#react-select-2-option-0')
        .check({ force: true })
        .should('be.checked');
      cy.clickOutside();
      cy.get('#collabGroups-Security').check({ force: true });
      cy.get('[name=collabDateSecurity]').type('October/November 2022');
    }
  },
  attendees: {
    fillRequiredFields: attendee => {
      if (attendee.userInfo && !attendee.id) {
        const { commonName, euaUserId } = attendee.userInfo;

        const nameAndId = `${commonName}, ${euaUserId}`;
        cy.get('#react-select-euaUserId-input').type(nameAndId);

        // Wait to see if the first option is what we expect it to be
        cy.contains('#react-select-euaUserId-option-0', nameAndId);

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
