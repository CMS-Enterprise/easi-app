import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import BusinessCaseReview from './index';

window.matchMedia = (): any => ({
  addListener: () => {},
  removeListener: () => {}
});

describe('The Business Case Review Component', () => {
  const businessCase = {
    status: 'OPEN',
    systemIntakeId: '048c26ea-07be-4f40-b29e-761fc17bf414',
    systemIntakeStatus: 'BIZ_CASE_DRAFT',
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
    priorityAlignment: 'Test priority alignment',
    successIndicators: 'Test success indicators',
    asIsSolution: {
      title: 'Test as is solution',
      summary: 'Test summary',
      pros: 'Test pros',
      cons: 'Test cons',
      estimatedLifecycleCost: {
        year1: {
          development: {
            isPresent: false,
            cost: '0'
          },
          operationsMaintenance: {
            isPresent: false,
            cost: '0'
          },
          other: {
            isPresent: false,
            cost: '0'
          }
        },
        year2: {
          development: {
            isPresent: false,
            cost: '0'
          },
          operationsMaintenance: {
            isPresent: false,
            cost: '0'
          },
          other: {
            isPresent: false,
            cost: '0'
          }
        },
        year3: {
          development: {
            isPresent: false,
            cost: '0'
          },
          operationsMaintenance: {
            isPresent: false,
            cost: '0'
          },
          other: {
            isPresent: false,
            cost: '0'
          }
        },
        year4: {
          development: {
            isPresent: false,
            cost: '0'
          },
          operationsMaintenance: {
            isPresent: false,
            cost: '0'
          },
          other: {
            isPresent: false,
            cost: '0'
          }
        },
        year5: {
          development: {
            isPresent: false,
            cost: '0'
          },
          operationsMaintenance: {
            isPresent: false,
            cost: '0'
          },
          other: {
            isPresent: false,
            cost: '0'
          }
        }
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
        year1: {
          development: {
            isPresent: false,
            cost: '0'
          },
          operationsMaintenance: {
            isPresent: false,
            cost: '0'
          },
          other: {
            isPresent: false,
            cost: '0'
          }
        },
        year2: {
          development: {
            isPresent: false,
            cost: '0'
          },
          operationsMaintenance: {
            isPresent: false,
            cost: '0'
          },
          other: {
            isPresent: false,
            cost: '0'
          }
        },
        year3: {
          development: {
            isPresent: false,
            cost: '0'
          },
          operationsMaintenance: {
            isPresent: false,
            cost: '0'
          },
          other: {
            isPresent: false,
            cost: '0'
          }
        },
        year4: {
          development: {
            isPresent: false,
            cost: '0'
          },
          operationsMaintenance: {
            isPresent: false,
            cost: '0'
          },
          other: {
            isPresent: false,
            cost: '0'
          }
        },
        year5: {
          development: {
            isPresent: false,
            cost: '0'
          },
          operationsMaintenance: {
            isPresent: false,
            cost: '0'
          },
          other: {
            isPresent: false,
            cost: '0'
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
        year1: {
          development: {
            isPresent: false,
            cost: '0'
          },
          operationsMaintenance: {
            isPresent: false,
            cost: '0'
          },
          other: {
            isPresent: false,
            cost: '0'
          }
        },
        year2: {
          development: {
            isPresent: false,
            cost: '0'
          },
          operationsMaintenance: {
            isPresent: false,
            cost: '0'
          },
          other: {
            isPresent: false,
            cost: '0'
          }
        },
        year3: {
          development: {
            isPresent: false,
            cost: '0'
          },
          operationsMaintenance: {
            isPresent: false,
            cost: '0'
          },
          other: {
            isPresent: false,
            cost: '0'
          }
        },
        year4: {
          development: {
            isPresent: false,
            cost: '0'
          },
          operationsMaintenance: {
            isPresent: false,
            cost: '0'
          },
          other: {
            isPresent: false,
            cost: '0'
          }
        },
        year5: {
          development: {
            isPresent: false,
            cost: '0'
          },
          operationsMaintenance: {
            isPresent: false,
            cost: '0'
          },
          other: {
            isPresent: false,
            cost: '0'
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
        year1: {
          development: {
            isPresent: false,
            cost: '0'
          },
          operationsMaintenance: {
            isPresent: false,
            cost: '0'
          },
          other: {
            isPresent: false,
            cost: '0'
          }
        },
        year2: {
          development: {
            isPresent: false,
            cost: '0'
          },
          operationsMaintenance: {
            isPresent: false,
            cost: '0'
          },
          other: {
            isPresent: false,
            cost: '0'
          }
        },
        year3: {
          development: {
            isPresent: false,
            cost: '0'
          },
          operationsMaintenance: {
            isPresent: false,
            cost: '0'
          },
          other: {
            isPresent: false,
            cost: '0'
          }
        },
        year4: {
          development: {
            isPresent: false,
            cost: '0'
          },
          operationsMaintenance: {
            isPresent: false,
            cost: '0'
          },
          other: {
            isPresent: false,
            cost: '0'
          }
        },
        year5: {
          development: {
            isPresent: false,
            cost: '0'
          },
          operationsMaintenance: {
            isPresent: false,
            cost: '0'
          },
          other: {
            isPresent: false,
            cost: '0'
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
    const tree = renderer
      .create(<BusinessCaseReview values={businessCase} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
