import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { FetchResult } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  GetLinkedRequestsDocument,
  GetLinkedRequestsQuery,
  GetLinkedRequestsQueryVariables,
  GetSystemWorkspaceDocument,
  GetSystemWorkspaceQuery,
  GetSystemWorkspaceQueryVariables,
  SystemIntakeState,
  TRBRequestState
} from 'gql/generated/graphql';
import {
  linkedSystemIntakes,
  linkedTrbRequests
} from 'tests/mock/systemLinkedRequest';

import { MockedQuery } from 'types/util';

import SystemWorkspaceRequests from '.';

describe('System Workspace Requests Table', () => {
  it('renders open and closed requests', async () => {
    const cedarSystemId = '{11AB1A00-1234-5678-ABC1-1A001B00CC1B}';

    const getSystemWorkspaceMockedQuery: MockedQuery<
      GetSystemWorkspaceQuery,
      GetSystemWorkspaceQueryVariables
    > = {
      request: {
        query: GetSystemWorkspaceDocument,
        variables: {
          cedarSystemId
        }
      },
      result: {
        data: {
          __typename: 'Query',
          cedarAuthorityToOperate: [],
          cedarSystemDetails: {
            __typename: 'CedarSystemDetails',
            isMySystem: true,
            cedarSystem: {
              __typename: 'CedarSystem',
              id: cedarSystemId,
              name: 'Office of Funny Walks',
              isBookmarked: false,
              linkedSystemIntakes,
              linkedTrbRequests
            },
            roles: []
          }
        }
      }
    };

    const result: FetchResult<GetLinkedRequestsQuery> = {
      data: {
        __typename: 'Query',
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
    };

    const getLinkedRequestsMockedQuery: MockedQuery<
      GetLinkedRequestsQuery,
      GetLinkedRequestsQueryVariables
    > = {
      request: {
        query: GetLinkedRequestsDocument,
        variables: {
          cedarSystemId,
          systemIntakeState: SystemIntakeState.OPEN,
          trbRequestState: TRBRequestState.OPEN
        }
      },
      result
    };

    const getLinkedRequestsMockedQueryClosed: MockedQuery<
      GetLinkedRequestsQuery,
      GetLinkedRequestsQueryVariables
    > = {
      request: {
        query: GetLinkedRequestsDocument,
        variables: {
          cedarSystemId,
          systemIntakeState: SystemIntakeState.CLOSED,
          trbRequestState: TRBRequestState.CLOSED
        }
      },
      result
    };

    const user = userEvent.setup();
    render(
      <MockedProvider
        mocks={[
          getSystemWorkspaceMockedQuery,
          getSystemWorkspaceMockedQuery,
          getSystemWorkspaceMockedQuery,
          getSystemWorkspaceMockedQuery,
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
    expect(
      await screen.findByText(
        'Case 14 - Completed request form with Existing System Relation'
      )
    ).toBeInTheDocument();

    // Click to load closed requests
    const closed = await screen.findByRole('button', {
      name: 'Closed requests'
    });

    await user.click(closed);

    expect(
      await screen.findByText('Most recent meeting date')
    ).toBeInTheDocument();
  });

  it('renders not found for a non-team member', async () => {
    const cedarSystemId = '{11AB1A00-1234-5678-ABC1-1A001B00CC1B}';

    const getSystemWorkspaceMockedQuery: MockedQuery<
      GetSystemWorkspaceQuery,
      GetSystemWorkspaceQueryVariables
    > = {
      request: {
        query: GetSystemWorkspaceDocument,
        variables: {
          cedarSystemId
        }
      },
      result: {
        data: {
          __typename: 'Query',
          cedarAuthorityToOperate: [],
          cedarSystemDetails: {
            __typename: 'CedarSystemDetails',
            isMySystem: false,
            cedarSystem: {
              __typename: 'CedarSystem',
              id: cedarSystemId,
              name: 'Office of Funny Walks',
              isBookmarked: false,
              linkedSystemIntakes: [],
              linkedTrbRequests: []
            },
            roles: []
          }
        }
      }
    };

    render(
      <MockedProvider mocks={[getSystemWorkspaceMockedQuery]}>
        <MemoryRouter
          initialEntries={[`/systems/${cedarSystemId}/workspace/requests`]}
        >
          <Route exact path="/systems/:systemId/workspace/requests">
            <SystemWorkspaceRequests />
          </Route>
        </MemoryRouter>
      </MockedProvider>
    );

    expect(
      await screen.findByRole('heading', { name: 'This page cannot be found.' })
    ).toBeInTheDocument();
  });
});
