import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor, within } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';

import { businessCaseInitialData } from 'data/businessCase';
import { grtActions } from 'data/mock/grtActions';
import { initialSystemIntakeForm } from 'data/systemIntake';
import { MessageProvider } from 'hooks/useMessage';
import GetAdminNotesAndActionsQuery from 'queries/GetAdminNotesAndActionsQuery';
import GetSystemIntakeQuery from 'queries/GetSystemIntakeQuery';

import RequestOverview from './RequestOverview';

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

window.matchMedia = (): any => ({
  addListener: () => {},
  removeListener: () => {}
});

const waitForPageLoad = async (testId: string = 'grt-submit-action-view') => {
  await waitFor(() => {
    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });
};

describe('Governance Review Team', () => {
  const intakeQuery = {
    request: {
      query: GetSystemIntakeQuery,
      variables: {
        id: 'a4158ad8-1236-4a55-9ad5-7e15a5d49de2'
      }
    },
    result: {
      data: {
        systemIntake: {
          id: 'a4158ad8-1236-4a55-9ad5-7e15a5d49de2',
          euaUserId: 'ABCD',
          adminLead: null,
          businessNeed: 'Test business need',
          businessSolution: 'Test business solution',
          businessOwner: {
            component: 'Center for Medicaid and CHIP Services',
            name: 'ABCD'
          },
          contract: {
            contractor: 'Contractor Name',
            endDate: {
              day: '31',
              month: '12',
              year: '2023'
            },
            hasContract: 'HAVE_CONTRACT',
            startDate: {
              day: '1',
              month: '1',
              year: '2021'
            },
            vehicle: 'Sole source',
            number: '123456-7890'
          },
          costs: {
            isExpectingIncrease: 'YES',
            expectedIncreaseAmount: '10 million dollars'
          },
          annualSpending: {
            currentAnnualSpending: 'Test Current Annual Spending',
            plannedYearOneSpending: 'Test Planned Year One Spending'
          },
          currentStage: 'I have done some initial research',
          decisionNextSteps: null,
          grbDate: null,
          grtDate: null,
          grtFeedbacks: [],
          governanceTeams: {
            isPresent: true,
            teams: [
              {
                acronym: 'EA',
                collaborator: 'EA Collaborator Name',
                key: 'enterpriseArchitecture',
                label: 'Enterprise Architecture (EA)',
                name: 'Enterprise Architecture'
              },
              {
                acronym: 'ISPG',
                collaborator: 'OIT Collaborator Name',
                key: 'securityPrivacy',
                label: "OIT's Security and Privacy Group (ISPG)",
                name: "OIT's Security and Privacy Group"
              },
              {
                acronym: 'TRB',
                collaborator: 'TRB Collaborator Name',
                key: 'technicalReviewBoard',
                label: 'Technical Review Board (TRB)',
                name: 'Technical Review Board'
              }
            ]
          },
          isso: {
            isPresent: true,
            name: 'ISSO Name'
          },
          existingFunding: true,
          fundingSources: [{ fundingNumber: '123456', source: 'Research' }],
          lcid: null,
          lcidExpiresAt: null,
          lcidScope: null,
          lcidCostBaseline: null,
          needsEaSupport: true,
          productManager: {
            component: 'Center for Program Integrity',
            name: 'Project Manager'
          },
          rejectionReason: null,
          requester: {
            component: 'Center for Medicaid and CHIP Services',
            email: null,
            name: 'User ABCD'
          },
          requestName: 'TACO',
          requestType: 'NEW',
          status: 'INTAKE_SUBMITTED',
          createdAt: null,
          submittedAt: null,
          updatedAt: null,
          archivedAt: null,
          decidedAt: null,
          businessCaseId: null,
          lastAdminNote: {
            content: null,
            createdAt: null
          },
          grtReviewEmailBody: null,
          hasUiChanges: true,
          documents: []
        }
      }
    }
  };

  const adminNotesAndActionsQuery = {
    request: {
      query: GetAdminNotesAndActionsQuery,
      variables: {
        id: 'a4158ad8-1236-4a55-9ad5-7e15a5d49de2'
      }
    },
    result: {
      data: {
        systemIntake: {
          lcid: null,
          notes: [
            {
              id: '074632f8-44fd-4c57-851c-4577ec1af230',
              createdAt: '2021-07-07T20:27:04Z',
              content: 'a clever remark',
              author: {
                name: 'Author Name',
                eua: 'QQQQ'
              }
            }
          ],
          actions: [
            {
              id: '9c3e767b-f1af-46ff-93cf-0ace61f30e89',
              createdAt: '2021-07-07T20:32:04Z',
              feedback: 'This business case needs feedback',
              type: 'PROVIDE_FEEDBACK_NEED_BIZ_CASE',
              lcidExpirationChange: null,
              actor: {
                name: 'Actor Name',
                email: 'actor@example.com'
              }
            },
            {
              id: '7e94bf26-70ac-44f2-af8c-179e34b960cf',
              createdAt: '2021-07-07T20:22:04Z',
              feedback: null,
              type: 'SUBMIT_INTAKE',
              lcidExpirationChange: null,
              actor: {
                name: 'Actor Name',
                email: 'actor@example.com'
              }
            }
          ]
        }
      }
    }
  };

  const mockStore = configureMockStore();
  const defaultStore = mockStore({
    auth: {
      euaId: 'AAAA',
      isUserSet: true,
      groups: ['EASI_D_GOVTEAM']
    },
    systemIntake: {
      systemIntake: {
        ...initialSystemIntakeForm,
        businessCaseId: '51aaa76e-57a6-4bff-ae51-f693b8038ba2'
      }
    },
    businessCase: {
      form: {
        ...businessCaseInitialData,
        id: '51aaa76e-57a6-4bff-ae51-f693b8038ba2'
      }
    }
  });

  it('renders without errors (intake request)', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/governance-review-team/a4158ad8-1236-4a55-9ad5-7e15a5d49de2/intake-request'
        ]}
      >
        <MockedProvider mocks={[intakeQuery]} addTypename={false}>
          <Provider store={defaultStore}>
            <MessageProvider>
              <Route path="/governance-review-team/:systemId/intake-request">
                <RequestOverview />
              </Route>
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForPageLoad('intake-review');

    expect(screen.getByTestId('grt-request-overview')).toBeInTheDocument();
    expect(screen.getByTestId('intake-review')).toBeInTheDocument();
  });

  it('renders GRT business case view', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/governance-review-team/a4158ad8-1236-4a55-9ad5-7e15a5d49de2/business-case'
        ]}
      >
        <MockedProvider mocks={[intakeQuery]} addTypename={false}>
          <Provider store={defaultStore}>
            <MessageProvider>
              <Route path="/governance-review-team/:systemId/business-case">
                <RequestOverview />
              </Route>
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForPageLoad('business-case-review');
  });

  it('renders GRT notes view', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/governance-review-team/a4158ad8-1236-4a55-9ad5-7e15a5d49de2/notes'
        ]}
      >
        {/* TODO: There shouldn't need to be three mocked queries; only 2 */}
        <MockedProvider
          mocks={[intakeQuery, adminNotesAndActionsQuery, intakeQuery]}
          addTypename={false}
        >
          <Provider store={defaultStore}>
            <MessageProvider>
              <Route path="/governance-review-team/:systemId/notes">
                <RequestOverview />
              </Route>
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForPageLoad('grt-notes-view');
  });

  it('renders GRT dates view', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/governance-review-team/a4158ad8-1236-4a55-9ad5-7e15a5d49de2/dates'
        ]}
      >
        <MockedProvider mocks={[intakeQuery]} addTypename={false}>
          <Provider store={defaultStore}>
            <MessageProvider>
              <Route path="/governance-review-team/:systemId/dates">
                <RequestOverview />
              </Route>
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForPageLoad('grt-dates-view');
  });

  it('renders GRT dates view', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/governance-review-team/a4158ad8-1236-4a55-9ad5-7e15a5d49de2/decision'
        ]}
      >
        <MockedProvider mocks={[intakeQuery]} addTypename={false}>
          <Provider store={defaultStore}>
            <MessageProvider>
              <Route path="/governance-review-team/:systemId/decision">
                <RequestOverview />
              </Route>
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForPageLoad('grt-decision-view');
  });

  it('renders GRT actions view', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/governance-review-team/a4158ad8-1236-4a55-9ad5-7e15a5d49de2/actions'
        ]}
      >
        <MockedProvider mocks={[intakeQuery]} addTypename={false}>
          <Provider store={defaultStore}>
            <MessageProvider>
              <Route path="/governance-review-team/:systemId/actions">
                <RequestOverview />
              </Route>
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForPageLoad('grt-actions-view');
  });

  describe('actions', () => {
    const renderPage = (slug: string) => {
      render(
        <MemoryRouter
          initialEntries={[
            `/governance-review-team/a4158ad8-1236-4a55-9ad5-7e15a5d49de2/actions/${slug}`
          ]}
        >
          <MockedProvider mocks={[intakeQuery]} addTypename={false}>
            <Provider store={defaultStore}>
              <MessageProvider>
                <Route path="/governance-review-team/:systemId/actions/:activePage">
                  <RequestOverview />
                </Route>
              </MessageProvider>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );
    };

    const actionsList = [
      'not-it-request',
      'need-biz-case',
      'provide-feedback-need-biz-case',
      'provide-feedback-keep-draft',
      'provide-feedback-need-final',
      'ready-for-grt',
      'ready-for-grb',
      'biz-case-needs-changes',
      'no-governance',
      'send-email',
      'not-responding-close',
      'issue-lcid',
      'not-approved'
    ];

    test.each(actionsList)('renders action page %j', async action => {
      renderPage(action);
      await waitForPageLoad(grtActions[action as keyof typeof grtActions].view);
      const selectedAction = screen.getByTestId('grtSelectedAction');
      expect(
        within(selectedAction).getByText(
          grtActions[action as keyof typeof grtActions].heading
        )
      ).toBeInTheDocument();
    });
  });
});
