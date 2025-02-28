import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import { SystemIntake as SystemIntakeOld } from 'gql/legacyGQL/types/SystemIntake';
import {
  getSystemIntakeContactsQuery,
  getSystemIntakeQuery,
  requester,
  systemIntake
} from 'tests/mock/systemIntake';

import { MessageProvider } from 'hooks/useMessage';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import ITGovAdminContext from '../../../../wrappers/ITGovAdminContext/ITGovAdminContext';

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
    const costs: SystemIntakeOld['costs'] = {
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
    const annualSpending: SystemIntakeOld['annualSpending'] = {
      __typename: 'SystemIntakeAnnualSpending',
      currentAnnualSpending: 'about $3.50',
      currentAnnualSpendingITPortion: '35%',
      plannedYearOneSpending: 'more than $1 million',
      plannedYearOneSpendingITPortion: '50%'
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

    expect(screen.getByText(/about \$3.50/i)).toBeInTheDocument();
    expect(screen.getByText(/more than \$1 million/i)).toBeInTheDocument();
  });

  it('Renders action button for GRT admins', async () => {
    render(
      <MemoryRouter
        initialEntries={[`/it-governance/${systemIntake.id}/intake-request`]}
      >
        <MockedProvider
          mocks={[getSystemIntakeQuery(), getSystemIntakeContactsQuery]}
        >
          <Route path={['/it-governance/:systemId/intake-request']}>
            <MessageProvider>
              <ITGovAdminContext.Provider value>
                <IntakeReview systemIntake={systemIntake} />
              </ITGovAdminContext.Provider>
            </MessageProvider>
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(
      await screen.findByTestId(`contact-requester-${requester.euaUserId}`)
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: 'Take an action' })
    ).toBeInTheDocument();
  });
});
