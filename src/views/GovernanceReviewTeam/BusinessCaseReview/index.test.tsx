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
    priorityAlignment: 'Mock priority alignment',
    successIndicators: 'Mock success indicators',
    asIsSolution: {
      title: 'Mock As is Solution',
      summary: 'Mock As is solution summary',
      pros: 'Mock As is solution  pros',
      cons: 'Mock As is solution cons',
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
      costSavings: ''
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
