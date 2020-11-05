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
        year1: [{ phase: 'Development', cost: '0' }],
        year2: [{ phase: 'Development', cost: '0' }],
        year3: [{ phase: 'Development', cost: '0' }],
        year4: [{ phase: 'Development', cost: '0' }],
        year5: [{ phase: 'Development', cost: '0' }]
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
