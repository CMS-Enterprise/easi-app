import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import {
  CedarRole,
  GetCedarSystemDocument,
  GetCedarSystemQuery,
  GetCedarSystemQueryVariables,
  GetSystemWorkspaceDocument
} from 'gql/generated/graphql';
import teamRoles from 'tests/mock/workspaceTeamRoles';

import { MessageProvider } from 'hooks/useMessage';
import { MockedQuery } from 'types/util';
import easiMockStore from 'utils/testing/easiMockStore';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import EditSystemProfile from '.';

const mockSystemSectionLockContextProvider = vi.hoisted(() =>
  vi.fn(({ children }) => children)
);

const mockSystemProfileLockWrapper = vi.hoisted(() =>
  vi.fn(({ children }) => children)
);

vi.mock('launchdarkly-react-client-sdk', () => ({
  useFlags: () => ({
    editableSystemProfile: true,
    systemWorkspaceTeam: true
  })
}));

vi.mock('contexts/SystemSectionLockContext', () => ({
  __esModule: true,
  default: mockSystemSectionLockContextProvider,
  useSystemSectionLockContext: () => ({
    systemProfileSectionLocks: [],
    loading: false
  })
}));

vi.mock('./_components/SystemProfileLockWrapper', () => ({
  __esModule: true,
  default: mockSystemProfileLockWrapper
}));

const cedarSystemId = '11AB1A00-1234-5678-ABC1-1A001B00CC1B';
const cedarSystemName = 'Office of Funny Walks';

const store = easiMockStore();

const renderEditSystemProfile = ({
  initialEntry,
  allowGenericEdit = true,
  viewerCanAccessProfile = true,
  viewerCanAccessWorkspace = true,
  isMySystem = true,
  roles = []
}: {
  initialEntry: string;
  allowGenericEdit?: boolean;
  viewerCanAccessProfile?: boolean;
  viewerCanAccessWorkspace?: boolean;
  isMySystem?: boolean;
  roles?: CedarRole[];
}) => {
  const isWorkspaceTeamRoute = initialEntry.startsWith(
    `/systems/${cedarSystemId}/edit/team`
  );

  const mocks: MockedQuery[] = [];

  if (!isWorkspaceTeamRoute) {
    mocks.push(
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
                  isBookmarked: false,
                  viewerCanAccessWorkspace
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
    );
  }

  if (isWorkspaceTeamRoute) {
    mocks.push({
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
            isMySystem,
            cedarSystem: {
              __typename: 'CedarSystemWorkspaceSystem',
              id: cedarSystemId,
              name: cedarSystemName,
              isBookmarked: false,
              viewerCanAccessProfile,
              linkedTrbRequests: [],
              linkedSystemIntakes: []
            },
            roles
          }
        }
      }
    });
  }

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
  beforeEach(() => {
    mockSystemSectionLockContextProvider.mockClear();
    mockSystemProfileLockWrapper.mockClear();
  });

  it('renders the system name for the generic edit hub', async () => {
    renderEditSystemProfile({
      initialEntry: `/systems/${cedarSystemId}/edit`
    });

    await screen.findByText(`for ${cedarSystemName}`);
  });

  it('hides the team card for profile-only viewers on the generic edit hub', async () => {
    renderEditSystemProfile({
      initialEntry: `/systems/${cedarSystemId}/edit`,
      viewerCanAccessWorkspace: false
    });

    await screen.findByText(`for ${cedarSystemName}`);

    expect(screen.queryByTestId('section-card-TEAM')).not.toBeInTheDocument();
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

    expect(mockSystemSectionLockContextProvider).not.toHaveBeenCalled();
    expect(mockSystemProfileLockWrapper).not.toHaveBeenCalled();
  });

  it('renders existing team members on the edit hub team route', async () => {
    renderEditSystemProfile({
      initialEntry: `/systems/${cedarSystemId}/edit/team`,
      roles: teamRoles
    });

    expect(
      await screen.findByRole('heading', { name: 'Edit System Profile: Team' })
    ).toBeInTheDocument();

    expect(await screen.findByText('Vickie Denesik')).toBeInTheDocument();
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
