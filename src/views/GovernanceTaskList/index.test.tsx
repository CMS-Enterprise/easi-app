import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  screen,
  waitForElementToBeRemoved,
  within
} from '@testing-library/react';
import configureMockStore from 'redux-mock-store';

import { initialSystemIntakeForm } from 'data/systemIntake';
import { MessageProvider } from 'hooks/useMessage';
import GetGRTFeedbackQuery from 'queries/GetGRTFeedbackQuery';
import GetSystemIntakeQuery from 'queries/GetSystemIntakeQuery';

import GovernanceTaskList from './index';

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

const waitForPageLoad = async () => {
  await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));
};

describe('The Goveranance Task List', () => {
  const INTAKE_ID = '1be65d1a-af87-4e6c-89b2-d2e86f1ee784';
  const grtFeedback = {
    request: {
      query: GetGRTFeedbackQuery,
      variables: {
        intakeID: INTAKE_ID
      }
    },
    result: {
      data: {
        systemIntake: {
          grtFeedbacks: []
        }
      }
    }
  };

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

  it('renders without crashing', async () => {
    const mockStore = configureMockStore();
    const store = mockStore({
      systemIntake: { systemIntake: {} },
      businessCase: { form: {} }
    });

    render(
      <MemoryRouter initialEntries={[`/governance-task-list/${INTAKE_ID}`]}>
        <MockedProvider
          mocks={[intakeQuery({}), grtFeedback]}
          addTypename={false}
        >
          <Provider store={store}>
            <MessageProvider>
              <Route
                path="/governance-task-list/:systemId"
                component={GovernanceTaskList}
              />
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(
      await screen.findByTestId('governance-task-list')
    ).toBeInTheDocument();
  });

  it('displays the governance steps list', async () => {
    const mockStore = configureMockStore();
    const store = mockStore({
      systemIntake: { systemIntake: {} },
      businessCase: { form: {} }
    });

    render(
      <MemoryRouter initialEntries={[`/governance-task-list/${INTAKE_ID}`]}>
        <MockedProvider
          mocks={[intakeQuery({}), grtFeedback]}
          addTypename={false}
        >
          <Provider store={store}>
            <MessageProvider>
              <Route
                path="/governance-task-list/:systemId"
                component={GovernanceTaskList}
              />
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(await screen.findByTestId('task-list')).toBeInTheDocument();
  });

  describe('Recompetes', () => {
    it('displays "for recompete in title', async () => {
      const mockStore = configureMockStore();
      const store = mockStore({
        systemIntake: {
          systemIntake: {
            ...initialSystemIntakeForm,
            requestName: 'Easy Access to System Information',
            requestType: 'RECOMPETE'
          }
        },
        businessCase: { form: {} }
      });

      render(
        <MemoryRouter initialEntries={[`/governance-task-list/${INTAKE_ID}`]}>
          <MockedProvider
            mocks={[
              intakeQuery({
                requestName: 'Easy Access to System Information',
                requestType: 'RECOMPETE'
              }),
              grtFeedback
            ]}
            addTypename={false}
          >
            <Provider store={store}>
              <MessageProvider>
                <Route
                  path="/governance-task-list/:systemId"
                  component={GovernanceTaskList}
                />
              </MessageProvider>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );

      expect(
        await screen.findByRole('heading', {
          name:
            'Get governance approval for re-competing a contract without any changes to systems or services',
          level: 1
        })
      ).toBeInTheDocument();
    });

    it('displays not applicable steps as cannot start', async () => {
      const mockStore = configureMockStore();
      const store = mockStore({
        systemIntake: {
          systemIntake: {}
        },
        businessCase: { form: {} }
      });

      render(
        <MemoryRouter initialEntries={[`/governance-task-list/${INTAKE_ID}`]}>
          <MockedProvider
            mocks={[
              intakeQuery({
                requestName: 'Easy Access to System Information',
                requestType: 'RECOMPETE'
              }),
              grtFeedback
            ]}
            addTypename={false}
          >
            <Provider store={store}>
              <MessageProvider>
                <Route
                  path="/governance-task-list/:systemId"
                  component={GovernanceTaskList}
                />
              </MessageProvider>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );

      await waitForPageLoad();

      expect(
        screen.getByTestId('task-list-business-case-draft').textContent
      ).toContain('Cannot start yet');
      expect(
        screen.getByTestId('task-list-business-case-final').textContent
      ).toContain('Cannot start yet');
      expect(screen.getByTestId('task-list-grb-meeting').textContent).toContain(
        'Cannot start yet'
      );
      expect(screen.getByTestId('task-list-decision').textContent).toContain(
        'Cannot start yet'
      );
    });

    it('displays steps 3, 4, and 5 as not needed once issued LCID', async () => {
      const mockStore = configureMockStore();
      const store = mockStore({
        systemIntake: {
          systemIntake: {}
        },
        businessCase: { form: {} }
      });

      render(
        <MemoryRouter initialEntries={[`/governance-task-list/${INTAKE_ID}`]}>
          <MockedProvider
            mocks={[
              intakeQuery({
                requestName: 'Easy Access to System Information',
                requestType: 'RECOMPETE',
                status: 'LCID_ISSUED'
              }),
              grtFeedback
            ]}
            addTypename={false}
          >
            <Provider store={store}>
              <MessageProvider>
                <Route
                  path="/governance-task-list/:systemId"
                  component={GovernanceTaskList}
                />
              </MessageProvider>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );

      await waitForPageLoad();

      expect(screen.getByTestId('task-list-intake-form').textContent).toContain(
        'Completed'
      );
      expect(
        screen.getByTestId('task-list-intake-review').textContent
      ).toContain('Completed');
      expect(
        screen.getByTestId('task-list-business-case-draft').textContent
      ).toContain('Not needed');
      expect(
        screen.getByTestId('task-list-business-case-final').textContent
      ).toContain('Not needed');
      expect(screen.getByTestId('task-list-grb-meeting').textContent).toContain(
        'Not needed'
      );
      expect(screen.getByTestId('task-list-decision').textContent).toContain(
        'Read decision from board'
      );
    });
  });

  describe('Heading', () => {
    it('displays the request name', async () => {
      const mockStore = configureMockStore();
      const store = mockStore({
        systemIntake: {
          systemIntake: {
            ...initialSystemIntakeForm,
            requestName: 'Easy Access to System Information'
          }
        },
        businessCase: { form: {} }
      });

      render(
        <MemoryRouter initialEntries={[`/governance-task-list/${INTAKE_ID}`]}>
          <MockedProvider
            mocks={[
              intakeQuery({
                requestName: 'Easy Access to System Information'
              }),
              grtFeedback
            ]}
            addTypename={false}
          >
            <Provider store={store}>
              <MessageProvider>
                <Route
                  path="/governance-task-list/:systemId"
                  component={GovernanceTaskList}
                />
              </MessageProvider>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );

      await waitForPageLoad();

      expect(
        screen.getByRole('heading', {
          name: 'Get governance approval for Easy Access to System Information',
          level: 1
        })
      ).toBeInTheDocument();
    });

    it('hides the request name', async () => {
      const mockStore = configureMockStore();
      const store = mockStore({
        systemIntake: { systemIntake: initialSystemIntakeForm },
        businessCase: { form: {} }
      });

      render(
        <MemoryRouter initialEntries={[`/governance-task-list/${INTAKE_ID}`]}>
          <MockedProvider
            mocks={[intakeQuery({}), grtFeedback]}
            addTypename={false}
          >
            <Provider store={store}>
              <MessageProvider>
                <Route
                  path="/governance-task-list/:systemId"
                  component={GovernanceTaskList}
                />
              </MessageProvider>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );

      await waitForPageLoad();

      expect(
        screen.getByRole('heading', {
          name: 'Get governance approval',
          level: 1
        })
      ).toBeInTheDocument();
    });
  });

  describe('Statuses', () => {
    const mockStore = configureMockStore();

    it('renders proper buttons for INTAKE_DRAFT', async () => {
      const store = mockStore({
        systemIntake: {
          systemIntake: {
            ...initialSystemIntakeForm
          }
        },
        businessCase: { form: {} }
      });

      render(
        <MemoryRouter initialEntries={[`/governance-task-list/${INTAKE_ID}`]}>
          <MockedProvider
            mocks={[
              intakeQuery({
                status: 'INTAKE_DRAFT'
              }),
              grtFeedback
            ]}
            addTypename={false}
          >
            <Provider store={store}>
              <MessageProvider>
                <Route
                  path="/governance-task-list/:systemId"
                  component={GovernanceTaskList}
                />
              </MessageProvider>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );

      await waitForPageLoad();

      expect(screen.getByTestId('intake-start-btn')).toBeInTheDocument();

      expect(
        screen.getByTestId('task-list-intake-review').textContent
      ).toContain('Cannot start yet');

      expect(
        screen.getByTestId('task-list-business-case-draft').textContent
      ).toContain('Cannot start yet');
    });

    it('renders proper buttons for INTAKE_SUBMITTED', async () => {
      const store = mockStore({
        systemIntake: {
          systemIntake: {}
        },
        businessCase: { form: {} }
      });

      render(
        <MemoryRouter initialEntries={[`/governance-task-list/${INTAKE_ID}`]}>
          <MockedProvider
            mocks={[
              intakeQuery({
                status: 'INTAKE_SUBMITTED'
              }),
              grtFeedback
            ]}
            addTypename={false}
          >
            <Provider store={store}>
              <MessageProvider>
                <Route
                  path="/governance-task-list/:systemId"
                  component={GovernanceTaskList}
                />
              </MessageProvider>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );

      await waitForPageLoad();

      expect(screen.getByTestId('intake-view-link')).toBeInTheDocument();

      expect(screen.getByTestId('task-list-intake-form').textContent).toContain(
        'Completed'
      );

      const initialReview = screen.getByTestId('task-list-intake-review');
      expect(
        within(initialReview).queryByTestId('task-list-task-tag')
      ).not.toBeInTheDocument();

      expect(
        screen.getByTestId('task-list-business-case-draft').textContent
      ).toContain('Cannot start yet');
    });

    it('renders proper buttons for NEED_BIZ_CASE', async () => {
      const store = mockStore({
        systemIntake: {
          systemIntake: {}
        },
        businessCase: { form: {} }
      });

      render(
        <MemoryRouter initialEntries={[`/governance-task-list/${INTAKE_ID}`]}>
          <MockedProvider
            mocks={[
              intakeQuery({
                status: 'NEED_BIZ_CASE'
              }),
              grtFeedback
            ]}
            addTypename={false}
          >
            <Provider store={store}>
              <MessageProvider>
                <Route
                  path="/governance-task-list/:systemId"
                  component={GovernanceTaskList}
                />
              </MessageProvider>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );

      await waitForPageLoad();

      expect(screen.getByTestId('intake-view-link')).toBeInTheDocument();
      expect(screen.getByTestId('start-biz-case-btn')).toBeInTheDocument();

      expect(
        within(screen.getByTestId('task-list-intake-form')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');

      expect(
        within(screen.getByTestId('task-list-intake-review')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');

      const bizCase = screen.getByTestId('task-list-business-case-draft');
      expect(
        within(bizCase).queryByTestId('task-list-task-tag')
      ).not.toBeInTheDocument();
    });

    it('renders proper buttons for BIZ_CASE_DRAFT', async () => {
      const store = mockStore({
        systemIntake: {
          systemIntake: {}
        },
        businessCase: { form: {} }
      });

      render(
        <MemoryRouter initialEntries={[`/governance-task-list/${INTAKE_ID}`]}>
          <MockedProvider
            mocks={[
              intakeQuery({
                status: 'BIZ_CASE_DRAFT'
              }),
              grtFeedback
            ]}
            addTypename={false}
          >
            <Provider store={store}>
              <MessageProvider>
                <Route
                  path="/governance-task-list/:systemId"
                  component={GovernanceTaskList}
                />
              </MessageProvider>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );

      await waitForPageLoad();

      expect(screen.getByTestId('intake-view-link')).toBeInTheDocument();
      expect(screen.getByTestId('continue-biz-case-btn')).toBeInTheDocument();

      expect(
        within(screen.getByTestId('task-list-intake-form')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');

      expect(
        within(screen.getByTestId('task-list-intake-review')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');

      const bizCase = screen.getByTestId('task-list-business-case-draft');
      expect(
        within(bizCase).queryByTestId('task-list-task-tag')
      ).not.toBeInTheDocument();
    });

    it('renders proper buttons for BIZ_CASE_DRAFT_SUBMITTED', async () => {
      const store = mockStore({
        systemIntake: {
          systemIntake: {}
        },
        businessCase: { form: {} }
      });

      render(
        <MemoryRouter initialEntries={[`/governance-task-list/${INTAKE_ID}`]}>
          <MockedProvider
            mocks={[
              intakeQuery({
                status: 'BIZ_CASE_DRAFT_SUBMITTED',
                businessCaseId: 'ac94c1d7-48ca-4c49-9045-371b4d3062b4'
              }),
              grtFeedback
            ]}
            addTypename={false}
          >
            <Provider store={store}>
              <MessageProvider>
                <Route
                  path="/governance-task-list/:systemId"
                  component={GovernanceTaskList}
                />
              </MessageProvider>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );

      await waitForPageLoad();

      expect(screen.getByTestId('intake-view-link')).toBeInTheDocument();
      expect(screen.getByTestId('view-biz-case-link')).toBeInTheDocument();

      expect(
        within(screen.getByTestId('task-list-intake-form')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');

      expect(
        within(screen.getByTestId('task-list-intake-review')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');

      expect(
        within(screen.getByTestId('task-list-business-case-draft')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');
    });

    it('renders proper buttons for BIZ_CASE_CHANGES_NEEDED', async () => {
      const store = mockStore({
        systemIntake: {
          systemIntake: {}
        },
        businessCase: { form: {} }
      });

      render(
        <MemoryRouter initialEntries={[`/governance-task-list/${INTAKE_ID}`]}>
          <MockedProvider
            mocks={[
              intakeQuery({
                status: 'BIZ_CASE_CHANGES_NEEDED'
              }),
              grtFeedback
            ]}
            addTypename={false}
          >
            <Provider store={store}>
              <MessageProvider>
                <Route
                  path="/governance-task-list/:systemId"
                  component={GovernanceTaskList}
                />
              </MessageProvider>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );

      await waitForPageLoad();

      expect(screen.getByTestId('intake-view-link')).toBeInTheDocument();
      expect(
        screen.getByTestId('update-biz-case-draft-btn')
      ).toBeInTheDocument();

      expect(
        within(screen.getByTestId('task-list-intake-form')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');

      expect(
        within(screen.getByTestId('task-list-intake-review')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');

      const bizCase = screen.getByTestId('task-list-business-case-draft');
      expect(
        within(bizCase).queryByTestId('task-list-task-tag')
      ).not.toBeInTheDocument();
    });

    it('renders proper buttons for READY_FOR_GRT', async () => {
      const store = mockStore({
        systemIntake: {
          systemIntake: {}
        },
        businessCase: { form: {} }
      });

      render(
        <MemoryRouter initialEntries={[`/governance-task-list/${INTAKE_ID}`]}>
          <MockedProvider
            mocks={[
              intakeQuery({
                status: 'READY_FOR_GRT'
              }),
              grtFeedback
            ]}
            addTypename={false}
          >
            <Provider store={store}>
              <MessageProvider>
                <Route
                  path="/governance-task-list/:systemId"
                  component={GovernanceTaskList}
                />
              </MessageProvider>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );

      await waitForPageLoad();

      expect(screen.getByTestId('intake-view-link')).toBeInTheDocument();
      expect(screen.getByTestId('prepare-for-grt-cta')).toBeInTheDocument();
      expect(screen.getByTestId('view-biz-case-cta')).toBeInTheDocument();

      expect(
        within(screen.getByTestId('task-list-intake-form')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');

      expect(
        within(screen.getByTestId('task-list-intake-review')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');

      const bizCase = screen.getByTestId('task-list-business-case-draft');
      expect(
        within(bizCase).queryByTestId('task-list-task-tag')
      ).not.toBeInTheDocument();

      expect(
        within(screen.getByTestId('task-list-business-case-final')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Cannot start yet');

      expect(
        within(screen.getByTestId('task-list-grb-meeting')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Cannot start yet');

      expect(
        within(screen.getByTestId('task-list-decision')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Cannot start yet');
    });

    it('renders proper buttons for BIZ_CASE_FINAL_NEEDED', async () => {
      const store = mockStore({
        systemIntake: {
          systemIntake: {}
        },
        businessCase: { form: {} }
      });

      render(
        <MemoryRouter initialEntries={[`/governance-task-list/${INTAKE_ID}`]}>
          <MockedProvider
            mocks={[
              intakeQuery({
                status: 'BIZ_CASE_FINAL_NEEDED'
              }),
              grtFeedback
            ]}
            addTypename={false}
          >
            <Provider store={store}>
              <MessageProvider>
                <Route
                  path="/governance-task-list/:systemId"
                  component={GovernanceTaskList}
                />
              </MessageProvider>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );

      await waitForPageLoad();

      expect(screen.getByTestId('intake-view-link')).toBeInTheDocument();

      expect(
        within(screen.getByTestId('task-list-business-case-final')).getByRole(
          'link',
          {
            name: 'Review and Submit'
          }
        )
      ).toBeInTheDocument();

      expect(
        within(screen.getByTestId('task-list-intake-form')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');

      expect(
        within(screen.getByTestId('task-list-intake-review')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');

      expect(
        within(screen.getByTestId('task-list-business-case-draft')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');

      const bizCase = screen.getByTestId('task-list-business-case-final');
      expect(
        within(bizCase).queryByTestId('task-list-task-tag')
      ).not.toBeInTheDocument();
    });

    it('renders proper buttons for BIZ_CASE_FINAL_SUBMITTED', async () => {
      const store = mockStore({
        systemIntake: {
          systemIntake: {}
        },
        businessCase: { form: {} }
      });

      render(
        <MemoryRouter initialEntries={[`/governance-task-list/${INTAKE_ID}`]}>
          <MockedProvider
            mocks={[
              intakeQuery({
                status: 'BIZ_CASE_FINAL_SUBMITTED'
              }),
              grtFeedback
            ]}
            addTypename={false}
          >
            <Provider store={store}>
              <MessageProvider>
                <Route
                  path="/governance-task-list/:systemId"
                  component={GovernanceTaskList}
                />
              </MessageProvider>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );

      await waitForPageLoad();

      expect(screen.getByTestId('intake-view-link')).toBeInTheDocument();

      expect(
        within(screen.getByTestId('task-list-business-case-final')).queryByRole(
          'link',
          {
            name: 'Review and Submit'
          }
        )
      ).not.toBeInTheDocument();

      expect(
        within(screen.getByTestId('task-list-intake-form')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');

      expect(
        within(screen.getByTestId('task-list-intake-review')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');

      expect(
        within(screen.getByTestId('task-list-business-case-draft')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');

      expect(
        within(screen.getByTestId('task-list-business-case-final')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');
    });

    it('renders proper buttons for READY_FOR_GRB', async () => {
      const store = mockStore({
        systemIntake: {
          systemIntake: {}
        },
        businessCase: { form: {} }
      });

      render(
        <MemoryRouter initialEntries={[`/governance-task-list/${INTAKE_ID}`]}>
          <MockedProvider
            mocks={[
              intakeQuery({
                status: 'READY_FOR_GRB'
              }),
              grtFeedback
            ]}
            addTypename={false}
          >
            <Provider store={store}>
              <MessageProvider>
                <Route
                  path="/governance-task-list/:systemId"
                  component={GovernanceTaskList}
                />
              </MessageProvider>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );

      await waitForPageLoad();

      expect(screen.getByTestId('intake-view-link')).toBeInTheDocument();
      expect(screen.getByTestId('prepare-for-grb-btn')).toBeInTheDocument();

      expect(
        within(screen.getByTestId('task-list-intake-form')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');

      expect(
        within(screen.getByTestId('task-list-intake-review')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');

      expect(
        within(screen.getByTestId('task-list-business-case-draft')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');

      expect(
        within(screen.getByTestId('task-list-business-case-final')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');

      const bizCase = screen.getByTestId('task-list-grb-meeting');
      expect(
        within(bizCase).queryByTestId('task-list-task-tag')
      ).not.toBeInTheDocument();
    });

    it('renders proper buttons for LCID_ISSUED', async () => {
      const store = mockStore({
        systemIntake: {
          systemIntake: {}
        },
        businessCase: { form: {} }
      });

      render(
        <MemoryRouter initialEntries={[`/governance-task-list/${INTAKE_ID}`]}>
          <MockedProvider
            mocks={[
              intakeQuery({
                status: 'LCID_ISSUED'
              }),
              grtFeedback
            ]}
            addTypename={false}
          >
            <Provider store={store}>
              <MessageProvider>
                <Route
                  path="/governance-task-list/:systemId"
                  component={GovernanceTaskList}
                />
              </MessageProvider>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );

      await waitForPageLoad();

      expect(screen.getByTestId('intake-view-link')).toBeInTheDocument();
      expect(screen.getByTestId('decision-cta')).toBeInTheDocument();

      expect(
        within(screen.getByTestId('task-list-intake-form')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');

      expect(
        within(screen.getByTestId('task-list-intake-review')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');

      expect(
        within(screen.getByTestId('task-list-business-case-draft')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');

      expect(
        within(screen.getByTestId('task-list-business-case-final')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');

      expect(
        within(screen.getByTestId('task-list-grb-meeting')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');

      const bizCase = screen.getByTestId('task-list-decision');
      expect(
        within(bizCase).queryByTestId('task-list-task-tag')
      ).not.toBeInTheDocument();
    });

    it('renders proper buttons for NO_GOVERNANCE', async () => {
      const store = mockStore({
        systemIntake: {
          systemIntake: {}
        },
        businessCase: { form: {} }
      });

      render(
        <MemoryRouter initialEntries={[`/governance-task-list/${INTAKE_ID}`]}>
          <MockedProvider
            mocks={[
              intakeQuery({
                status: 'NO_GOVERNANCE'
              }),
              grtFeedback
            ]}
            addTypename={false}
          >
            <Provider store={store}>
              <MessageProvider>
                <Route
                  path="/governance-task-list/:systemId"
                  component={GovernanceTaskList}
                />
              </MessageProvider>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );

      await waitForPageLoad();

      expect(screen.getByTestId('intake-view-link')).toBeInTheDocument();
      expect(screen.getByTestId('task-list-closed-alert')).toBeInTheDocument();
      expect(
        screen.getByTestId('plain-text-no-governance-decision')
      ).toBeInTheDocument();

      expect(
        within(screen.getByTestId('task-list-intake-form')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');

      expect(
        within(screen.getByTestId('task-list-intake-review')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Cannot start yet');

      expect(
        within(screen.getByTestId('task-list-grb-meeting')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');
    });

    it('renders proper buttons for NOT_IT_REQUEST', async () => {
      const store = mockStore({
        systemIntake: {
          systemIntake: {}
        },
        businessCase: { form: {} }
      });

      render(
        <MemoryRouter initialEntries={[`/governance-task-list/${INTAKE_ID}`]}>
          <MockedProvider
            mocks={[
              intakeQuery({
                status: 'NOT_IT_REQUEST'
              }),
              grtFeedback
            ]}
            addTypename={false}
          >
            <Provider store={store}>
              <MessageProvider>
                <Route
                  path="/governance-task-list/:systemId"
                  component={GovernanceTaskList}
                />
              </MessageProvider>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );

      await waitForPageLoad();

      expect(screen.getByTestId('intake-view-link')).toBeInTheDocument();
      expect(screen.getByTestId('task-list-closed-alert')).toBeInTheDocument();
      expect(
        screen.getByTestId('plain-text-not-it-request-decision')
      ).toBeInTheDocument();

      expect(
        within(screen.getByTestId('task-list-intake-form')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');

      expect(
        within(screen.getByTestId('task-list-intake-review')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');

      expect(
        within(screen.getByTestId('task-list-grb-meeting')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');
    });
  });
});
