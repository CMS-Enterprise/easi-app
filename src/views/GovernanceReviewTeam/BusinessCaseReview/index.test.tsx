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
        year1: [{ phase: 'Development', cost: '1' }],
        year2: [{ phase: 'Development', cost: '2' }],
        year3: [{ phase: 'Development', cost: '3' }],
        year4: [{ phase: 'Development', cost: '4' }],
        year5: [{ phase: 'Development', cost: '5' }]
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
