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
  it('renders without crashing', async () => {
    render(
      <MemoryRouter
        initialEntries={[`/system/${systemIntake.id}/contact-details`]}
      >
        <MockedProvider
          mocks={[
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
          ]}
        >
          <Route path="/system/:systemId/:formPage">
            <SystemIntake />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(screen.getByTestId('system-intake')).toBeInTheDocument();
  });

  it('renders document upload', async () => {
    const mockStore = configureMockStore();
    const store = mockStore({
      auth: {
        euaId: 'ABCD'
      },
      systemIntake: { systemIntake: {} },
      action: {}
    });
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={[`/system/${systemIntake.id}/documents`]}>
        <MockedProvider mocks={[getSystemIntakeQuery({ documents })]}>
          <Provider store={store}>
            <MessageProvider>
              <Route path="/system/:systemId/:formPage">
                <SystemIntake />
              </Route>
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );
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
    const mockStore = configureMockStore();
    const store = mockStore({
      auth: {
        euaId: 'ABCD'
      },
      systemIntake: { systemIntake: {} },
      action: {}
    });
    render(
      <MemoryRouter initialEntries={[`/system/${systemIntake.id}/review`]}>
        <MockedProvider
          mocks={[getSystemIntakeQuery(), getSystemIntakeContactsQuery()]}
        >
          <Provider store={store}>
            <MessageProvider>
              <Route path="/system/:systemId/:formPage">
                <SystemIntake />
              </Route>
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(
      await screen.findByRole('heading', {
        name: /check your answers before sending/i,
        level: 1
      })
    ).toBeInTheDocument();
  });

  it('renders confirmation page', async () => {
    render(
      <MemoryRouter
        initialEntries={[`/system/${systemIntake.id}/confirmation`]}
      >
        <MockedProvider mocks={[getSystemIntakeQuery()]}>
          <Route path="/system/:systemId/:formPage">
            <SystemIntake />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(
      screen.getByRole('heading', {
        name: /your Intake Request has been submitted/i,
        level: 1
      })
    ).toBeInTheDocument();
  });

  it('renders intake view page', async () => {
    render(
      <MemoryRouter initialEntries={[`/system/${systemIntake.id}/view`]}>
        <MockedProvider
          mocks={[getSystemIntakeQuery(), getSystemIntakeContactsQuery()]}
        >
          <MessageProvider>
            <Route path="/system/:systemId/:formPage">
              <SystemIntake />
            </Route>
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(
      screen.getByRole('heading', {
        name: /review your Intake Request/i,
        level: 1
      })
    ).toBeInTheDocument();
  });

  it('renders not found page for unrecognized route', async () => {
    render(
      <MemoryRouter initialEntries={[`/system/${systemIntake.id}/mumbo-jumbo`]}>
        <MockedProvider mocks={[getSystemIntakeQuery()]}>
          <Route path="/system/:systemId/:formPage">
            <SystemIntake />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
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
    render(
      <MemoryRouter initialEntries={[`/system/${systemIntake.id}/mumbo-jumbo`]}>
        <MockedProvider mocks={[invalidIntakeQuery]}>
          <Route path="/system/:systemId/:formPage">
            <SystemIntake />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(
      screen.getByRole('heading', {
        name: /this page cannot be found/i,
        level: 1
      })
    ).toBeInTheDocument();
  });

  it('renders feedback banner if edits are requested', async () => {
    render(
      <MemoryRouter
        initialEntries={[`/system/${systemIntake.id}/request-details`]}
      >
        <MockedProvider
          mocks={[
            getSystemIntakeQuery({
              requestFormState: SystemIntakeFormState.EDITS_REQUESTED
            })
          ]}
        >
          <Route path="/system/:systemId/:formPage">
            <SystemIntake />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(
      screen.getByText(
        i18next.t<string>('intake:feedback', { type: 'Intake Request' })
      )
    ).toBeInTheDocument();
  });
});
