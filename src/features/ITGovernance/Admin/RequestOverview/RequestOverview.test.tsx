import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  GetAdminNotesAndActionsDocument,
  GetAdminNotesAndActionsQuery,
  SystemIntakeActionType
} from 'gql/generated/graphql';
import configureMockStore from 'redux-mock-store';
import {
  getGovernanceTaskListQuery,
  getSystemIntakeContactsQuery,
  getSystemIntakeQuery,
  systemIntake
} from 'tests/mock/systemIntake';

import { businessCaseInitialData } from 'data/businessCase';
import { MessageProvider } from 'hooks/useMessage';

import Actions from '../Actions';

import RequestOverview from './RequestOverview';

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

const mockStore = configureMockStore();
const defaultStore = mockStore({
  auth: {
    euaId: 'AAAA',
    isUserSet: true,
    groups: ['EASI_D_GOVTEAM']
  },
  systemIntake: {
    systemIntake: {
      ...systemIntake,
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

const adminNotesAndActionsQueryData: GetAdminNotesAndActionsQuery = {
  __typename: 'Query',
  systemIntake: {
    __typename: 'SystemIntake',
    id: systemIntake.id,
    lcid: null,
    notes: [
      {
        __typename: 'SystemIntakeNote',
        id: '074632f8-44fd-4c57-851c-4577ec1af230',
        createdAt: '2021-07-07T20:27:04Z',
        content: 'a clever remark',
        author: {
          __typename: 'SystemIntakeNoteAuthor',
          name: 'Author Name',
          eua: 'QQQQ'
        },
        editor: {
          __typename: 'UserInfo',
          commonName: 'Jerry Seinfeld'
        },
        modifiedBy: 'SF13',
        modifiedAt: '',
        isArchived: false
      }
    ],
    actions: [
      {
        __typename: 'SystemIntakeAction',
        id: '9c3e767b-f1af-46ff-93cf-0ace61f30e89',
        createdAt: '2021-07-07T20:32:04Z',
        feedback: 'This business case needs feedback',
        type: SystemIntakeActionType.PROVIDE_FEEDBACK_NEED_BIZ_CASE,
        lcidExpirationChange: null,
        actor: {
          __typename: 'SystemIntakeActionActor',
          name: 'Actor Name',
          email: 'actor@example.com'
        }
      },
      {
        __typename: 'SystemIntakeAction',
        id: '7e94bf26-70ac-44f2-af8c-179e34b960cf',
        createdAt: '2021-07-07T20:22:04Z',
        feedback: null,
        type: SystemIntakeActionType.SUBMIT_INTAKE,
        lcidExpirationChange: null,
        actor: {
          __typename: 'SystemIntakeActionActor',
          name: 'Actor Name',
          email: 'actor@example.com'
        }
      }
    ]
  }
};

describe('Governance Review Team', () => {
  const adminNotesAndActionsQuery = {
    request: {
      query: GetAdminNotesAndActionsDocument,
      variables: {
        id: systemIntake.id
      }
    },
    result: {
      data: adminNotesAndActionsQueryData
    }
  };

  it('renders without errors (Intake Request)', async () => {
    render(
      <MemoryRouter
        initialEntries={[`/it-governance/${systemIntake.id}/intake-request`]}
      >
        <MockedProvider
          mocks={[getSystemIntakeQuery(), getSystemIntakeContactsQuery]}
          addTypename={false}
        >
          <Provider store={defaultStore}>
            <MessageProvider>
              <Route path="/it-governance/:systemId/intake-request">
                <RequestOverview
                  grbVotingInformation={systemIntake.grbVotingInformation}
                />
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

  it('renders GRT Business Case view', async () => {
    render(
      <MemoryRouter
        initialEntries={[`/it-governance/${systemIntake.id}/business-case`]}
      >
        <MockedProvider mocks={[getSystemIntakeQuery()]} addTypename={false}>
          <Provider store={defaultStore}>
            <MessageProvider>
              <Route path="/it-governance/:systemId/business-case">
                <RequestOverview
                  grbVotingInformation={systemIntake.grbVotingInformation}
                />
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
        initialEntries={[`/it-governance/${systemIntake.id}/notes`]}
      >
        {/* TODO: There shouldn't need to be three mocked queries; only 2 */}
        <MockedProvider
          mocks={[
            getSystemIntakeQuery(),
            adminNotesAndActionsQuery,
            getSystemIntakeQuery()
          ]}
          addTypename={false}
        >
          <Provider store={defaultStore}>
            <MessageProvider>
              <Route path="/it-governance/:systemId/notes">
                <RequestOverview
                  grbVotingInformation={systemIntake.grbVotingInformation}
                />
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
        initialEntries={[`/it-governance/${systemIntake.id}/dates`]}
      >
        <MockedProvider mocks={[getSystemIntakeQuery()]} addTypename={false}>
          <Provider store={defaultStore}>
            <MessageProvider>
              <Route path="/it-governance/:systemId/dates">
                <RequestOverview
                  grbVotingInformation={systemIntake.grbVotingInformation}
                />
              </Route>
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitForPageLoad('grt-dates-view');
  });

  it('renders GRT decision view', async () => {
    render(
      <MemoryRouter
        initialEntries={[`/it-governance/${systemIntake.id}/decision`]}
      >
        <MockedProvider mocks={[getSystemIntakeQuery()]} addTypename={false}>
          <Provider store={defaultStore}>
            <MessageProvider>
              <Route path="/it-governance/:systemId/decision">
                <RequestOverview
                  grbVotingInformation={systemIntake.grbVotingInformation}
                />
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
        initialEntries={[`/it-governance/${systemIntake.id}/actions`]}
      >
        <MockedProvider
          mocks={[getSystemIntakeQuery(), getGovernanceTaskListQuery()]}
          addTypename={false}
        >
          <MessageProvider>
            <Route path="/it-governance/:systemId/actions">
              <Actions systemIntake={systemIntake} />
            </Route>
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitForPageLoad('grt-actions-view');

    // screen.debug(undefined, Infinity);
  });
});

describe('Governance Review Board', () => {
  it('hides GRT navigation items', async () => {
    render(
      <MemoryRouter
        initialEntries={[`/it-governance/${systemIntake.id}/intake-request`]}
      >
        <MockedProvider
          mocks={[getSystemIntakeQuery(), getSystemIntakeContactsQuery]}
          addTypename={false}
        >
          <Provider store={defaultStore}>
            <MessageProvider>
              <Route path="/it-governance/:systemId/intake-request">
                <RequestOverview
                  grbVotingInformation={systemIntake.grbVotingInformation}
                />
              </Route>
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitForPageLoad('intake-review');

    expect(screen.queryByRole('link', { name: 'Dates' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Action' })).toBeNull();
  });
});
