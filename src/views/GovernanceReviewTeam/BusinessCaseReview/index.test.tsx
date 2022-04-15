import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import { businessCaseInitialData } from 'data/businessCase';

import BusinessCaseReview from './index';

window.matchMedia = (): any => ({
  addListener: () => {},
  removeListener: () => {}
});

describe('The GRT business case review', () => {
  const mockBusinessCase = {
    ...businessCaseInitialData,
    id: '54e829a9-6ce3-4b4b-81b0-7781b1e22821',
    requestName: 'Easy Access to System Information',
    requester: {
      name: 'Jane Doe',
      phoneNumber: '1234567890'
    },
    businessOwner: {
      name: 'Jane Doe'
    },
    businessNeed: 'Mock business need',
    cmsBenefit: 'Mock CMS benefit',
    currentSolutionSummary: 'Mock current solution summary',
    priorityAlignment: 'Mock priority alignment',
    successIndicators: 'Mock success indicators',
    preferredSolution: {
      title: 'Mock Preferred solution',
      summary: 'Mock Preferred solution summary',
      acquisitionApproach: 'Mock acquisition approach',
      pros: 'Mock Preferred solution pros',
      cons: 'Mock Preferred solution cons',
      estimatedLifecycleCost: {
        year1: {
          development: {
            isPresent: true,
            cost: '1'
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
            isPresent: true,
            cost: '2'
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
            isPresent: true,
            cost: '3'
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
            isPresent: true,
            cost: '4'
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
            isPresent: true,
            cost: '5'
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
      costSavings: 'Mock cost savings',
      security: {
        isApproved: false,
        isBeingReviewed: 'YES'
      },
      hosting: {
        type: 'Cloud',
        location: 'Mock location',
        cloudServiceType: 'Mock cloud service'
      },
      hasUserInterface: 'YES'
    }
  };

  it('renders without crashing', () => {
    shallow(<BusinessCaseReview businessCase={businessCaseInitialData} />);
  });

  it('matches the snapshot', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <BusinessCaseReview businessCase={mockBusinessCase} />
        </MemoryRouter>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
