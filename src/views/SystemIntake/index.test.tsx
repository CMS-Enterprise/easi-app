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
import configureMockStore from 'redux-mock-store';

import {
  documents,
  getSystemIntakeQuery,
  systemIntake
} from 'data/mock/systemIntake';
import { MessageProvider } from 'hooks/useMessage';
import GetSytemIntakeQuery from 'queries/GetSystemIntakeQuery';

import { SystemIntake } from './index';

jest.mock('@okta/okta-react', () => ({
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

describe('The System Intake page', () => {
  it('renders without crashing', async () => {
    render(
      <MemoryRouter
        initialEntries={[`/system/${systemIntake.id}/contact-details`]}
      >
        <MockedProvider mocks={[getSystemIntakeQuery]}>
          <Route path="/system/:systemId/:formPage">
            <SystemIntake />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(screen.getByTestId('system-intake')).toBeInTheDocument();
  });

  it('renders request details', async () => {
    render(
      <MemoryRouter
        initialEntries={[`/system/${systemIntake.id}/request-details`]}
      >
        <MockedProvider mocks={[getSystemIntakeQuery]}>
          <Route path="/system/:systemId/:formPage">
            <SystemIntake />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(
      screen.getByRole('heading', { name: /request details/i, level: 1 })
    ).toBeInTheDocument();
  });

  it('renders contract details', async () => {
    render(
      <MemoryRouter
        initialEntries={[`/system/${systemIntake.id}/contract-details`]}
      >
        <MockedProvider mocks={[getSystemIntakeQuery]}>
          <Route path="/system/:systemId/:formPage">
            <SystemIntake />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(
      screen.getByRole('heading', { name: /contract details/i, level: 1 })
    ).toBeInTheDocument();
  });

  it('renders document upload', async () => {
    render(
      <MemoryRouter initialEntries={[`/system/${systemIntake.id}/documents`]}>
        <MockedProvider
          mocks={[
            {
              ...getSystemIntakeQuery,
              result: {
                data: {
                  systemIntake: {
                    ...systemIntake,
                    documents
                  }
                }
              }
            }
          ]}
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
        name: /additional documentation/i,
        level: 1
      })
    ).toBeInTheDocument();

    const button = screen.getByRole('button', { name: 'Add another document' });
    userEvent.click(button);

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
        <MockedProvider mocks={[getSystemIntakeQuery]}>
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
        <MockedProvider mocks={[getSystemIntakeQuery]}>
          <Route path="/system/:systemId/:formPage">
            <SystemIntake />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(
      screen.getByRole('heading', {
        name: /your intake request has been submitted/i,
        level: 1
      })
    ).toBeInTheDocument();
  });

  it('renders intake view page', async () => {
    render(
      <MemoryRouter initialEntries={[`/system/${systemIntake.id}/view`]}>
        <MockedProvider mocks={[getSystemIntakeQuery]}>
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
        name: /review your intake request/i,
        level: 1
      })
    ).toBeInTheDocument();
  });

  it('renders not found page for unrecognized route', async () => {
    render(
      <MemoryRouter initialEntries={[`/system/${systemIntake.id}/mumbo-jumbo`]}>
        <MockedProvider mocks={[getSystemIntakeQuery]}>
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
        query: GetSytemIntakeQuery,
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
});
