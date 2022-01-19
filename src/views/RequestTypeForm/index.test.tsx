import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Switch } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';

import { initialSystemIntakeForm } from 'data/systemIntake';
import { MessageProvider } from 'hooks/useMessage';
import GetSystemIntakeQuery from 'queries/GetSystemIntakeQuery';
import { CreateSystemIntake } from 'queries/SystemIntakeQueries';
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
const INTAKE_ID = '6aa61a37-d3b4-47ed-ad61-0b8f73151d74';
const intakeQuery = (intakeData: any) => {
  return {
    request: {
      query: GetSystemIntakeQuery,
      variables: {
        id: INTAKE_ID
      }
    },
    result: {
      data: {
        systemIntake: {
          id: INTAKE_ID,
          adminLead: '',
          businessNeed: '',
          businessSolution: '',
          businessOwner: {
            component: '',
            name: ''
          },
          contract: {
            contractor: null,
            endDate: {
              day: null,
              month: null,
              year: null
            },
            hasContract: '',
            startDate: {
              day: null,
              month: null,
              year: null
            },
            vehicle: null
          },
          costs: {
            isExpectingIncrease: null,
            expectedIncreaseAmount: null
          },
          currentStage: null,
          decisionNextSteps: null,
          grbDate: null,
          grtDate: null,
          grtFeedbacks: [],
          governanceTeams: {
            isPresent: null,
            teams: null
          },
          isso: {
            isPresent: null,
            name: null
          },
          fundingSource: {
            fundingNumber: null,
            isFunded: null,
            source: null
          },
          lcid: null,
          lcidExpiresAt: null,
          lcidScope: null,
          lcidCostBaseline: null,
          needsEaSupport: null,
          productManager: {
            component: null,
            name: null
          },
          rejectionReason: null,
          requester: {
            component: null,
            email: null,
            name: null
          },
          requestName: null,
          requestType: 'NEW',
          status: 'INTAKE_DRAFT',
          grtReviewEmailBody: null,
          decidedAt: null,
          businessCaseId: null,
          submittedAt: null,
          updatedAt: '2021-09-22T18:25:59Z',
          createdAt: '2021-09-21T20:06:29Z',
          archivedAt: null,
          euaUserId: 'ASDF',
          lastAdminNote: {
            content: null,
            createdAt: null
          },
          ...intakeData
        }
      }
    }
  };
};

describe('The request type form page', () => {
  const mockStore = configureMockStore();
  const store = mockStore({
    systemIntake: { systemIntake: initialSystemIntakeForm },
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
      expect(screen.getAllByText('John Doe')[0]).toBeInTheDocument();
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
            id: INTAKE_ID,
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
      expect(screen.getAllByText('John Doe')[0]).toBeInTheDocument();
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
            id: INTAKE_ID,
            status: 'INTAKE_DRAFT',
            requestType: 'MAJOR_CHANGES',
            requester: {
              name: 'John Doe'
            }
          }
        }
      }
    };

    renderPage([intakeMutation, intakeQuery({ requestType: 'MAJOR_CHANGES' })]);

    await waitFor(() => {
      expect(screen.getAllByText('John Doe')[0]).toBeInTheDocument();
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
            id: INTAKE_ID,
            status: 'INTAKE_DRAFT',
            requestType: 'RECOMPETE',
            requester: {
              name: 'John Doe'
            }
          }
        }
      }
    };

    renderPage([intakeMutation, intakeQuery({ requestType: 'RECOMPETE' })]);

    await waitFor(() => {
      expect(screen.getAllByText('John Doe')[0]).toBeInTheDocument();
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
            id: INTAKE_ID,
            status: 'INTAKE_DRAFT',
            requestType: 'SHUTDOWN',
            requester: {
              name: 'John Doe'
            }
          }
        }
      }
    };

    renderPage([intakeMutation, intakeQuery({})]);

    await waitFor(() => {
      expect(screen.getAllByText('John Doe')[0]).toBeInTheDocument();
    });

    screen.getByRole('radio', { name: /decommission/i }).click();
    screen.getByRole('button', { name: /continue/i }).click();

    expect(await screen.findByTestId('system-intake')).toBeInTheDocument();
  });

  it('executes request type validations', async () => {
    renderPage([]);

    await waitFor(() => {
      expect(screen.getAllByText('John Doe')[0]).toBeInTheDocument();
    });

    screen.getByRole('button', { name: /continue/i }).click();

    expect(
      await screen.findByTestId('formik-validation-errors')
    ).toBeInTheDocument();
  });
});
