describe('The Business Case Form', () => {
  let intakeId;
  const systemIntake = {
    status: 'SUBMITTED',
    requester: 'John Requester',
    component: 'Center for Consumer Information and Insurance Oversight',
    businessOwner: 'John BusinessOwner',
    businessOwnerComponent:
      'Center for Consumer Information and Insurance Oversight',
    productManager: 'John ProductManager',
    productManagerComponent:
      'Center for Consumer Information and Insurance Oversight',
    isso: '',
    trbCollaborator: '',
    oitSecurityCollaborator: '',
    eaCollaborator: '',
    projectName: 'Easy Access to System Information',
    existingFunding: false,
    fundingSource: '',
    businessNeed: 'Business Need: The quick brown fox jumps over the lazy dog.',
    solution: 'The quick brown fox jumps over the lazy dog.',
    processStatus: 'The project is already funded',
    eaSupportRequest: false,
    existingContract: 'No',
    grtReviewEmailBody: ''
  };

  const testBusinessCase = {
    status: 'DRAFT',
    systemIntakeId: '048c26ea-07be-4f40-b29e-761fc17bf414',
    requestName: 'Easy Access to System Information',
    requester: {
      name: 'John Requester',
      phoneNumber: '1234567890'
    },
    businessOwner: {
      name: 'John BusinessOwner'
    },
    businessNeed: 'Business Need: The quick brown fox jumps over the lazy dog.',
    cmsBenefit: 'Test CMS benefit',
    priorityAlignment: 'Test priority alignment',
    successIndicators: 'Test success indicators',
    asIsSolution: {
      title: 'Test as is solution',
      summary: 'Test summary',
      pros: 'Test pros',
      cons: 'Test cons',
      estimatedLifecycleCost: {
        year1: [{ phase: 'Development', cost: '0' }],
        year2: [{ phase: 'Development', cost: '0' }],
        year3: [{ phase: 'Development', cost: '0' }],
        year4: [{ phase: 'Development', cost: '0' }],
        year5: [{ phase: 'Development', cost: '0' }]
      },
      costSavings: 'Test cost savings'
    },
    preferredSolution: {
      title: 'Test preferred solution',
      summary: 'Test summary',
      acquisitionApproach: 'Test acquisition approach',
      pros: 'Test pros',
      cons: 'Test cons',
      estimatedLifecycleCost: {
        year1: [{ phase: 'Development', cost: '0' }],
        year2: [{ phase: 'Development', cost: '0' }],
        year3: [{ phase: 'Development', cost: '0' }],
        year4: [{ phase: 'Development', cost: '0' }],
        year5: [{ phase: 'Development', cost: '0' }]
      },
      costSavings: 'Test cost savings',
      hosting: {
        type: 'none',
        location: '',
        cloudServiceType: ''
      },
      hasUserInterface: 'YES'
    },
    alternativeA: {
      title: 'Test alternative a solution',
      summary: 'Test summary',
      acquisitionApproach: 'Test acquisition approach',
      pros: 'Test pros',
      cons: 'Test cons',
      estimatedLifecycleCost: {
        year1: [{ phase: 'Operations and Maintenance', cost: '0' }],
        year2: [{ phase: 'Operations and Maintenance', cost: '0' }],
        year3: [{ phase: 'Operations and Maintenance', cost: '0' }],
        year4: [{ phase: 'Operations and Maintenance', cost: '0' }],
        year5: [{ phase: 'Operations and Maintenance', cost: '0' }]
      },
      costSavings: 'Test cost savings',
      hosting: {
        type: 'cloud',
        location: 'Test location',
        cloudServiceType: 'Test cloud service'
      },
      hasUserInterface: 'YES'
    },
    alternativeB: {
      title: 'Test alternative b solution',
      summary: 'Test summary',
      acquisitionApproach: 'Test acquisition approach',
      pros: 'Test pros',
      cons: 'Test cons',
      estimatedLifecycleCost: {
        year1: [{ phase: 'Development', cost: '0' }],
        year2: [{ phase: 'Development', cost: '0' }],
        year3: [{ phase: 'Development', cost: '0' }],
        year4: [{ phase: 'Development', cost: '0' }],
        year5: [{ phase: 'Development', cost: '0' }]
      },
      costSavings: 'Test cost savings',
      hosting: {
        type: 'none',
        location: '',
        cloudServiceType: ''
      },
      hasUserInterface: 'YES'
    }
  };

  before(() => {
    cy.login();
    cy.wait(1000);
    cy.saveLocalStorage();
    cy.getAccessToken().then(accessToken => {
      cy.request({
        method: 'POST',
        url: Cypress.env('systemIntakeApi'),
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        body: systemIntake
      }).then(response => {
        intakeId = response.body.id;
      });
    });
  });

  beforeEach(() => {
    cy.restoreLocalStorage();

    cy.visit('/');
    cy.get(`[data-intakeid="${intakeId}"]`)
      .get('button')
      .contains('Start my Business Case')
      .click();
  });

  it('fills out minimum required fields', () => {
    // General Request Information
    // Autofilled Fields from System Intake
    cy.get('#BusinessCase-RequestName').should(
      'have.value',
      systemIntake.projectName
    );

    cy.get('#BusinessCase-RequesterName').should(
      'have.value',
      systemIntake.requester
    );

    cy.get('#BusinessCase-BusinessOwnerName').should(
      'have.value',
      systemIntake.businessOwner
    );

    cy.get('#BusinessCase-RequesterPhoneNumber')
      .type(testBusinessCase.requester.phoneNumber)
      .should('have.value', testBusinessCase.requester.phoneNumber);

    cy.contains('button', 'Next').click();

    // Request Description
    // Autofilled Field from System Intake
    cy.get('#BusinessCase-BusinessNeed').should(
      'have.value',
      systemIntake.businessNeed
    );

    cy.get('#BusinessCase-CmsBenefit')
      .type(testBusinessCase.cmsBenefit)
      .should('have.value', testBusinessCase.cmsBenefit);

    cy.get('#BusinessCase-PriorityAlignment')
      .type(testBusinessCase.priorityAlignment)
      .should('have.value', testBusinessCase.priorityAlignment);

    cy.get('#BusinessCase-SuccessIndicators')
      .type(testBusinessCase.successIndicators)
      .should('have.value', testBusinessCase.successIndicators);

    cy.contains('button', 'Next').click();

    // START: As is solution
    cy.get('#BusinessCase-AsIsSolutionTitle')
      .type(testBusinessCase.asIsSolution.title)
      .should('have.value', testBusinessCase.asIsSolution.title);

    cy.get('#BusinessCase-AsIsSolutionSummary')
      .type(testBusinessCase.asIsSolution.summary)
      .should('have.value', testBusinessCase.asIsSolution.summary);

    cy.get('#BusinessCase-AsIsSolutionPros')
      .type(testBusinessCase.asIsSolution.pros)
      .should('have.value', testBusinessCase.asIsSolution.pros);

    cy.get('#BusinessCase-AsIsSolutionCons')
      .type(testBusinessCase.asIsSolution.cons)
      .should('have.value', testBusinessCase.asIsSolution.cons);

    [1, 2, 3, 4, 5].forEach(year => {
      cy.get(
        `#BusinessCase-asIsSolution\\.estimatedLifecycleCost\\.Year${year}\\.Phase0\\.Development`
      )
        .check({ force: true })
        .should('be.checked');

      cy.get(
        `#BusinessCase-asIsSolution\\.estimatedLifecycleCost\\.Year${year}\\.Phase0\\.cost`
      )
        .type('0')
        .should('have.value', '0');
    });

    cy.get('#BusinessCase-AsIsSolutionCostSavings')
      .type(testBusinessCase.asIsSolution.costSavings)
      .should('have.value', testBusinessCase.asIsSolution.costSavings);
    // END: As is solution

    cy.contains('button', 'Next').click();

    // START: Preferred Solution
    cy.get('#BusinessCase-PreferredSolutionTitle')
      .type(testBusinessCase.preferredSolution.title)
      .should('have.value', testBusinessCase.preferredSolution.title);

    cy.get('#BusinessCase-PreferredSolutionSummary')
      .type(testBusinessCase.preferredSolution.summary)
      .should('have.value', testBusinessCase.preferredSolution.summary);

    cy.get('#BusinessCase-PreferredSolutionAcquisitionApproach')
      .type(testBusinessCase.preferredSolution.acquisitionApproach)
      .should(
        'have.value',
        testBusinessCase.preferredSolution.acquisitionApproach
      );

    cy.get('#BusinessCase-PreferredSolutionHostingNone')
      .check({ force: true })
      .should('be.checked');

    cy.get('#BusinessCase-PreferredHasUserInferfaceYes')
      .check({ force: true })
      .should('be.checked');

    cy.get('#BusinessCase-PreferredSolutionPros')
      .type(testBusinessCase.preferredSolution.pros)
      .should('have.value', testBusinessCase.preferredSolution.pros);

    cy.get('#BusinessCase-PreferredSolutionCons')
      .type(testBusinessCase.preferredSolution.cons)
      .should('have.value', testBusinessCase.preferredSolution.cons);

    // Estimated Lifecycle Costs Years 1-3
    [1, 2, 3, 4, 5].forEach(year => {
      cy.get(
        `#BusinessCase-preferredSolution\\.estimatedLifecycleCost\\.Year${year}\\.Phase0\\.opsMaintenance`
      )
        .check({ force: true })
        .should('be.checked');

      cy.get(
        `#BusinessCase-preferredSolution\\.estimatedLifecycleCost\\.Year${year}\\.Phase0\\.cost`
      )
        .type('0')
        .should('have.value', '0');
    });

    cy.get('#BusinessCase-PreferredSolutionCostSavings')
      .type(testBusinessCase.preferredSolution.costSavings)
      .should('have.value', testBusinessCase.preferredSolution.costSavings);
    // END: Preferred Solution

    cy.contains('button', 'Next').click();

    // START: Alternative A
    cy.get('#BusinessCase-alternativeATitle')
      .type(testBusinessCase.alternativeA.title)
      .should('have.value', testBusinessCase.alternativeA.title);

    cy.get('#BusinessCase-alternativeASummary')
      .type(testBusinessCase.alternativeA.summary)
      .should('have.value', testBusinessCase.alternativeA.summary);

    cy.get('#BusinessCase-alternativeAAcquisitionApproach')
      .type(testBusinessCase.alternativeA.acquisitionApproach)
      .should('have.value', testBusinessCase.alternativeA.acquisitionApproach);

    cy.get('#BusinessCase-alternativeAHostingNone')
      .check({ force: true })
      .should('be.checked');

    cy.get('#BusinessCase-alternativeAHasUserInferfaceYes')
      .check({ force: true })
      .should('be.checked');

    cy.get('#BusinessCase-alternativeAPros')
      .type(testBusinessCase.alternativeA.pros)
      .should('have.value', testBusinessCase.alternativeA.pros);

    cy.get('#BusinessCase-alternativeACons')
      .type(testBusinessCase.alternativeA.cons)
      .should('have.value', testBusinessCase.alternativeA.cons);

    // Estimated Lifecycle Costs Years 1-5
    [1, 2, 3, 4, 5].forEach(year => {
      cy.get(
        `#BusinessCase-alternativeA\\.estimatedLifecycleCost\\.Year${year}\\.Phase0\\.Development`
      )
        .check({ force: true })
        .should('be.checked');

      cy.get(
        `#BusinessCase-alternativeA\\.estimatedLifecycleCost\\.Year${year}\\.Phase0\\.cost`
      )
        .type('0')
        .should('have.value', '0');
    });

    cy.get('#BusinessCase-alternativeACostSavings')
      .type(testBusinessCase.alternativeA.costSavings)
      .should('have.value', testBusinessCase.alternativeA.costSavings);
    // END: Alternative A

    cy.contains('button', 'Next').click();

    cy.get('h1').contains('Check your answers before sending');

    const reduxBusinessCase = cy
      .window()
      .its('store')
      .invoke('getState')
      .its('businessCase')
      .its('form');

    reduxBusinessCase.should('deep.equal', {
      ...testBusinessCase,
      id: reduxBusinessCase.id,
      systemIntakeId: reduxBusinessCase.systemIntakeId
    });
  });
});
