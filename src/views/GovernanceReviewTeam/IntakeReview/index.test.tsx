import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';

import {
  getSystemIntakeContactsQuery,
  getSystemIntakeQuery,
  requester,
  systemIntake
} from 'data/mock/systemIntake';
import { MessageProvider } from 'hooks/useMessage';

import IntakeReview from './index';

describe('The GRT intake review view', () => {
  let dateSpy: any;
  beforeAll(() => {
    // September 30, 2020
    dateSpy = vi.spyOn(Date, 'now').mockImplementation(() => 1601449200000);
  });

  afterAll(() => {
    dateSpy.mockRestore();
  });

  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <MockedProvider
          mocks={[getSystemIntakeQuery(), getSystemIntakeContactsQuery]}
        >
          <MessageProvider>
            <IntakeReview systemIntake={systemIntake} />
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );
    expect(screen.getByTestId('intake-review')).toBeInTheDocument();
  });

  it('matches the snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[`/it-governance/${systemIntake.id}/intake-request`]}
      >
        <MockedProvider
          mocks={[getSystemIntakeQuery(), getSystemIntakeContactsQuery]}
        >
          <Route path={['/it-governance/:systemId/intake-request']}>
            <MessageProvider>
              <IntakeReview systemIntake={systemIntake} />
            </MessageProvider>
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(
      await screen.findByTestId(`contact-requester-${requester.id}`)
    ).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders increased costs data', () => {
    render(
      <MemoryRouter>
        <MockedProvider mocks={[getSystemIntakeContactsQuery]}>
          <MessageProvider>
            <IntakeReview
              systemIntake={{
                ...systemIntake,
                costs: {
                  __typename: 'SystemIntakeCosts',
                  isExpectingIncrease: 'YES',
                  expectedIncreaseAmount: 'less than $1 million'
                }
              }}
            />
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/less than \$1 million/i)).toBeInTheDocument();
  });

  it('renders annual spending data', () => {
    render(
      <MemoryRouter>
        <MockedProvider mocks={[getSystemIntakeContactsQuery]}>
          <MessageProvider>
            <IntakeReview
              systemIntake={{
                ...systemIntake,
                annualSpending: {
                  __typename: 'SystemIntakeAnnualSpending',
                  currentAnnualSpending: 'about $3.50',
                  currentAnnualSpendingITPortion: '35%',
                  plannedYearOneSpending: 'more than $1 million',
                  plannedYearOneSpendingITPortion: '50%'
                }
              }}
            />
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/about \$3.50/i)).toBeInTheDocument();
    expect(screen.getByText(/more than \$1 million/i)).toBeInTheDocument();
  });
});
