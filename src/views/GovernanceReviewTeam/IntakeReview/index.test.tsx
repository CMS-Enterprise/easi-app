import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import IntakeReview from './index';

describe('The GRT intake review view', () => {
  let dateSpy;
  beforeAll(() => {
    // September 30, 2020
    dateSpy = jest.spyOn(Date, 'now').mockImplementation(() => 1601449200000);
  });

  afterAll(() => {
    dateSpy.mockRestore();
  });

  const mockSystemIntake = {
    id: '53d762ea-0bc8-4af0-b24d-0b5844bacea5',
    euaUserID: 'ABCD',
    status: 'INTAKE_SUBMITTED',
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
    costs: {
      expectedIncreaseAmount: '',
      isExpectingIncrease: 'NO'
    },
    contract: {
      hasContract: 'IN_PROGRESS',
      contractor: 'TrussWorks, Inc.',
      vehicle: 'Sole Source',
      startDate: {
        month: '1',
        year: '2020'
      },
      endDate: {
        month: '12',
        year: '2020'
      }
    },
    businessNeed: 'The quick brown fox jumps over the lazy dog.',
    businessSolution: 'The quick brown fox jumps over the lazy dog.',
    currentStage: 'The quick brown fox jumps over the lazy dog.',
    needsEaSupport: false,
    grtReviewEmailBody: 'The quick brown fox jumps over the lazy dog.',
    decidedAt: new Date().toISOString(),
    businessCaseId: null,
    submittedAt: new Date().toISOString()
  };

  it('renders without crashing', () => {
    shallow(<IntakeReview systemIntake={mockSystemIntake} />);
  });

  it('matches the snapshot', () => {
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
