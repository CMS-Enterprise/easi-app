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
import GetSytemIntakeQuery from 'queries/GetSystemIntakeQuery';

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

describe('The Goveranance Task List', () => {
  const mockIntakeQuery = (intakeProps?: any) => {
    return {
      request: {
        query: GetSytemIntakeQuery,
        variables: {
          id: 'sysIntakeRequest123'
        }
      },
      result: {
        data: {
          systemIntake: {
            id: 'sysIntakeRequest123',
            adminLead: null,
            businessNeed: null,
            businessSolution: null,
            businessOwner: {
              component: null,
              name: null
            },
            contract: {
              contractor: null,
              endDate: {
                day: null,
                month: null,
                year: null
              },
              hasContract: null,
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
              isPresent: false,
              teams: null
            },
            isso: {
              isPresent: false,
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
              name: 'User ABCD'
            },
            requestName: '',
            requestType: 'NEW',
            status: 'INTAKE_DRAFT',
            submittedAt: null,
            ...intakeProps
          }
        }
      }
    };
  };

  it('renders without crashing', async () => {
    const mockStore = configureMockStore();
    const store = mockStore({});

    render(
      <MemoryRouter
        initialEntries={['/governance-task-list/sysIntakeRequest123']}
      >
        <MockedProvider mocks={[mockIntakeQuery()]} addTypename={false}>
          <MessageProvider>
            <Provider store={store}>
              <Route path="/governance-task-list/:systemId">
                <GovernanceTaskList />
              </Route>
            </Provider>
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(screen.getByTestId('governance-task-list')).toBeInTheDocument();
  });

  it('displays the request name', async () => {
    const mockStore = configureMockStore();
    const store = mockStore({});
    const mockIntake = mockIntakeQuery({
      requestName: 'Easy Access to System Information'
    });

    render(
      <MemoryRouter
        initialEntries={['/governance-task-list/sysIntakeRequest123']}
      >
        <MockedProvider mocks={[mockIntake]} addTypename={false}>
          <Provider store={store}>
            <MessageProvider>
              <Route path="/governance-task-list/:systemId">
                <GovernanceTaskList />
              </Route>
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(
      screen.getByRole('heading', {
        name: 'Get governance approval for Easy Access to System Information',
        level: 1
      })
    ).toBeInTheDocument();
  });

  describe('Recompetes', () => {
    const mockRecompleteIntake = mockIntakeQuery({
      requestType: 'RECOMPETE',
      requestName: 'Easy Access to System Information'
    });

    it('displays "for recompete in title', async () => {
      const mockStore = configureMockStore();
      const store = mockStore({});

      render(
        <MemoryRouter
          initialEntries={['/governance-task-list/sysIntakeRequest123']}
        >
          <MockedProvider mocks={[mockRecompleteIntake]} addTypename={false}>
            <Provider store={store}>
              <MessageProvider>
                <Route path="/governance-task-list/:systemId">
                  <GovernanceTaskList />
                </Route>
              </MessageProvider>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );
      await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

      expect(
        screen.getByRole('heading', {
          name: /Get governance approval for re-competing/i,
          level: 1
        })
      ).toBeInTheDocument();
    });

    it('displays not applicable steps as cannot start', async () => {
      const mockStore = configureMockStore();
      const store = mockStore({});

      render(
        <MemoryRouter
          initialEntries={['/governance-task-list/sysIntakeRequest123']}
        >
          <MockedProvider mocks={[mockRecompleteIntake]} addTypename={false}>
            <Provider store={store}>
              <MessageProvider>
                <Route path="/governance-task-list/:systemId">
                  <GovernanceTaskList />
                </Route>
              </MessageProvider>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );
      await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

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

    it('displays steps draft/final business case and GRB meeting as not needed once issued LCID', async () => {
      const mockStore = configureMockStore();
      const store = mockStore({});

      const mockQuery = mockIntakeQuery({
        requestType: 'RECOMPETE',
        status: 'LCID_ISSUED'
      });

      render(
        <MemoryRouter
          initialEntries={['/governance-task-list/sysIntakeRequest123']}
        >
          <MockedProvider mocks={[mockQuery]} addTypename={false}>
            <Provider store={store}>
              <MessageProvider>
                <Route path="/governance-task-list/:systemId">
                  <GovernanceTaskList />
                </Route>
              </MessageProvider>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );
      await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

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

  describe('Statuses', () => {
    const mockStore = configureMockStore();

    it('renders proper buttons for INTAKE_DRAFT', async () => {
      const store = mockStore({});

      const mockWithStatus = mockIntakeQuery({
        status: 'INTAKE_DRAFT'
      });

      render(
        <MemoryRouter
          initialEntries={['/governance-task-list/sysIntakeRequest123']}
        >
          <MockedProvider mocks={[mockWithStatus]} addTypename={false}>
            <Provider store={store}>
              <MessageProvider>
                <Route path="/governance-task-list/:systemId">
                  <GovernanceTaskList />
                </Route>
              </MessageProvider>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );
      await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

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

      const mockWithStatus = mockIntakeQuery({
        status: 'INTAKE_SUBMITTED'
      });

      render(
        <MemoryRouter
          initialEntries={['/governance-task-list/sysIntakeRequest123']}
        >
          <MockedProvider mocks={[mockWithStatus]} addTypename={false}>
            <Provider store={store}>
              <MessageProvider>
                <Route path="/governance-task-list/:systemId">
                  <GovernanceTaskList />
                </Route>
              </MessageProvider>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );
      await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

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
      const store = mockStore({});

      const mockWithStatus = mockIntakeQuery({
        status: 'NEED_BIZ_CASE'
      });

      render(
        <MemoryRouter
          initialEntries={['/governance-task-list/sysIntakeRequest123']}
        >
          <MockedProvider mocks={[mockWithStatus]} addTypename={false}>
            <Provider store={store}>
              <MessageProvider>
                <Route path="/governance-task-list/:systemId">
                  <GovernanceTaskList />
                </Route>
              </MessageProvider>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );
      await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

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
      const store = mockStore({});
      const mockWithStatus = mockIntakeQuery({
        status: 'BIZ_CASE_DRAFT'
      });

      render(
        <MemoryRouter
          initialEntries={['/governance-task-list/sysIntakeRequest123']}
        >
          <MockedProvider mocks={[mockWithStatus]} addTypename={false}>
            <Provider store={store}>
              <MessageProvider>
                <Route path="/governance-task-list/:systemId">
                  <GovernanceTaskList />
                </Route>
              </MessageProvider>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );
      await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

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

    // TODO: MISSING BUSINESS CASE ID SO VIEW BUSINESS CASE LINK NEVER SHOWS
    it('renders proper buttons for BIZ_CASE_DRAFT_SUBMITTED', async () => {
      const store = mockStore({
        systemIntake: {
          systemIntake: {
            ...initialSystemIntakeForm,
            status: 'BIZ_CASE_DRAFT_SUBMITTED',
            businessCaseId: 'ac94c1d7-48ca-4c49-9045-371b4d3062b4'
          }
        },
        businessCase: { form: {} }
      });

      const mockWithStatus = mockIntakeQuery({
        status: 'BIZ_CASE_DRAFT_SUBMITTED',
        businessCaseId: 'ac94c1d7-48ca-4c49-9045-371b4d3062b4'
      });

      render(
        <MemoryRouter
          initialEntries={['/governance-task-list/sysIntakeRequest123']}
        >
          <MockedProvider mocks={[mockWithStatus]} addTypename={false}>
            <Provider store={store}>
              <MessageProvider>
                <Route path="/governance-task-list/:systemId">
                  <GovernanceTaskList />
                </Route>
              </MessageProvider>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );
      await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

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
      const store = mockStore({});

      const mockWithStatus = mockIntakeQuery({
        status: 'BIZ_CASE_CHANGES_NEEDED'
      });

      render(
        <MemoryRouter
          initialEntries={['/governance-task-list/sysIntakeRequest123']}
        >
          <MockedProvider mocks={[mockWithStatus]} addTypename={false}>
            <Provider store={store}>
              <MessageProvider>
                <Route path="/governance-task-list/:systemId">
                  <GovernanceTaskList />
                </Route>
              </MessageProvider>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );
      await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

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
      const store = mockStore({});

      const mockWithStatus = mockIntakeQuery({
        status: 'READY_FOR_GRT'
      });

      render(
        <MemoryRouter
          initialEntries={['/governance-task-list/sysIntakeRequest123']}
        >
          <MockedProvider mocks={[mockWithStatus]} addTypename={false}>
            <Provider store={store}>
              <MessageProvider>
                <Route path="/governance-task-list/:systemId">
                  <GovernanceTaskList />
                </Route>
              </MessageProvider>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );
      await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

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
      const store = mockStore({});

      const mockWithStatus = mockIntakeQuery({
        status: 'BIZ_CASE_FINAL_NEEDED'
      });

      render(
        <MemoryRouter
          initialEntries={['/governance-task-list/sysIntakeRequest123']}
        >
          <MockedProvider mocks={[mockWithStatus]} addTypename={false}>
            <Provider store={store}>
              <MessageProvider>
                <Route path="/governance-task-list/:systemId">
                  <GovernanceTaskList />
                </Route>
              </MessageProvider>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );
      await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

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

      const mockWithStatus = mockIntakeQuery({
        status: 'BIZ_CASE_FINAL_SUBMITTED'
      });

      render(
        <MemoryRouter
          initialEntries={['/governance-task-list/sysIntakeRequest123']}
        >
          <MockedProvider mocks={[mockWithStatus]} addTypename={false}>
            <Provider store={store}>
              <MessageProvider>
                <Route path="/governance-task-list/:systemId">
                  <GovernanceTaskList />
                </Route>
              </MessageProvider>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );
      await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

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
      const store = mockStore({});
      const mockWithStatus = mockIntakeQuery({
        status: 'READY_FOR_GRB'
      });

      render(
        <MemoryRouter
          initialEntries={['/governance-task-list/sysIntakeRequest123']}
        >
          <MockedProvider mocks={[mockWithStatus]} addTypename={false}>
            <Provider store={store}>
              <MessageProvider>
                <Route path="/governance-task-list/:systemId">
                  <GovernanceTaskList />
                </Route>
              </MessageProvider>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );
      await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

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
      const store = mockStore({});
      const mockWithStatus = mockIntakeQuery({
        status: 'LCID_ISSUED'
      });

      render(
        <MemoryRouter
          initialEntries={['/governance-task-list/sysIntakeRequest123']}
        >
          <MockedProvider mocks={[mockWithStatus]} addTypename={false}>
            <Provider store={store}>
              <MessageProvider>
                <Route path="/governance-task-list/:systemId">
                  <GovernanceTaskList />
                </Route>
              </MessageProvider>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );
      await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

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
      const store = mockStore({});
      const mockWithStatus = mockIntakeQuery({
        status: 'NO_GOVERNANCE'
      });

      render(
        <MemoryRouter
          initialEntries={['/governance-task-list/sysIntakeRequest123']}
        >
          <MockedProvider mocks={[mockWithStatus]} addTypename={false}>
            <Provider store={store}>
              <MessageProvider>
                <Route path="/governance-task-list/:systemId">
                  <GovernanceTaskList />
                </Route>
              </MessageProvider>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );
      await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

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
      const store = mockStore({});
      const mockWithStatus = mockIntakeQuery({
        status: 'NOT_IT_REQUEST'
      });

      render(
        <MemoryRouter
          initialEntries={['/governance-task-list/sysIntakeRequest123']}
        >
          <MockedProvider mocks={[mockWithStatus]} addTypename={false}>
            <Provider store={store}>
              <MessageProvider>
                <Route path="/governance-task-list/:systemId">
                  <GovernanceTaskList />
                </Route>
              </MessageProvider>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );
      await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

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
