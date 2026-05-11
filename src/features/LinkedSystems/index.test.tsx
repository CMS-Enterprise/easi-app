import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import {
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import {
  GetCedarSystemsDocument,
  GetCedarSystemsQuery,
  GetCedarSystemsQueryVariables,
  GetSystemIntakeSystemsDocument,
  GetSystemIntakeSystemsQuery,
  GetSystemIntakeSystemsQueryVariables,
  SystemRelationshipType
} from 'gql/generated/graphql';
import { getSystemIntakeQuery, systemIntake } from 'tests/mock/systemIntake';

import { MessageProvider } from 'hooks/useMessage';
import { MockedQuery } from 'types/util';
import easiMockStore from 'utils/testing/easiMockStore';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import LinkedSystems from '.';

vi.mock('launchdarkly-react-client-sdk', () => ({
  useFlags: () => ({})
}));

const getCedarSystemsQuery: MockedQuery<
  GetCedarSystemsQuery,
  GetCedarSystemsQueryVariables
> = {
  request: {
    query: GetCedarSystemsDocument,
    variables: {}
  },
  result: {
    data: {
      __typename: 'Query',
      cedarSystems: [
        {
          __typename: 'CedarSystem',
          id: '11AB1A00-1234-5678-ABC1-1A001B00CC0A',
          name: 'Centers for Management Services',
          description: 'A test Cedar system',
          acronym: 'CMS',
          status: 'ACTIVE',
          businessOwnerOrg: null,
          businessOwnerOrgComp: null,
          systemMaintainerOrg: null,
          systemMaintainerOrgComp: null,
          isBookmarked: false,
          viewerCanAccessProfile: true,
          viewerCanAccessWorkspace: true,
          atoExpirationDate: null,
          oaStatus: null
        }
      ]
    }
  }
};

const getSystemIntakeSystemsQuery = (
  systemIntakeId: string
): MockedQuery<
  GetSystemIntakeSystemsQuery,
  GetSystemIntakeSystemsQueryVariables
> => ({
  request: {
    query: GetSystemIntakeSystemsDocument,
    variables: {
      systemIntakeId
    }
  },
  result: {
    data: {
      __typename: 'Query',
      systemIntakeSystems: [
        {
          __typename: 'SystemIntakeSystem',
          id: 'system-intake-system-1',
          systemIntakeID: systemIntakeId,
          systemID: '11AB1A00-1234-5678-ABC1-1A001B00CC0A',
          systemRelationshipType: [SystemRelationshipType.PRIMARY_SUPPORT],
          otherSystemRelationshipDescription: null
        }
      ]
    }
  }
});

const renderLinkedSystems = ({
  intakeOverrides,
  groups,
  locationState
}: {
  intakeOverrides?: Partial<typeof systemIntake>;
  groups?: Array<'EASI_D_GOVTEAM'>;
  locationState?: Record<string, unknown>;
}) => {
  const intakeId = intakeOverrides?.id || systemIntake.id;
  const store = easiMockStore({
    euaUserId: 'ABCD',
    groups
  });

  return render(
    <MemoryRouter
      initialEntries={[
        locationState
          ? { pathname: `/linked-systems/${intakeId}`, state: locationState }
          : `/linked-systems/${intakeId}`
      ]}
    >
      <VerboseMockedProvider
        mocks={[
          getCedarSystemsQuery,
          getSystemIntakeQuery({
            id: intakeId,
            ...intakeOverrides
          }),
          getSystemIntakeSystemsQuery(intakeId)
        ]}
      >
        <Provider store={store}>
          <MessageProvider>
            <Route path="/linked-systems/:id">
              <LinkedSystems />
            </Route>
          </MessageProvider>
        </Provider>
      </VerboseMockedProvider>
    </MemoryRouter>
  );
};

describe('LinkedSystems', () => {
  it('renders for the requester from the task-list flow', async () => {
    renderLinkedSystems({
      locationState: { from: 'task-list' }
    });

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    screen.getByRole('heading', {
      level: 1,
      name: 'Edit linked system(s)'
    });
    screen.getByRole('button', { name: 'Add a system' });
    screen.getByRole('button', { name: 'Return to task list' });
  });

  it('renders for an IT Gov admin even when the viewer is not the requester', async () => {
    renderLinkedSystems({
      groups: ['EASI_D_GOVTEAM'],
      intakeOverrides: {
        viewerIsRequester: false
      },
      locationState: { from: 'admin' }
    });

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    screen.getByRole('heading', {
      level: 1,
      name: 'Edit linked system(s)'
    });
    screen.getByRole('button', { name: 'Return to request details' });
  });

  it('renders page not found for a non-requester without admin access', async () => {
    renderLinkedSystems({
      intakeOverrides: {
        viewerIsRequester: false
      }
    });

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    screen.getByRole('heading', {
      level: 1,
      name: 'This page cannot be found.'
    });
  });
});
