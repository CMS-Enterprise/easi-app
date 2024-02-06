import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Switch } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';

import { systemIntake } from 'data/mock/systemIntake';
import { initialSystemIntakeForm } from 'data/systemIntake';
import { MessageProvider } from 'hooks/useMessage';
import GetGovernanceTaskListQuery from 'queries/GetGovernanceTaskListQuery';
import GetSystemIntakeQuery from 'queries/GetSystemIntakeQuery';
import { CreateSystemIntake } from 'queries/SystemIntakeQueries';
import {
  ITGovDecisionStatus,
  ITGovDraftBusinessCaseStatus,
  ITGovFeedbackStatus,
  ITGovFinalBusinessCaseStatus,
  ITGovGRBStatus,
  ITGovGRTStatus,
  ITGovIntakeFormStatus,
  SystemIntakeDecisionState,
  SystemIntakeState,
  SystemIntakeStep
} from 'types/graphql-global-types';
import GovernanceOverview from 'views/GovernanceOverview';
import GovernanceTaskList from 'views/GovernanceTaskList';
import SystemIntake from 'views/SystemIntake';

import RequestTypeForm from './index';

vi.mock('@okta/okta-react', () => ({
  useOktaAuth: () => {
    return {
      authState: {
        isAuthenticated: true
      },
      oktaAuth: {
        getAccessToken: () => Promise.resolve('test-access-token'),
        getUser: () =>
          Promise.resolve({
            name: 'John Doe',
            euaUserId: 'ASDF',
            email: 'john@local.fake'
          })
      }
    };
  }
}));

window.scrollTo = vi.fn;
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
          ...systemIntake,
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
            vehicle: null,
            number: null
          },
          costs: {
            isExpectingIncrease: null,
            expectedIncreaseAmount: null
          },
          annualSpending: {
            currentAnnualSpending: 'Test Current Annual Spending',
            currentAnnualSpendingITPortion:
              'Test Current Annual Spending IT portion',
            plannedYearOneSpending: 'Test Planned Year One Spending',
            plannedYearOneSpendingITPortion:
              'Test Planned Year One Spending IT portion'
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
          existingFunding: null,
          fundingSources: [],
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
          hasUiChanges: null,
          documents: [],
          state: SystemIntakeState.OPEN,
          decisionState: SystemIntakeDecisionState.NO_DECISION,
          lcidStatus: null,
          trbFollowUpRecommendation: null,
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

    renderPage([
      intakeMutation,
      intakeQuery({ requestType: 'MAJOR_CHANGES' }),
      {
        request: {
          query: GetGovernanceTaskListQuery,
          variables: {
            id: INTAKE_ID
          }
        },
        result: {
          data: {
            systemIntake: {
              __typename: 'SystemIntake',
              id: INTAKE_ID,
              requestName: 'Mock system intake',
              itGovTaskStatuses: {
                __typename: 'ITGovTaskStatuses',
                intakeFormStatus: ITGovIntakeFormStatus.READY,
                feedbackFromInitialReviewStatus: ITGovFeedbackStatus.CANT_START,
                decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START,
                bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.CANT_START,
                grtMeetingStatus: ITGovGRTStatus.CANT_START,
                bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
                grbMeetingStatus: ITGovGRBStatus.CANT_START
              },
              step: SystemIntakeStep.INITIAL_REQUEST_FORM,
              state: SystemIntakeState.OPEN,
              decisionState: SystemIntakeDecisionState.NO_DECISION,
              governanceRequestFeedbacks: [],
              submittedAt: null,
              updatedAt: null,
              grtDate: null,
              grbDate: null,
              businessCase: null
            }
          }
        }
      }
    ]);

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

    renderPage([
      intakeMutation,
      intakeQuery({ requestType: 'RECOMPETE' }),
      {
        request: {
          query: GetGovernanceTaskListQuery,
          variables: {
            id: INTAKE_ID
          }
        },
        result: {
          data: {
            systemIntake: {
              __typename: 'SystemIntake',
              id: INTAKE_ID,
              requestName: 'Mock system intake',
              itGovTaskStatuses: {
                __typename: 'ITGovTaskStatuses',
                intakeFormStatus: ITGovIntakeFormStatus.READY,
                feedbackFromInitialReviewStatus: ITGovFeedbackStatus.CANT_START,
                decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START,
                bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.CANT_START,
                grtMeetingStatus: ITGovGRTStatus.CANT_START,
                bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
                grbMeetingStatus: ITGovGRBStatus.CANT_START
              },
              step: SystemIntakeStep.INITIAL_REQUEST_FORM,
              state: SystemIntakeState.OPEN,
              decisionState: SystemIntakeDecisionState.NO_DECISION,
              governanceRequestFeedbacks: [],
              submittedAt: null,
              updatedAt: null,
              grtDate: null,
              grbDate: null,
              businessCase: null
            }
          }
        }
      }
    ]);

    screen.getByRole('radio', { name: /re-compete/i }).click();
    screen.getByRole('button', { name: /continue/i }).click();

    expect(
      await screen.findByTestId('governance-task-list')
    ).toBeInTheDocument();
  });

  it('executes request type validations', async () => {
    renderPage([]);

    screen.getByRole('button', { name: /continue/i }).click();

    expect(
      await screen.findByTestId('formik-validation-errors')
    ).toBeInTheDocument();
  });
});
