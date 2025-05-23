describe('The Business Case Form', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'E2E1' });
  });

  it('fills out all Business Case fields', () => {
    cy.visit('/');
    cy.get('.requests-table')
      .contains('a', 'Easy Access to System Information')
      .click();
    cy.contains('h1', 'Governance task list');

    cy.get('li[data-testid="prepare-a-draft-business-case"]')
      .contains('button', 'Start')
      .click();

    // General Request Information
    // Autofilled Fields from System Intake
    cy.get('#BusinessCase-RequestName').should(
      'have.value',
      'Easy Access to System Information'
    );

    cy.get('#BusinessCase-RequesterName').should('have.value', 'EndToEnd One');

    cy.get('#BusinessCase-BusinessOwnerName').should(
      'have.value',
      'John BusinessOwner'
    );

    cy.get('#BusinessCase-RequesterPhoneNumber')
      .type('1234567890')
      .should('have.value', '1234567890');

    cy.contains('button', 'Next').click();

    // Request Description
    // Autofilled Field from System Intake
    cy.get('#BusinessCase-BusinessNeed').should(
      'have.value',
      'Business Need: The quick brown fox jumps over the lazy dog.'
    );

    cy.get('#BusinessCase-CurrentSolutionSummary')
      .type(
        'Current Solution Summary: The quick brown fox jumps over the lazy dog.'
      )
      .should(
        'have.value',
        'Current Solution Summary: The quick brown fox jumps over the lazy dog.'
      );

    cy.get('#BusinessCase-CmsBenefit')
      .type('CMS Benefit: The quick brown fox jumps over the lazy dog.')
      .should(
        'have.value',
        'CMS Benefit: The quick brown fox jumps over the lazy dog.'
      );

    cy.get('#BusinessCase-PriorityAlignment')
      .type('Priority Alignment: The quick brown fox jumps over the lazy dog.')
      .should(
        'have.value',
        'Priority Alignment: The quick brown fox jumps over the lazy dog.'
      );

    cy.get('#BusinessCase-SuccessIndicators')
      .type('Success Indicators: The quick brown fox jumps over the lazy dog.')
      .should(
        'have.value',
        'Success Indicators: The quick brown fox jumps over the lazy dog.'
      );

    cy.contains('button', 'Next').click();

    cy.contains('h1', 'Options and alternatives');

    cy.contains('button', 'Add preferred solution').click();

    cy.businessCase.preferredSolution.fillAllFields();

    cy.contains('button', 'Finish preferred solution').click();

    cy.contains('h1', 'Options and alternatives');

    cy.contains('button', 'Add alternative A').click();

    cy.businessCase.alternativeASolution.fillAllFields();

    cy.contains('button', 'Finish alternative A').click();

    cy.contains('h1', 'Options and alternatives');

    cy.contains('button', 'Next').click();

    cy.get('h1').contains('Check your answers before sending');
    cy.window()
      .its('store')
      .invoke('getState')
      .its('businessCase')
      .its('form')
      .should('deep.include', {
        requestName: 'Easy Access to System Information',
        requester: {
          name: 'EndToEnd One',
          phoneNumber: '1234567890'
        },
        businessOwner: {
          name: 'John BusinessOwner'
        },
        businessNeed:
          'Business Need: The quick brown fox jumps over the lazy dog.',
        currentSolutionSummary:
          'Current Solution Summary: The quick brown fox jumps over the lazy dog.',
        cmsBenefit: 'CMS Benefit: The quick brown fox jumps over the lazy dog.',
        priorityAlignment:
          'Priority Alignment: The quick brown fox jumps over the lazy dog.',
        successIndicators:
          'Success Indicators: The quick brown fox jumps over the lazy dog.',
        preferredSolution: {
          title: 'Preferred Solution Title',
          summary: 'Preferred Solution Summary',
          acquisitionApproach: 'Preferred Solution Acquisition approach',
          security: {
            isApproved: false,
            isBeingReviewed: 'YES'
          },
          hosting: {
            cloudServiceType: 'Saas',
            location: 'AWS',
            type: 'cloud'
          },
          hasUserInterface: 'YES',
          pros: 'Preferred Solution Pros',
          cons: 'Preferred Solution Cons',
          estimatedLifecycleCost: {
            development: {
              label: 'Development',
              type: 'primary',
              isPresent: true,
              years: {
                year1: '',
                year2: '10',
                year3: '',
                year4: '',
                year5: '25'
              }
            },
            operationsMaintenance: {
              label: 'Operations and Maintenance',
              type: 'primary',
              isPresent: true,
              years: {
                year1: '5',
                year2: '',
                year3: '',
                year4: '20',
                year5: ''
              }
            },
            helpDesk: {
              label: 'Help desk/call center',
              type: 'related',
              isPresent: false,
              years: {
                year1: '',
                year2: '',
                year3: '',
                year4: '',
                year5: ''
              }
            },
            software: {
              label: 'Software licenses',
              type: 'related',
              isPresent: false,
              years: {
                year1: '',
                year2: '',
                year3: '',
                year4: '',
                year5: ''
              }
            },
            planning: {
              label: 'Planning, support, and professional services',
              type: 'related',
              isPresent: false,
              years: {
                year1: '',
                year2: '',
                year3: '',
                year4: '',
                year5: ''
              }
            },
            infrastructure: {
              label: 'Infrastructure',
              type: 'related',
              isPresent: false,
              years: {
                year1: '',
                year2: '',
                year3: '',
                year4: '',
                year5: ''
              }
            },
            oit: {
              label: 'OIT services, tools, and pilots',
              type: 'related',
              isPresent: false,
              years: {
                year1: '',
                year2: '',
                year3: '',
                year4: '',
                year5: ''
              }
            },
            other: {
              label: 'Other services, tools, and pilots',
              type: 'related',
              isPresent: false,
              years: {
                year1: '',
                year2: '',
                year3: '',
                year4: '',
                year5: ''
              }
            }
          },
          costSavings: '0'
        },
        alternativeA: {
          title: 'Alternative A Title',
          summary: 'Alternative A Summary',
          acquisitionApproach: 'Alternative A AcquisitionApproach',
          security: {
            isApproved: false,
            isBeingReviewed: 'YES'
          },
          hosting: {
            cloudServiceType: 'Saas',
            location: 'AWS',
            type: 'cloud'
          },
          hasUserInterface: 'YES',
          pros: 'Alternative A Pros',
          cons: 'Alternative A Cons',
          estimatedLifecycleCost: {
            development: {
              label: 'Development',
              type: 'primary',
              isPresent: true,
              years: {
                year1: '2',
                year2: '',
                year3: '',
                year4: '',
                year5: '12'
              }
            },
            operationsMaintenance: {
              label: 'Operations and Maintenance',
              type: 'primary',
              isPresent: true,
              years: {
                year1: '',
                year2: '6',
                year3: '',
                year4: '10',
                year5: ''
              }
            },
            helpDesk: {
              label: 'Help desk/call center',
              type: 'related',
              isPresent: false,
              years: {
                year1: '',
                year2: '',
                year3: '',
                year4: '',
                year5: ''
              }
            },
            software: {
              label: 'Software licenses',
              type: 'related',
              isPresent: false,
              years: {
                year1: '',
                year2: '',
                year3: '',
                year4: '',
                year5: ''
              }
            },
            planning: {
              label: 'Planning, support, and professional services',
              type: 'related',
              isPresent: false,
              years: {
                year1: '',
                year2: '',
                year3: '',
                year4: '',
                year5: ''
              }
            },
            infrastructure: {
              label: 'Infrastructure',
              type: 'related',
              isPresent: false,
              years: {
                year1: '',
                year2: '',
                year3: '',
                year4: '',
                year5: ''
              }
            },
            oit: {
              label: 'OIT services, tools, and pilots',
              type: 'related',
              isPresent: false,
              years: {
                year1: '',
                year2: '',
                year3: '',
                year4: '',
                year5: ''
              }
            },
            other: {
              label: 'Other services, tools, and pilots',
              type: 'related',
              isPresent: false,
              years: {
                year1: '',
                year2: '',
                year3: '',
                year4: '',
                year5: ''
              }
            }
          },
          costSavings: 'Alternative A Cost Savings'
        }
      });
  });
});
