import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { render, screen } from '@testing-library/react';
import { DateTime } from 'luxon';

import IntakeReview from './index';

describe('The GRT intake review view', () => {
  let dateSpy: any;
  beforeAll(() => {
    // September 30, 2020
    dateSpy = jest.spyOn(Date, 'now').mockImplementation(() => 1601449200000);
  });

  afterAll(() => {
    dateSpy.mockRestore();
  });

  const mockSystemIntake = {
    id: '53d762ea-0bc8-4af0-b24d-0b5844bacea5',
    euaUserId: 'ABCD',
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
      fundingNumber: '',
      source: ''
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
        day: '',
        year: '2020'
      },
      endDate: {
        month: '12',
        day: '',
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
    submittedAt: DateTime.fromISO(new Date(2020, 8, 30).toISOString())
  };

  it('renders without crashing', () => {
    const now = DateTime.local();
    render(
      <MemoryRouter>
        <IntakeReview systemIntake={mockSystemIntake} now={now} />
      </MemoryRouter>
    );
    expect(screen.getByTestId('intake-review')).toBeInTheDocument();
  });

  it('matches the snapshot', () => {
    const now = DateTime.fromRFC2822('30 Sep 2020 13:23:12 GMT');
    const tree = renderer
      .create(
        <MemoryRouter>
          <IntakeReview systemIntake={mockSystemIntake} now={now} />{' '}
        </MemoryRouter>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders increased costs data', () => {
    const now = DateTime.local();
    const mockIntake = {
      ...mockSystemIntake,
      costs: {
        isExpectingIncrease: 'YES',
        expectedIncreaseAmount: 'less than $1 million'
      }
    };

    render(
      <MemoryRouter>
        <IntakeReview systemIntake={mockIntake} now={now} />
      </MemoryRouter>
    );

    expect(screen.getByText(/less than \$1 million/i)).toBeInTheDocument();
  });
});
