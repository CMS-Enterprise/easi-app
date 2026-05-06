import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  GetCedarContactsQuery,
  GetSystemIntakeDocument,
  SystemIntakeFormState
} from 'gql/generated/graphql';
import i18next from 'i18next';
import configureMockStore from 'redux-mock-store';
import {
  businessOwner,
  documents,
  getCedarContactsQuery,
  getSystemIntakeContactsQuery,
  getSystemIntakeQuery,
  productManager,
  requester,
  systemIntake
} from 'tests/mock/systemIntake';

import { MessageProvider } from 'hooks/useMessage';
import formatContactLabel from 'utils/formatContactLabel';

import { SystemIntake } from './index';

vi.mock('@okta/okta-react', () => ({
  useOktaAuth: () => {
    return {
      authState: {
        isAuthenticated: true
      },
      oktaAuth: {
        getAccessToken: () => Promise.resolve('test-access-token'),
        getUser: async () => ({
          name: 'Jerry Seinfeld',
          preferred_usename: 'SF13',
          email: 'jerry@local.fake'
        })
      }
    };
  }
}));

const requesterContact: GetCedarContactsQuery['cedarPersonsByCommonName'][number] =
  {
    __typename: 'UserInfo',
    commonName: requester.userAccount.commonName,
    email: requester.userAccount.email,
    euaUserId: requester.userAccount.username
  };

const businessOwnerContact: GetCedarContactsQuery['cedarPersonsByCommonName'][number] =
  {
    __typename: 'UserInfo',
    commonName: businessOwner.userAccount.commonName,
    email: businessOwner.userAccount.email,
    euaUserId: businessOwner.userAccount.username
  };

const productManagerContact: GetCedarContactsQuery['cedarPersonsByCommonName'][number] =
  {
    __typename: 'UserInfo',
    commonName: productManager.userAccount.commonName,
    email: productManager.userAccount.email,
    euaUserId: productManager.userAccount.username
  };

describe('The System Intake page', () => {
  const mockStore = configureMockStore();

  const createStore = (euaId = requester.userAccount.username) =>
    mockStore({
      auth: {
        euaId,
        isUserSet: true
      },
      systemIntake: { systemIntake: {} },
      action: {}
    });

  const renderSystemIntake = ({
    route,
    mocks,
    store = createStore()
  }: {
    route: string;
    mocks: React.ComponentProps<typeof MockedProvider>['mocks'];
    store?: ReturnType<typeof createStore>;
  }) =>
    render(
      <MemoryRouter initialEntries={[route]}>
        <MockedProvider mocks={mocks}>
          <Provider store={store}>
            <MessageProvider>
              <Route path="/system/:systemId/:formPage/:subPage?">
                <SystemIntake />
              </Route>
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

  it('renders without crashing', async () => {
    renderSystemIntake({
      route: `/system/${systemIntake.id}/contact-details`,
      mocks: [
        getSystemIntakeQuery(),
        getSystemIntakeContactsQuery(),
        getCedarContactsQuery(
          formatContactLabel(requesterContact),
          requesterContact
        ),
        getCedarContactsQuery(
          formatContactLabel(businessOwnerContact),
          businessOwnerContact
        ),
        getCedarContactsQuery(
          formatContactLabel(productManagerContact),
          productManagerContact
        )
      ]
    });

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(screen.getByTestId('system-intake')).toBeInTheDocument();
  });

  it('renders when server-side requester authorization allows the viewer', async () => {
    renderSystemIntake({
      route: `/system/${systemIntake.id}/view`,
      mocks: [
        getSystemIntakeQuery({
          viewerIsRequester: true,
          euaUserId: requester.userAccount.username,
          requester: {
            ...systemIntake.requester!,
            userAccount: {
              ...requester.userAccount,
              username: 'STALE'
            }
          }
        }),
        getSystemIntakeContactsQuery()
      ]
    });

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(screen.getByTestId('system-intake')).toBeInTheDocument();
  });

  it('renders not found when the viewer is not the requester', async () => {
    renderSystemIntake({
      route: `/system/${systemIntake.id}/view`,
      mocks: [
        getSystemIntakeQuery({
          viewerIsRequester: false
        }),
        getSystemIntakeContactsQuery()
      ]
    });

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(
      screen.getByRole('heading', {
        name: /this page cannot be found/i,
        level: 1
      })
    ).toBeInTheDocument();
  });

  it('renders document upload', async () => {
    const user = userEvent.setup();

    renderSystemIntake({
      route: `/system/${systemIntake.id}/documents`,
      mocks: [getSystemIntakeQuery({ documents })]
    });

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(
      screen.getByRole('heading', {
        name: /additional documentation/i,
        level: 1
      })
    ).toBeInTheDocument();

    const button = screen.getByRole('button', { name: 'Add another document' });
    await user.click(button);

    // Check that upload form page renders
    expect(
      screen.getByRole('heading', {
        name: /upload a document/i,
        level: 1
      })
    ).toBeInTheDocument();
  });

  it('renders intake review page', async () => {
    renderSystemIntake({
      route: `/system/${systemIntake.id}/review`,
      mocks: [getSystemIntakeQuery(), getSystemIntakeContactsQuery()]
    });

    expect(
      await screen.findByRole('heading', {
        name: /check your answers before sending/i,
        level: 1
      })
    ).toBeInTheDocument();
  });

  it('renders confirmation page', async () => {
    renderSystemIntake({
      route: `/system/${systemIntake.id}/confirmation`,
      mocks: [getSystemIntakeQuery()]
    });

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(
      screen.getByRole('heading', {
        name: /Success!/i,
        level: 1
      })
    ).toBeInTheDocument();
  });

  it('renders intake view page', async () => {
    renderSystemIntake({
      route: `/system/${systemIntake.id}/view`,
      mocks: [getSystemIntakeQuery(), getSystemIntakeContactsQuery()]
    });

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(
      screen.getByRole('heading', {
        name: /View submitted Intake Request/i,
        level: 1
      })
    ).toBeInTheDocument();
  });

  it('renders not found page for unrecognized route', async () => {
    renderSystemIntake({
      route: `/system/${systemIntake.id}/mumbo-jumbo`,
      mocks: [getSystemIntakeQuery()]
    });

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(
      screen.getByRole('heading', {
        name: /this page cannot be found/i,
        level: 1
      })
    ).toBeInTheDocument();
  });

  it('renders not found page for invalid intake id', async () => {
    const invalidIntakeQuery = {
      request: {
        query: GetSystemIntakeDocument,
        variables: {
          id: systemIntake.id
        }
      },
      result: {
        data: {
          systemIntake: null
        }
      }
    };

    renderSystemIntake({
      route: `/system/${systemIntake.id}/mumbo-jumbo`,
      mocks: [invalidIntakeQuery]
    });

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(
      screen.getByRole('heading', {
        name: /this page cannot be found/i,
        level: 1
      })
    ).toBeInTheDocument();
  });

  it('renders feedback banner if edits are requested', async () => {
    renderSystemIntake({
      route: `/system/${systemIntake.id}/request-details`,
      mocks: [
        getSystemIntakeQuery({
          requestFormState: SystemIntakeFormState.EDITS_REQUESTED
        })
      ]
    });

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(
      screen.getByText(
        i18next.t<string>('intake:feedback', { type: 'Intake Request' })
      )
    ).toBeInTheDocument();
  });
});
