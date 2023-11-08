import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, within } from '@testing-library/react';
import { DateTime } from 'luxon';

import users from 'data/mock/users';
import { GetSystemIntake_systemIntake_requester as Requester } from 'queries/types/GetSystemIntake';
import {
  SystemIntakeRequestType,
  SystemIntakeStatus
} from 'types/graphql-global-types';

import Summary from '.';

vi.mock('@okta/okta-react', () => ({
  useOktaAuth: () => {
    return {
      authState: {
        isAuthenticated: true
      },
      oktaAuth: {
        getAccessToken: () => Promise.resolve('test-access-token'),
        getUser: () =>
          Promise.resolve({
            name: 'John Doe'
          })
      }
    };
  }
}));

const requester: Requester = {
  __typename: 'SystemIntakeRequester',
  name: users[0].commonName,
  email: users[0].email,
  component: 'Office of Information Technology'
};

const summaryProps = {
  id: 'ccdfdcf5-5085-4521-9f77-fa1ea324502b',
  requestName: 'Request Name',
  requestType: SystemIntakeRequestType.NEW,
  status: SystemIntakeStatus.INTAKE_SUBMITTED,
  adminLead: null,
  submittedAt: DateTime.local().toString(),
  lcid: null,
  requester,
  contractNumber: '123456'
};

describe('The GRT Review page', () => {
  it('shows open status', async () => {
    render(
      <MemoryRouter>
        <MockedProvider>
          <Summary {...summaryProps} />
        </MockedProvider>
      </MemoryRouter>
    );

    expect(
      within(screen.getByTestId('request-state')).getByText('Open')
    ).toBeInTheDocument();
  });

  it('shows closed status', async () => {
    render(
      <MemoryRouter>
        <MockedProvider>
          <Summary {...summaryProps} status={SystemIntakeStatus.LCID_ISSUED} />
        </MockedProvider>
      </MemoryRouter>
    );

    expect(
      within(screen.getByTestId('request-state')).getByText('Closed')
    ).toBeInTheDocument();
  });

  it('shows life cycle id if it exists', async () => {
    const lcid = '123456';

    render(
      <MemoryRouter>
        <MockedProvider>
          <Summary
            {...summaryProps}
            status={SystemIntakeStatus.LCID_ISSUED}
            lcid={lcid}
          />
        </MockedProvider>
      </MemoryRouter>
    );

    expect(
      within(screen.getByTestId('grt-current-status')).getByText(
        `Life Cycle ID issued: ${lcid}`
      )
    ).toBeInTheDocument();
  });
});
