import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import {
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  GetCedarSystemsDocument,
  GetCedarSystemsQuery,
  GetCedarSystemsQueryVariables,
  GetSystemIntakeSystemsDocument,
  GetSystemIntakeSystemsQuery,
  GetSystemIntakeSystemsQueryVariables
} from 'gql/generated/graphql';
import { getSystemIntakeQuery, systemIntake } from 'tests/mock/systemIntake';

import { MessageProvider } from 'hooks/useMessage';
import { MockedQuery } from 'types/util';
import easiMockStore from 'utils/testing/easiMockStore';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import LinkedSystemsForm from '.';

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
        },
        {
          __typename: 'CedarSystem',
          id: '22AB1A00-1234-5678-ABC1-1A001B00CC0A',
          name: 'Quality Payment Program',
          description: 'Another test Cedar system',
          acronym: 'QPP',
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
      systemIntakeSystems: []
    }
  }
});

const renderLinkedSystemsForm = ({
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
          ? {
              pathname: `/linked-systems-form/${intakeId}`,
              state: locationState
            }
          : `/linked-systems-form/${intakeId}`
      ]}
    >
      <VerboseMockedProvider
        mocks={[
          getCedarSystemsQuery,
          getSystemIntakeSystemsQuery(intakeId),
          getSystemIntakeQuery({
            id: intakeId,
            ...intakeOverrides
          })
        ]}
      >
        <Provider store={store}>
          <MessageProvider>
            <Route path="/linked-systems-form/:systemIntakeID">
              <LinkedSystemsForm />
            </Route>
          </MessageProvider>
        </Provider>
      </VerboseMockedProvider>
    </MemoryRouter>
  );
};

describe('LinkedSystemsForm', () => {
  it('renders the add-system form for the requester', async () => {
    renderLinkedSystemsForm({
      locationState: { from: 'task-list' }
    });

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    screen.getByRole('heading', {
      level: 1,
      name: 'Add a system link'
    });
    screen.getByRole('combobox');
    expect(
      screen.queryByText('Please select a CMS System')
    ).not.toBeInTheDocument();
    screen.getByRole('button', { name: 'Add system' });
  });

  it('filters Cedar system options as the requester types', async () => {
    const user = userEvent.setup();

    renderLinkedSystemsForm({
      locationState: { from: 'task-list' }
    });

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    const cedarSystemInput = screen.getByRole('combobox');

    await user.type(cedarSystemInput, 'Centers');

    const matchingSystem = await screen.findByRole('option', {
      name: 'Centers for Management Services (CMS)'
    });

    expect(matchingSystem).toBeVisible();
    expect(
      screen.queryByRole('option', { name: 'Quality Payment Program (QPP)' })
    ).not.toBeInTheDocument();

    await user.click(matchingSystem);

    expect(cedarSystemInput).toHaveValue(
      'Centers for Management Services (CMS)'
    );
  });

  it('renders the add-system form for an IT Gov admin', async () => {
    renderLinkedSystemsForm({
      groups: ['EASI_D_GOVTEAM'],
      intakeOverrides: {
        viewerIsRequester: false
      },
      locationState: { from: 'admin' }
    });

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    screen.getByRole('heading', {
      level: 1,
      name: 'Add a system link'
    });
    screen.getByRole('combobox');
  });

  it('renders page not found for a non-requester without admin access', async () => {
    renderLinkedSystemsForm({
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
