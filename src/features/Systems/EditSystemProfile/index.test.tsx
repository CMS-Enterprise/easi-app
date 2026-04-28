import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import {
  GetSystemWorkspaceDocument,
  GetSystemWorkspaceQuery,
  GetSystemWorkspaceQueryVariables
} from 'gql/generated/graphql';

import { MockedQuery } from 'types/util';
import easiMockStore from 'utils/testing/easiMockStore';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import EditSystemProfile from '.';

vi.mock('launchdarkly-react-client-sdk', () => ({
  useFlags: () => ({
    editableSystemProfile: true
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
      cedarAuthorityToOperate: [],
      cedarSystemDetails: {
        __typename: 'CedarSystemDetails',
        isMySystem: true,
        cedarSystem: {
          __typename: 'CedarSystem',
          id: cedarSystemId,
          name: cedarSystemName,
          isBookmarked: false,
          linkedTrbRequests: [],
          linkedSystemIntakes: []
        },
        roles: []
      }
    }
  }
};

const store = easiMockStore();

describe('EditSystemProfile', () => {
  it('renders the system name', async () => {
    render(
      <Provider store={store}>
        <VerboseMockedProvider mocks={[getSystemWorkspaceQuery]}>
          <MemoryRouter initialEntries={[`/systems/${cedarSystemId}/edit`]}>
            <Route path="/systems/:systemId/edit">
              <EditSystemProfile />
            </Route>
          </MemoryRouter>
        </VerboseMockedProvider>
      </Provider>
    );

    await screen.findByText(`for ${cedarSystemName}`);
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
      result: {
        data: {
          __typename: 'Query',
          cedarAuthorityToOperate: [],
          cedarSystemDetails: null
        }
      }
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
