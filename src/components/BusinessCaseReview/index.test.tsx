import React from 'react';
import { render } from '@testing-library/react';
import { shallow } from 'enzyme';

import { BusinessCaseModel } from 'types/businessCase';

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
    systemIntakeId: '048c26ea-07be-4f40-b29e-761fc17bf414',
    requestName: 'EASi Test',
    requester: {
      name: 'Jane Smith',
      phoneNumber: '1234567890'
    },
    businessOwner: {
      name: 'Jane Smith'
    },
    businessNeed: 'Test business need',
    cmsBenefit: 'Test CMS benefit',
    currentSolutionSummary: 'Test current solution summary',
    priorityAlignment: 'Test priority alignment',
    successIndicators: 'Test success indicators',
    preferredSolution: {
      title: 'Test preferred solution',
      summary: 'Test summary',
      acquisitionApproach: 'Test acquisition approach',
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
      hosting: {
        type: 'cloud',
        location: 'Test location',
        cloudServiceType: 'Test cloud service'
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
      hosting: {
        type: 'cloud',
        location: 'Test location',
        cloudServiceType: 'Test cloud service'
      },
      hasUserInterface: 'YES'
    }
  };

  it('renders without crashing', () => {
    shallow(<BusinessCaseReview values={businessCase} />);
  });

  it('matches the snapshot', () => {
    const { asFragment } = render(<BusinessCaseReview values={businessCase} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
