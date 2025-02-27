import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GetLinkedRequestsQuery from 'gql/legacyGQL/GetLinkedRequestsQuery';
import {
  GetLinkedRequests,
  GetLinkedRequestsVariables
} from 'gql/legacyGQL/types/GetLinkedRequests';
import {
  linkedSystemIntakes,
  linkedTrbRequests
} from 'tests/mock/systemLinkedRequest';

import { SystemIntakeState, TRBRequestState } from 'types/graphql-global-types';
import { MockedQuery } from 'types/util';

import SystemWorkspaceRequests from '.';

describe('System Workspace Requests Table', () => {
  it('renders open and closed requests', async () => {
    const cedarSystemId = '{11AB1A00-1234-5678-ABC1-1A001B00CC1B}';

    const result = {
      data: {
        cedarSystemDetails: {
          __typename: 'CedarSystemDetails',
          cedarSystem: {
            __typename: 'CedarSystem',
            id: cedarSystemId,
            linkedSystemIntakes,
            linkedTrbRequests
          }
        }
      }
    } as const;

    const getLinkedRequestsMockedQuery: MockedQuery<
      GetLinkedRequests,
      GetLinkedRequestsVariables
    > = {
      request: {
        query: GetLinkedRequestsQuery,
        variables: {
          cedarSystemId,
          systemIntakeState: SystemIntakeState.OPEN,
          trbRequestState: TRBRequestState.OPEN
        }
      },
      result
    };

    const getLinkedRequestsMockedQueryClosed: MockedQuery<
      GetLinkedRequests,
      GetLinkedRequestsVariables
    > = {
      request: {
        query: GetLinkedRequestsQuery,
        variables: {
          cedarSystemId,
          systemIntakeState: SystemIntakeState.CLOSED,
          trbRequestState: TRBRequestState.CLOSED
        }
      },
      result
    };

    const { asFragment } = render(
      <MockedProvider
        mocks={[
          getLinkedRequestsMockedQuery,
          getLinkedRequestsMockedQueryClosed
        ]}
      >
        <MemoryRouter
          initialEntries={[`/systems/${cedarSystemId}/workspace/requests`]}
        >
          <Route exact path="/systems/:systemId/workspace/requests">
            <SystemWorkspaceRequests />
          </Route>
        </MemoryRouter>
      </MockedProvider>
    );
    await screen.findByTestId('system-linked-requests');

    // Open requests loads first by default
    expect(screen.getByText('Upcoming meeting date')).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();

    // Click to load closed requests
    const closed = await screen.findByRole('button', {
      name: 'Closed requests'
    });

    userEvent.click(closed);

    expect(
      await screen.findByText('Most recent meeting date')
    ).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });
});
