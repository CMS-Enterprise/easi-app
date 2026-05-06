import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import {
  GetSystemWorkspaceAtoDocument,
  GetSystemWorkspaceAtoQuery,
  GetSystemWorkspaceAtoQueryVariables,
  GetSystemWorkspaceDocument,
  GetSystemWorkspaceQuery,
  GetSystemWorkspaceQueryVariables
} from 'gql/generated/graphql';

import { MockedQuery } from 'types/util';

import SystemWorkspace from '.';

vi.mock('launchdarkly-react-client-sdk', () => ({
  useFlags: () => ({
    systemWorkspace: true,
    systemWorkspaceRequestsCard: true,
    systemWorkspaceTeam: true
  })
}));

const cedarSystemId = '11AB1A00-1234-5678-ABC1-1A001B00CC1B';
const cedarSystemName = 'Office of Funny Walks';

const getSystemWorkspaceAtoQuery: MockedQuery<
  GetSystemWorkspaceAtoQuery,
  GetSystemWorkspaceAtoQueryVariables
> = {
  request: {
    query: GetSystemWorkspaceAtoDocument,
    variables: {
      cedarSystemId
    }
  },
  result: {
    data: {
      __typename: 'Query',
      cedarAuthorityToOperate: []
    }
  }
};

const renderSystemWorkspace = (viewerCanAccessProfile: boolean) => {
  const getSystemWorkspaceQuery: MockedQuery<
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
        cedarSystemWorkspace: {
          __typename: 'CedarSystemWorkspace',
          id: cedarSystemId,
          isMySystem: true,
          cedarSystem: {
            __typename: 'CedarSystemWorkspaceSystem',
            id: cedarSystemId,
            name: cedarSystemName,
            isBookmarked: false,
            viewerCanAccessProfile,
            linkedTrbRequests: [],
            linkedSystemIntakes: []
          },
          roles: []
        }
      }
    }
  };

  render(
    <MockedProvider
      mocks={
        viewerCanAccessProfile
          ? [getSystemWorkspaceQuery, getSystemWorkspaceAtoQuery]
          : [getSystemWorkspaceQuery]
      }
    >
      <MemoryRouter initialEntries={[`/systems/${cedarSystemId}/workspace`]}>
        <Route path="/systems/:systemId/workspace">
          <SystemWorkspace />
        </Route>
      </MemoryRouter>
    </MockedProvider>
  );
};

describe('SystemWorkspace', () => {
  it('routes workspace-only viewers to team management instead of the edit hub', async () => {
    renderSystemWorkspace(false);

    expect(
      await screen.findByRole('heading', { name: 'System workspace' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Manage system team' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Edit system profile' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'View system profile' })
    ).not.toBeInTheDocument();
    expect(
      screen.getByText('ATO details are unavailable for your account.')
    ).toBeInTheDocument();
  });

  it('shows the system profile link for viewers with profile access', async () => {
    renderSystemWorkspace(true);

    expect(
      await screen.findByRole('button', { name: 'View system profile' })
    ).toBeInTheDocument();
  });
});
