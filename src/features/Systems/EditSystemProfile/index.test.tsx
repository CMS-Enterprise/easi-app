import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import {
  GetCedarSystemDocument,
  GetCedarSystemQuery,
  GetCedarSystemQueryVariables,
  GetSystemWorkspaceDocument
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
  allowGenericEdit = true,
  viewerCanAccessProfile = true
}: {
  initialEntry: string;
  allowGenericEdit?: boolean;
  viewerCanAccessProfile?: boolean;
}) => {
  const isWorkspaceTeamRoute = initialEntry.startsWith(
    `/systems/${cedarSystemId}/edit/team`
  );

  const mocks: MockedQuery[] = isWorkspaceTeamRoute
    ? [
        {
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
        }
      ]
    : [
        allowGenericEdit
          ? {
              request: {
                query: GetCedarSystemDocument,
                variables: {
                  id: cedarSystemId
                }
              },
              result: {
                data: {
                  __typename: 'Query',
                  cedarSystem: {
                    __typename: 'CedarSystem',
                    id: cedarSystemId,
                    name: cedarSystemName,
                    description: null,
                    acronym: null,
                    status: null,
                    businessOwnerOrg: null,
                    businessOwnerOrgComp: null,
                    systemMaintainerOrg: null,
                    systemMaintainerOrgComp: null,
                    isBookmarked: false
                  }
                }
              }
            }
          : {
              request: {
                query: GetCedarSystemDocument,
                variables: {
                  id: cedarSystemId
                }
              },
              error: new Error('Unauthorized')
            }
      ];

  return render(
    <Provider store={store}>
      <VerboseMockedProvider mocks={mocks}>
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
  it('renders the system name for the generic edit hub', async () => {
    renderEditSystemProfile({
      initialEntry: `/systems/${cedarSystemId}/edit`
    });

    await screen.findByText(`for ${cedarSystemName}`);
  });

  it('blocks workspace-only viewers from the generic edit hub', async () => {
    renderEditSystemProfile({
      initialEntry: `/systems/${cedarSystemId}/edit`,
      allowGenericEdit: false
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
      GetCedarSystemQuery,
      GetCedarSystemQueryVariables
    > = {
      request: {
        query: GetCedarSystemDocument,
        variables: {
          id: 'invalid'
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
