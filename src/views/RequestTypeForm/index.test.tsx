import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Switch } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';

import { MessageProvider } from 'hooks/useMessage';
import CreateSystemIntake from 'queries/SystemIntakeQueries';
import GovernanceOverview from 'views/GovernanceOverview';
import GovernanceTaskList from 'views/GovernanceTaskList';
import SystemIntake from 'views/SystemIntake';

import RequestTypeForm from './index';

jest.mock('@okta/okta-react', () => ({
  useOktaAuth: () => {
    return {
      authState: {
        isAuthenticated: true
      },
      oktaAuth: {
        getAccessToken: () => Promise.resolve('test-access-token'),
        getUser: () =>
          Promise.resolve({
            name: 'John Doe'
          })
      }
    };
  }
}));

window.scrollTo = jest.fn();

describe('The request type form page', () => {
  const mockStore = configureMockStore();
  const store = mockStore({
    systemIntake: { systemIntake: {} },
    action: {}
  });

  const renderPage = (queries: any[]) =>
    render(
      <MemoryRouter initialEntries={['/system/request-type']}>
        <Provider store={store}>
          <MessageProvider>
            <MockedProvider mocks={queries} addTypename={false}>
              <Switch>
                <Route path="/system/request-type">
                  <RequestTypeForm />
                </Route>
                <Route path="/governance-overview/:systemId?">
                  <GovernanceOverview />
                </Route>
                <Route path="/governance-task-list/:systemId?">
                  <GovernanceTaskList />
                </Route>
                <Route path="/system/:systemId/:formPage">
                  <SystemIntake />
                </Route>
              </Switch>
            </MockedProvider>
          </MessageProvider>
        </Provider>
      </MemoryRouter>
    );

  it('renders without crashing', async () => {
    renderPage([]);
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    expect(screen.getByTestId('request-type-form')).toBeInTheDocument();
  });

  it('creates a new intake', async () => {
    const intakeMutation = {
      request: {
        query: CreateSystemIntake,
        variables: {
          input: {
            requestType: 'NEW',
            requester: {
              name: 'John Doe'
            }
          }
        }
      },
      result: {
        data: {
          createSystemIntake: {
            id: '6aa61a37-d3b4-47ed-ad61-0b8f73151d74',
            status: 'INTAKE_DRAFT',
            requestType: 'NEW',
            requester: {
              name: 'John Doe'
            }
          }
        }
      }
    };

    renderPage([intakeMutation]);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    screen.getByRole('radio', { name: /new system/i }).click();
    screen.getByRole('button', { name: /continue/i }).click();

    expect(
      await screen.findByTestId('governance-overview')
    ).toBeInTheDocument();
  });

  it('creates a major changes intake', async () => {
    const intakeMutation = {
      request: {
        query: CreateSystemIntake,
        variables: {
          input: {
            requestType: 'MAJOR_CHANGES',
            requester: {
              name: 'John Doe'
            }
          }
        }
      },
      result: {
        data: {
          createSystemIntake: {
            id: '6aa61a37-d3b4-47ed-ad61-0b8f73151d74',
            status: 'INTAKE_DRAFT',
            requestType: 'MAJOR_CHANGES',
            requester: {
              name: 'John Doe'
            }
          }
        }
      }
    };

    renderPage([intakeMutation]);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    screen.getByRole('radio', { name: /major changes/i }).click();
    screen.getByRole('button', { name: /continue/i }).click();

    expect(
      await screen.findByTestId('governance-task-list')
    ).toBeInTheDocument();
  });

  it('creates a recompete intake', async () => {
    const intakeMutation = {
      request: {
        query: CreateSystemIntake,
        variables: {
          input: {
            requestType: 'RECOMPETE',
            requester: {
              name: 'John Doe'
            }
          }
        }
      },
      result: {
        data: {
          createSystemIntake: {
            id: '6aa61a37-d3b4-47ed-ad61-0b8f73151d74',
            status: 'INTAKE_DRAFT',
            requestType: 'RECOMPETE',
            requester: {
              name: 'John Doe'
            }
          }
        }
      }
    };

    renderPage([intakeMutation]);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    screen.getByRole('radio', { name: /re-compete/i }).click();
    screen.getByRole('button', { name: /continue/i }).click();

    expect(
      await screen.findByTestId('governance-task-list')
    ).toBeInTheDocument();
  });

  it('creates a shutdown intake', async () => {
    const intakeMutation = {
      request: {
        query: CreateSystemIntake,
        variables: {
          input: {
            requestType: 'SHUTDOWN',
            requester: {
              name: 'John Doe'
            }
          }
        }
      },
      result: {
        data: {
          createSystemIntake: {
            id: '6aa61a37-d3b4-47ed-ad61-0b8f73151d74',
            status: 'INTAKE_DRAFT',
            requestType: 'SHUTDOWN',
            requester: {
              name: 'John Doe'
            }
          }
        }
      }
    };

    renderPage([intakeMutation]);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    screen.getByRole('radio', { name: /decommission/i }).click();
    screen.getByRole('button', { name: /continue/i }).click();

    expect(await screen.findByTestId('system-intake')).toBeInTheDocument();
  });

  it('creates a shutdown intake', async () => {
    renderPage([]);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    screen.getByRole('button', { name: /continue/i }).click();

    expect(
      await screen.findByTestId('formik-validation-errors')
    ).toBeInTheDocument();
  });
});
