import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import configureMockStore from 'redux-mock-store';

import { businessCaseInitialData } from 'data/businessCase';
import { initialSystemIntakeForm } from 'data/systemIntake';
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

const waitForPageLoad = async () => {
  await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));
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
            vehicle: 'Sole source'
          },
          costs: {
            isExpectingIncrease: 'YES',
            expectedIncreaseAmount: '10 million dollars'
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
          fundingSource: {
            fundingNumber: '123456',
            isFunded: true,
            source: 'Research'
          },
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
          grtReviewEmailBody: null
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
            <Route path="/governance-review-team/:systemId/intake-request">
              <RequestOverview />
            </Route>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForPageLoad();

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
            <Route path="/governance-review-team/:systemId/business-case">
              <RequestOverview />
            </Route>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForPageLoad();

    expect(screen.getByTestId('business-case-review')).toBeInTheDocument();
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
            <Route path="/governance-review-team/:systemId/notes">
              <RequestOverview />
            </Route>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForPageLoad();

    expect(screen.getByTestId('grt-notes-view')).toBeInTheDocument();
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
            <Route path="/governance-review-team/:systemId/dates">
              <RequestOverview />
            </Route>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForPageLoad();

    expect(screen.getByTestId('grt-dates-view')).toBeInTheDocument();
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
            <Route path="/governance-review-team/:systemId/decision">
              <RequestOverview />
            </Route>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForPageLoad();

    expect(screen.getByTestId('grt-decision-view')).toBeInTheDocument();
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
            <Route path="/governance-review-team/:systemId/actions">
              <RequestOverview />
            </Route>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForPageLoad();

    expect(screen.getByTestId('grt-actions-view')).toBeInTheDocument();
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
              <Route path="/governance-review-team/:systemId/actions/:activePage">
                <RequestOverview />
              </Route>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );
    };
    it('renders not IT request action', async () => {
      renderPage('not-it-request');
      await waitForPageLoad();

      expect(screen.getByTestId('grt-submit-action-view')).toBeInTheDocument();
    });

    it('renders GRT need business case action', async () => {
      renderPage('need-biz-case');
      await waitForPageLoad();

      expect(screen.getByTestId('grt-submit-action-view')).toBeInTheDocument();
    });

    it('renders GRT feedback and need business case action', async () => {
      renderPage('provide-feedback-need-biz-case');
      await waitForPageLoad();

      expect(
        screen.getByTestId('provide-feedback-biz-case')
      ).toBeInTheDocument();
    });

    it('renders GRT draft business case feedback action', async () => {
      renderPage('provide-feedback-keep-draft');
      await waitForPageLoad();

      expect(
        screen.getByTestId('provide-feedback-biz-case')
      ).toBeInTheDocument();
    });

    it('renders GRT final business case feedback action', async () => {
      renderPage('provide-feedback-need-final');
      await waitForPageLoad();

      expect(
        screen.getByTestId('provide-feedback-biz-case')
      ).toBeInTheDocument();
    });

    it('renders ready for GRT action', async () => {
      renderPage('ready-for-grt');
      await waitForPageLoad();

      expect(screen.getByTestId('grt-submit-action-view')).toBeInTheDocument();
    });

    it('renders ready for GRB action', async () => {
      renderPage('ready-for-grb');
      await waitForPageLoad();

      expect(screen.getByTestId('ready-for-grb')).toBeInTheDocument();
    });

    it('renders business case not ready for GRT action', async () => {
      renderPage('biz-case-needs-changes');
      await waitForPageLoad();

      expect(screen.getByTestId('grt-submit-action-view')).toBeInTheDocument();
    });

    it('renders no governance action', async () => {
      renderPage('no-governance');
      await waitForPageLoad();

      expect(screen.getByTestId('grt-submit-action-view')).toBeInTheDocument();
    });

    it('renders send email action', async () => {
      renderPage('send-email');
      await waitForPageLoad();

      expect(screen.getByTestId('grt-submit-action-view')).toBeInTheDocument();
    });

    it('renders guide received close action', async () => {
      renderPage('guide-received-close');
      await waitForPageLoad();

      expect(screen.getByTestId('grt-submit-action-view')).toBeInTheDocument();
    });

    it('renders not responding close action', async () => {
      renderPage('not-responding-close');
      await waitForPageLoad();

      expect(screen.getByTestId('grt-submit-action-view')).toBeInTheDocument();
    });

    it('renders not issue lcid action', async () => {
      renderPage('issue-lcid');
      await waitForPageLoad();

      expect(screen.getByTestId('issue-lcid')).toBeInTheDocument();
    });

    it('renders not approved action', async () => {
      renderPage('not-approved');
      await waitForPageLoad();

      expect(screen.getByTestId('not-approved')).toBeInTheDocument();
    });
  });
});
