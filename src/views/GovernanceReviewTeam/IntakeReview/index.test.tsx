import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import IntakeReview from './index';

describe('The GRT intake review view', () => {
  const mockSystemIntake = {
    id: '53d762ea-0bc8-4af0-b24d-0b5844bacea5',
    euaUserID: 'ABCD',
    status: 'SUBMITTED',
    requester: {
      name: 'Jane Doe',
      component: 'OIT',
      email: 'jane@cms.gov'
    },
    businessOwner: {
      name: 'Jane Doe',
      component: 'OIT'
    },
    productManager: {
      name: 'Jane Doe',
      component: 'OIT'
    },
    isso: {
      isPresent: false,
      name: ''
    },
    governanceTeams: {
      isPresent: false,
      teams: []
    },
    fundingSource: {
      isFunded: false,
      fundingNumber: ''
    },
    businessNeed: 'The quick brown fox jumps over the lazy dog.',
    businessSolution: 'The quick brown fox jumps over the lazy dog.',
    currentStage: 'The quick brown fox jumps over the lazy dog.',
    needsEaSupport: false,
    hasContract: 'The quick brown fox jumps over the lazy dog.',
    grtReviewEmailBody: 'The quick brown fox jumps over the lazy dog.',
    decidedAt: new Date(2020, 8, 30).toISOString(),
    businessCaseId: null,
    submittedAt: new Date(2020, 8, 30).toISOString()
  };

  it('renders without crashing', () => {
    shallow(<IntakeReview systemIntake={mockSystemIntake} />);
  });

  it('matches the snapshot', () => {
    Date.now = jest.fn(() => new Date(2020, 8, 30).valueOf());
    const tree = renderer
      .create(
        <MemoryRouter>
          <IntakeReview systemIntake={mockSystemIntake} />{' '}
        </MemoryRouter>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
