import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import {
  GetSystemWorkspaceDocument,
  GetSystemWorkspaceQuery,
  GetSystemWorkspaceQueryVariables
} from 'gql/generated/graphql';

import { MessageProvider } from 'hooks/useMessage';
import { MockedQuery } from 'types/util';
import easiMockStore from 'utils/testing/easiMockStore';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import EditSystemProfile from '.';

vi.mock('launchdarkly-react-client-sdk', () => ({
  useFlags: () => ({
    editableSystemProfile: true,
    systemWorkspaceTeam: true
  })
}));

vi.mock('contexts/SystemSectionLockContext', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useSystemSectionLockContext: () => ({
    systemProfileSectionLocks: [],
    loading: false
  })
}));

const cedarSystemId = '11AB1A00-1234-5678-ABC1-1A001B00CC1B';
const cedarSystemName = 'Office of Funny Walks';

const store = easiMockStore();

const renderEditSystemProfile = ({
  initialEntry,
  viewerCanAccessProfile = true
}: {
  initialEntry: string;
  viewerCanAccessProfile?: boolean;
}) => {
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

  return render(
    <Provider store={store}>
      <VerboseMockedProvider mocks={[getSystemWorkspaceQuery]}>
        <MemoryRouter initialEntries={[initialEntry]}>
          <MessageProvider>
            <Route path="/systems/:systemId/edit/:section?/:action?">
              <EditSystemProfile />
            </Route>
          </MessageProvider>
        </MemoryRouter>
      </VerboseMockedProvider>
    </Provider>
  );
};

describe('EditSystemProfile', () => {
  it('renders the system name', async () => {
    renderEditSystemProfile({
      initialEntry: `/systems/${cedarSystemId}/edit`
    });

    await screen.findByText(`for ${cedarSystemName}`);
  });

  it('blocks workspace-only viewers from the generic edit hub', async () => {
    renderEditSystemProfile({
      initialEntry: `/systems/${cedarSystemId}/edit`,
      viewerCanAccessProfile: false
    });

    await screen.findByRole('heading', { name: 'This page cannot be found.' });
  });

  it('allows workspace-only viewers onto the team management route', async () => {
    renderEditSystemProfile({
      initialEntry: `/systems/${cedarSystemId}/edit/team?workspace`,
      viewerCanAccessProfile: false
    });

    expect(
      await screen.findByRole('heading', { name: 'Manage system team' })
    ).toBeInTheDocument();
  });

  it('renders page not found for invalid system id', async () => {
    const invalidCedarSystemQuery: MockedQuery<
      GetSystemWorkspaceQuery,
      GetSystemWorkspaceQueryVariables
    > = {
      request: {
        query: GetSystemWorkspaceDocument,
        variables: {
          cedarSystemId: 'invalid'
        }
      },
      error: new Error('System not found')
    };

    render(
      <Provider store={store}>
        <VerboseMockedProvider mocks={[invalidCedarSystemQuery]}>
          <MemoryRouter initialEntries={['/systems/invalid/edit']}>
            <Route path="/systems/:systemId/edit">
              <EditSystemProfile />
            </Route>
          </MemoryRouter>
        </VerboseMockedProvider>
      </Provider>
    );

    await screen.findByRole('heading', { name: 'This page cannot be found.' });
  });
});
