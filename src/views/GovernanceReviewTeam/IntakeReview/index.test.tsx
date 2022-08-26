import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { render, screen } from '@testing-library/react';
import { DateTime } from 'luxon';

import { GetSystemIntake_systemIntake as SystemIntake } from 'queries/types/GetSystemIntake';

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

  const mockSystemIntake: SystemIntake = {
    id: '53d762ea-0bc8-4af0-b24d-0b5844bacea5',
    euaUserId: 'ABCD',
    adminLead: '',
    status: 'INTAKE_SUBMITTED',
    requester: {
      name: 'Jane Doe',
      component: 'OIT',
      email: 'jane@cms.gov'
    },
    requestType: 'NEW',
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
      teams: null
    },
    existingFunding: false,
    fundingSources: [],
    costs: {
      expectedIncreaseAmount: '',
      isExpectingIncrease: 'NO'
    },
    contract: {
      hasContract: 'IN_PROGRESS',
      contractor: 'TrussWorks, Inc.',
      vehicle: 'Sole Source',
      number: '123456-7890',
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
    decisionNextSteps: '',
    businessNeed: 'The quick brown fox jumps over the lazy dog.',
    businessSolution: 'The quick brown fox jumps over the lazy dog.',
    currentStage: 'The quick brown fox jumps over the lazy dog.',
    needsEaSupport: false,
    grtReviewEmailBody: 'The quick brown fox jumps over the lazy dog.',
    decidedAt: new Date().toISOString(),
    submittedAt: DateTime.fromISO(new Date(2020, 8, 30).toISOString()).toISO()
  } as SystemIntake;

  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <IntakeReview systemIntake={mockSystemIntake} />
      </MemoryRouter>
    );
    expect(screen.getByTestId('intake-review')).toBeInTheDocument();
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

  it('renders increased costs data', () => {
    const mockIntake: SystemIntake = {
      ...mockSystemIntake,
      costs: {
        isExpectingIncrease: 'YES',
        expectedIncreaseAmount: 'less than $1 million'
      }
    } as SystemIntake;

    render(
      <MemoryRouter>
        <IntakeReview systemIntake={mockIntake} />
      </MemoryRouter>
    );

    expect(screen.getByText(/less than \$1 million/i)).toBeInTheDocument();
  });
});
