import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  businessOwner,
  getSystemIntakeContactsQuery,
  systemIntake
} from 'tests/mock/systemIntake';

import { BusinessCaseModel } from 'types/businessCase';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import BusinessCaseReview from './index';

window.matchMedia = (): any => ({
  addListener: () => {},
  removeListener: () => {}
});

describe('The Business Case Review Component', () => {
  const businessCase: BusinessCaseModel = {
    status: 'OPEN',
    createdAt: '2021-06-10T19:22:40Z',
    updatedAt: '2021-06-11T19:22:40Z',
    systemIntakeId: systemIntake.id,
    requestName: 'EASi Test',
    projectAcronym: 'EASi',
    requester: {
      name: 'Jane Smith',
      phoneNumber: '1234567890'
    },
    businessOwner: {
      name: businessOwner.userAccount.commonName
    },
    businessNeed: 'Test business need',
    collaborationNeeded: 'Test collaboration needed',
    cmsBenefit: 'Test CMS benefit',
    currentSolutionSummary: 'Test current solution summary',
    priorityAlignment: 'Test priority alignment',
    successIndicators: 'Test success indicators',
    responseToGRTFeedback: 'Test response to GRT feedback',
    preferredSolution: {
      title: 'Test preferred solution',
      summary: 'Test summary',
      acquisitionApproach: 'Test acquisition approach',
      targetContractAwardDate: '2025-03-15T19:22:40Z',
      targetCompletionDate: '2025-03-15T19:22:40Z',
      pros: 'Test pros',
      cons: 'Test cons',
      estimatedLifecycleCost: {
        development: {
          label: 'Development',
          type: 'primary',
          isPresent: true,
          years: {
            year1: '1000',
            year2: '',
            year3: '',
            year4: '',
            year5: ''
          }
        },
        operationsMaintenance: {
          label: 'Operations and Maintenance',
          type: 'primary',
          isPresent: false,
          years: {
            year1: '',
            year2: '',
            year3: '',
            year4: '',
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
      costSavings: 'Test cost savings',
      security: {
        isApproved: false,
        isBeingReviewed: 'YES'
      },
      zeroTrustAlignment: 'Test Zero Trust',
      hosting: {
        type: 'cloud',
        location: 'Test location',
        cloudStrategy: 'test cloud strategy',
        cloudServiceType: 'Test cloud service'
      },
      hasUserInterface: 'YES',
      workforceTrainingReqs: 'Test workforce training requirements'
    },
    alternativeA: {
      title: 'Test alternative a solution',
      summary: 'Test summary',
      acquisitionApproach: 'Test acquisition approach',
      targetContractAwardDate: '2025-03-15T19:22:40Z',
      targetCompletionDate: '2025-03-15T19:22:40Z',
      pros: 'Test pros',
      cons: 'Test cons',
      estimatedLifecycleCost: {
        development: {
          label: 'Development',
          type: 'primary',
          isPresent: false,
          years: {
            year1: '',
            year2: '',
            year3: '',
            year4: '',
            year5: ''
          }
        },
        operationsMaintenance: {
          label: 'Operations and Maintenance',
          type: 'primary',
          isPresent: false,
          years: {
            year1: '',
            year2: '',
            year3: '',
            year4: '',
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
      costSavings: 'Test cost savings',
      security: {
        isApproved: false,
        isBeingReviewed: 'YES'
      },
      zeroTrustAlignment: 'Test Zero Trust',
      hosting: {
        type: 'cloud',
        location: 'Test location',
        cloudStrategy: 'Test cloud strategy',
        cloudServiceType: 'Test cloud service'
      },
      hasUserInterface: 'YES',
      workforceTrainingReqs: 'Test workforce training requirements'
    },
    alternativeB: {
      title: 'Test alternative b solution',
      summary: 'Test summary',
      acquisitionApproach: 'Test acquisition approach',
      targetContractAwardDate: '2025-03-15T19:22:40Z',
      targetCompletionDate: '2025-03-15T19:22:40Z',
      pros: 'Test pros',
      cons: 'Test cons',
      estimatedLifecycleCost: {
        development: {
          label: 'Development',
          type: 'primary',
          isPresent: false,
          years: {
            year1: '',
            year2: '',
            year3: '',
            year4: '',
            year5: ''
          }
        },
        operationsMaintenance: {
          label: 'Operations and Maintenance',
          type: 'primary',
          isPresent: false,
          years: {
            year1: '',
            year2: '',
            year3: '',
            year4: '',
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
      costSavings: 'Test cost savings',
      security: {
        isApproved: false,
        isBeingReviewed: 'YES'
      },
      zeroTrustAlignment: 'Test Zero Trust',
      hosting: {
        type: 'cloud',
        location: 'Test location',
        cloudStrategy: 'Test cloud strategy',
        cloudServiceType: 'Test cloud service'
      },
      hasUserInterface: 'YES',
      workforceTrainingReqs: 'Test workforce training requirements'
    }
  };

  it('matches the snapshot', async () => {
    const { asFragment } = render(
      <VerboseMockedProvider mocks={[getSystemIntakeContactsQuery()]}>
        <BusinessCaseReview values={businessCase} />
      </VerboseMockedProvider>
    );

    expect(
      await screen.findByText(businessOwner.userAccount.commonName)
    ).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });
});
