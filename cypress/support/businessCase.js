cy.businessCase = {
  generalRequestInfo: {
    fillNonBranchingFields: () => {
      cy.get('#BusinessCase-RequestName')
        .type('Easy Access to System Information')
        .should('have.value', 'Easy Access to System Information');

      cy.get('#BusinessCase-RequesterName')
        .type('Casey Doe')
        .should('have.value', 'Casey Doe');

      cy.get('#BusinessCase-BusinessOwnerName')
        .type('Casey Doe')
        .should('have.value', 'Casey Doe');

      cy.get('#BusinessCase-RequesterPhoneNumber')
        .type('1234567890')
        .should('have.value', '1234567890');
    }
  },
  requestDescription: {
    fillNonBranchingFields: () => {
      cy.get('#BusinessCase-BusinessNeed')
        .type('The quick brown fox jumps over the lazy dog.')
        .should('have.value', 'The quick brown fox jumps over the lazy dog.');

      cy.get('#BusinessCase-CmsBenefit')
        .type('The quick brown fox jumps over the lazy dog.')
        .should('have.value', 'The quick brown fox jumps over the lazy dog.');

      cy.get('#BusinessCase-PriorityAlignment')
        .type('The quick brown fox jumps over the lazy dog.')
        .should('have.value', 'The quick brown fox jumps over the lazy dog.');

      cy.get('#BusinessCase-SuccessIndicators')
        .type('The quick brown fox jumps over the lazy dog.')
        .should('have.value', 'The quick brown fox jumps over the lazy dog.');
    }
  },
  asIsSolution: {
    fillNonBranchingFields: () => {
      cy.get('#BusinessCase-AsIsSolutionTitle')
        .type('Test As is Solution')
        .should('have.value', 'Test As is Solution');

      cy.get('#BusinessCase-AsIsSolutionSummary')
        .type('As is Solution Summary')
        .should('have.value', 'As is Solution Summary');

      cy.get('#BusinessCase-AsIsSolutionPros')
        .type('As is Solution Pros')
        .should('have.value', 'As is Solution Pros');

      cy.get('#BusinessCase-AsIsSolutionCons')
        .type('As is Solution Cons')
        .should('have.value', 'As is Solution Cons');

      // Estimated Lifecycle Costs Years 1
      cy.get(
        `#BusinessCase-asIsSolution\\.estimatedLifecycleCost\\.Year1\\.development\\.isPresent`
      )
        .check({ force: true })
        .should('be.checked');

      cy.get(
        `#BusinessCase-asIsSolution\\.estimatedLifecycleCost\\.Year1\\.development\\.cost`
      )
        .type('1')
        .should('have.value', '1');

      cy.get(
        `#BusinessCase-asIsSolution\\.estimatedLifecycleCost\\.Year1\\.operationsMaintenance\\.isPresent`
      )
        .check({ force: true })
        .should('be.checked');

      cy.get(
        `#BusinessCase-asIsSolution\\.estimatedLifecycleCost\\.Year1\\.operationsMaintenance\\.cost`
      )
        .type('5')
        .should('have.value', '5');

      // Estimated Lifecycle Costs Years 2
      cy.get(
        `#BusinessCase-asIsSolution\\.estimatedLifecycleCost\\.Year2\\.operationsMaintenance\\.isPresent`
      )
        .check({ force: true })
        .should('be.checked');

      cy.get(
        `#BusinessCase-asIsSolution\\.estimatedLifecycleCost\\.Year2\\.operationsMaintenance\\.cost`
      )
        .type('5')
        .should('have.value', '5');

      // Estimated Lifecycle Costs Years 3
      cy.get(
        `#BusinessCase-asIsSolution\\.estimatedLifecycleCost\\.Year3\\.other\\.isPresent`
      )
        .check({ force: true })
        .should('be.checked');

      cy.get(
        `#BusinessCase-asIsSolution\\.estimatedLifecycleCost\\.Year3\\.other\\.cost`
      )
        .type('10')
        .should('have.value', '10');

      // Estimated Lifecycle Costs Years 4
      cy.get(
        `#BusinessCase-asIsSolution\\.estimatedLifecycleCost\\.Year4\\.development\\.isPresent`
      )
        .check({ force: true })
        .should('be.checked');

      cy.get(
        `#BusinessCase-asIsSolution\\.estimatedLifecycleCost\\.Year4\\.development\\.cost`
      )
        .type('15')
        .should('have.value', '15');

      // Estimated Lifecycle Costs Years 5
      cy.get(
        `#BusinessCase-asIsSolution\\.estimatedLifecycleCost\\.Year5\\.other\\.isPresent`
      )
        .check({ force: true })
        .should('be.checked');

      cy.get(
        `#BusinessCase-asIsSolution\\.estimatedLifecycleCost\\.Year5\\.other\\.cost`
      )
        .type('15')
        .should('have.value', '15');

      cy.get('#BusinessCase-AsIsSolutionCostSavings')
        .type('As is Solution Cost Savings')
        .should('have.value', 'As is Solution Cost Savings');
    }
  },
  preferredSolution: {
    fillAllFields: () => {
      cy.get('#BusinessCase-PreferredSolutionTitle')
        .type('Preferred Solution Title')
        .should('have.value', 'Preferred Solution Title');

      cy.get('#BusinessCase-PreferredSolutionSummary')
        .type('Preferred Solution Summary')
        .should('have.value', 'Preferred Solution Summary');

      cy.get('#BusinessCase-PreferredSolutionAcquisitionApproach')
        .type('Preferred Solution Acquisition approach')
        .should('have.value', 'Preferred Solution Acquisition approach');

      cy.get('#BusinessCase-PreferredSolutionSecurityNotApproved')
        .check({ force: true })
        .should('be.checked');

      cy.get('#BusinessCase-PreferredSolutionSecurityIsBeingReviewedYes')
        .check({ force: true })
        .should('be.checked');

      cy.get('#BusinessCase-PreferredSolutionHostingCloud')
        .check({ force: true })
        .should('be.checked');

      cy.get('#BusinessCase-PreferredSolutionCloudLocation')
        .type('AWS')
        .should('have.value', 'AWS');

      cy.get('#BusinessCase-PreferredSolutionCloudServiceType')
        .type('Saas')
        .should('have.value', 'Saas');

      cy.get('#BusinessCase-PreferredHasUserInferfaceYes')
        .check({ force: true })
        .should('be.checked');

      cy.get('#BusinessCase-PreferredSolutionPros')
        .type('Preferred Solution Pros')
        .should('have.value', 'Preferred Solution Pros');

      cy.get('#BusinessCase-PreferredSolutionCons')
        .type('Preferred Solution Cons')
        .should('have.value', 'Preferred Solution Cons');

      // Estimated Lifecycle Costs Year 1
      cy.get(
        `#BusinessCase-preferredSolution\\.estimatedLifecycleCost\\.Year1\\.operationsMaintenance\\.isPresent`
      )
        .check({ force: true })
        .should('be.checked');

      cy.get(
        `#BusinessCase-preferredSolution\\.estimatedLifecycleCost\\.Year1\\.operationsMaintenance\\.cost`
      )
        .type('5')
        .should('have.value', '5');

      // Estimated Lifecycle Costs Year 2
      cy.get(
        `#BusinessCase-preferredSolution\\.estimatedLifecycleCost\\.Year2\\.development\\.isPresent`
      )
        .check({ force: true })
        .should('be.checked');

      cy.get(
        `#BusinessCase-preferredSolution\\.estimatedLifecycleCost\\.Year2\\.development\\.cost`
      )
        .type('10')
        .should('have.value', '10');

      // Estimated Lifecycle Costs Year 3
      cy.get(
        `#BusinessCase-preferredSolution\\.estimatedLifecycleCost\\.Year3\\.other\\.isPresent`
      )
        .check({ force: true })
        .should('be.checked');

      cy.get(
        `#BusinessCase-preferredSolution\\.estimatedLifecycleCost\\.Year3\\.other\\.cost`
      )
        .type('15')
        .should('have.value', '15');

      // Estimated Lifecycle Costs Year 4
      cy.get(
        `#BusinessCase-preferredSolution\\.estimatedLifecycleCost\\.Year4\\.operationsMaintenance\\.isPresent`
      )
        .check({ force: true })
        .should('be.checked');

      cy.get(
        `#BusinessCase-preferredSolution\\.estimatedLifecycleCost\\.Year4\\.operationsMaintenance\\.cost`
      )
        .type('20')
        .should('have.value', '20');

      // Estimated Lifecycle Costs Year 5
      cy.get(
        `#BusinessCase-preferredSolution\\.estimatedLifecycleCost\\.Year5\\.development\\.isPresent`
      )
        .check({ force: true })
        .should('be.checked');

      cy.get(
        `#BusinessCase-preferredSolution\\.estimatedLifecycleCost\\.Year5\\.development\\.cost`
      )
        .type('25')
        .should('have.value', '25');

      cy.get('#BusinessCase-PreferredSolutionCostSavings')
        .type('0')
        .should('have.value', '0');
    }
  },
  alternativeASolution: {
    fillAllFields: () => {
      cy.get('#BusinessCase-alternativeATitle')
        .type('Alternative A Title')
        .should('have.value', 'Alternative A Title');

      cy.get('#BusinessCase-alternativeASummary')
        .type('Alternative A Summary')
        .should('have.value', 'Alternative A Summary');

      cy.get('#BusinessCase-alternativeAAcquisitionApproach')
        .type('Alternative A AcquisitionApproach')
        .should('have.value', 'Alternative A AcquisitionApproach');

      cy.get('#BusinessCase-alternativeASecurityNotApproved')
        .check({ force: true })
        .should('be.checked');

      cy.get('#BusinessCase-alternativeASecurityIsBeingReviewedYed')
        .check({ force: true })
        .should('be.checked');

      cy.get('#BusinessCase-alternativeAHostingCloud')
        .check({ force: true })
        .should('be.checked');

      cy.get('#BusinessCase-alternativeACloudLocation')
        .type('AWS')
        .should('have.value', 'AWS');

      cy.get('#BusinessCase-alternativeACloudServiceType')
        .type('Saas')
        .should('have.value', 'Saas');

      cy.get('#BusinessCase-alternativeAHasUserInferfaceYes')
        .check({ force: true })
        .should('be.checked');

      cy.get('#BusinessCase-alternativeAPros')
        .type('Alternative A Pros')
        .should('have.value', 'Alternative A Pros');

      cy.get('#BusinessCase-alternativeACons')
        .type('Alternative A Cons')
        .should('have.value', 'Alternative A Cons');

      // Estimated Lifecycle Costs Years 1
      cy.get(
        `#BusinessCase-alternativeA\\.estimatedLifecycleCost\\.Year1\\.development\\.isPresent`
      )
        .check({ force: true })
        .should('be.checked');

      cy.get(
        `#BusinessCase-alternativeA\\.estimatedLifecycleCost\\.Year1\\.development\\.cost`
      )
        .type('2')
        .should('have.value', '2');

      cy.get(
        `#BusinessCase-alternativeA\\.estimatedLifecycleCost\\.Year1\\.other\\.isPresent`
      )
        .check({ force: true })
        .should('be.checked');

      cy.get(
        `#BusinessCase-alternativeA\\.estimatedLifecycleCost\\.Year1\\.other\\.cost`
      )
        .type('4')
        .should('have.value', '4');

      // Estimated Lifecycle Costs Years 2
      cy.get(
        `#BusinessCase-alternativeA\\.estimatedLifecycleCost\\.Year2\\.operationsMaintenance\\.isPresent`
      )
        .check({ force: true })
        .should('be.checked');

      cy.get(
        `#BusinessCase-alternativeA\\.estimatedLifecycleCost\\.Year2\\.operationsMaintenance\\.cost`
      )
        .type('6')
        .should('have.value', '6');

      // Estimated Lifecycle Costs Years 3
      cy.get(
        `#BusinessCase-alternativeA\\.estimatedLifecycleCost\\.Year3\\.other\\.isPresent`
      )
        .check({ force: true })
        .should('be.checked');

      cy.get(
        `#BusinessCase-alternativeA\\.estimatedLifecycleCost\\.Year3\\.other\\.cost`
      )
        .type('8')
        .should('have.value', '8');

      // Estimated Lifecycle Costs Years 4
      cy.get(
        `#BusinessCase-alternativeA\\.estimatedLifecycleCost\\.Year4\\.operationsMaintenance\\.isPresent`
      )
        .check({ force: true })
        .should('be.checked');

      cy.get(
        `#BusinessCase-alternativeA\\.estimatedLifecycleCost\\.Year4\\.operationsMaintenance\\.cost`
      )
        .type('10')
        .should('have.value', '10');

      // Estimated Lifecycle Costs Years 5
      cy.get(
        `#BusinessCase-alternativeA\\.estimatedLifecycleCost\\.Year5\\.development\\.isPresent`
      )
        .check({ force: true })
        .should('be.checked');

      cy.get(
        `#BusinessCase-alternativeA\\.estimatedLifecycleCost\\.Year5\\.development\\.cost`
      )
        .type('12')
        .should('have.value', '12');

      cy.get('#BusinessCase-alternativeACostSavings')
        .type('Alternative A Cost Savings')
        .should('have.value', 'Alternative A Cost Savings');
    }
  },
  alternativeBSolution: {}
};
