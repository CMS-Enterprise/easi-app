import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, within } from '@testing-library/react';
import {
  RequestRelationType,
  SystemIntakeContactComponent,
  SystemIntakeFragmentFragment,
  SystemIntakeRequestType,
  SystemIntakeState,
  SystemIntakeStatusAdmin
} from 'gql/generated/graphql';
import { DateTime } from 'luxon';
import users from 'tests/mock/users';

import ITGovAdminContext from '../../../../contexts/ITGovAdminContext/ITGovAdminContext';

import Summary, { RequestSummaryProps } from '.';

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

const requester: SystemIntakeFragmentFragment['requester'] = {
  __typename: 'SystemIntakeContact',
  id: '5a1d42ef-05c2-49d3-846f-710996e4def9',
  userAccount: {
    __typename: 'UserAccount',
    id: 'aeb756b5-0226-4a12-9153-32214ff20254',
    username: users[0].euaUserId,
    commonName: users[0].commonName,
    email: users[0].email
  },
  component: SystemIntakeContactComponent.OFFICE_OF_INFORMATION_TECHNOLOGY_OIT
};

const summaryProps: RequestSummaryProps = {
  id: 'ccdfdcf5-5085-4521-9f77-fa1ea324502b',
  requestName: 'Request Name',
  requestType: SystemIntakeRequestType.NEW,
  statusAdmin: SystemIntakeStatusAdmin.INITIAL_REQUEST_FORM_SUBMITTED,
  adminLead: null,
  submittedAt: DateTime.local().toString(),
  lcid: null,
  requester,
  contractNumbers: ['123456'],
  state: SystemIntakeState.OPEN,
  relationType: RequestRelationType.NEW_SYSTEM,
  contractName: null,
  systems: []
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
          <Summary
            {...summaryProps}
            statusAdmin={SystemIntakeStatusAdmin.LCID_ISSUED}
            state={SystemIntakeState.CLOSED}
          />
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
            statusAdmin={SystemIntakeStatusAdmin.LCID_ISSUED}
            state={SystemIntakeState.CLOSED}
            lcid={lcid}
          />
        </MockedProvider>
      </MemoryRouter>
    );

    expect(
      within(screen.getByTestId('grt-current-status')).getByText(
        `LCID issued: ${lcid}`
      )
    ).toBeInTheDocument();
  });

  it('hides action buttons for GRB view', async () => {
    render(
      <MemoryRouter>
        <MockedProvider>
          <ITGovAdminContext.Provider value={false}>
            <Summary {...summaryProps} />
          </ITGovAdminContext.Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(screen.queryByRole('button', { name: 'Assign' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Take an action' })).toBeNull();
  });
});
