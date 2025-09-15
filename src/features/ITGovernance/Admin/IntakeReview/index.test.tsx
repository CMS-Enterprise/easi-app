import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import { SystemIntakeFragmentFragment } from 'gql/generated/graphql';
import {
  getSystemIntakeContactsQuery,
  getSystemIntakeQuery,
  requester,
  systemIntake
} from 'tests/mock/systemIntake';

import { MessageProvider } from 'hooks/useMessage';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

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
      await screen.findByTestId(`contact-requester-${requester.euaUserId}`)
    ).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders increased costs data', () => {
    const costs: SystemIntakeFragmentFragment['costs'] = {
      __typename: 'SystemIntakeCosts',
      isExpectingIncrease: 'YES',
      expectedIncreaseAmount: 'less than $1 million'
    };

    render(
      <MemoryRouter>
        <VerboseMockedProvider
          mocks={[
            getSystemIntakeQuery({ costs }),
            getSystemIntakeContactsQuery
          ]}
        >
          <MessageProvider>
            <IntakeReview
              systemIntake={{
                ...systemIntake,
                costs
              }}
            />
          </MessageProvider>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/less than \$1 million/i)).toBeInTheDocument();
  });

  it('renders annual spending data', () => {
    const annualSpending: SystemIntakeFragmentFragment['annualSpending'] = {
      __typename: 'SystemIntakeAnnualSpending',
      currentAnnualSpending: '3.50',
      currentAnnualSpendingITPortion: '35',
      plannedYearOneSpending: '123456',
      plannedYearOneSpendingITPortion: '50'
    };

    render(
      <MemoryRouter>
        <MockedProvider
          mocks={[
            getSystemIntakeQuery({ annualSpending }),
            getSystemIntakeContactsQuery
          ]}
        >
          <MessageProvider>
            <IntakeReview
              systemIntake={{
                ...systemIntake,
                annualSpending
              }}
            />
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('$3.5')).toBeInTheDocument();
    expect(screen.getByText('$123,456')).toBeInTheDocument();
  });
});
