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

import { MessageProvider } from 'hooks/useMessage';
import GetSytemIntakeQuery from 'queries/GetSystemIntakeQuery';
import {
  GetSystemIntake,
  GetSystemIntakeVariables
} from 'queries/types/GetSystemIntake';
import { SystemIntakeDocument } from 'queries/types/SystemIntakeDocument';
import {
  SystemIntakeDocumentCommonType,
  SystemIntakeDocumentStatus,
  SystemIntakeRequestType,
  SystemIntakeStatus
} from 'types/graphql-global-types';
import { MockedQuery } from 'types/util';

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

const documents: SystemIntakeDocument[] = [
  {
    id: '3b23fcf9-85d3-4211-a7d8-d2d08148f196',
    fileName: 'sample1.pdf',
    documentType: {
      commonType: SystemIntakeDocumentCommonType.DRAFT_ICGE,
      otherTypeDescription: null,
      __typename: 'SystemIntakeDocumentType'
    },
    status: SystemIntakeDocumentStatus.AVAILABLE,
    uploadedAt: '2023-06-14T18:24:46.310929Z',
    url:
      'http://host.docker.internal:9000/easi-app-file-uploads/ead3f487-8aaa-47d2-aa26-335e9b560a92.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20230614%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230614T184943Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host&X-Amz-Signature=f71d5d63d68958a2bd8526c2b2cdd5abe78b21eb69d10739fe8f8e6fd5d010ec',
    __typename: 'SystemIntakeDocument'
  },
  {
    id: '8cd01e45-810d-445d-b702-b31b8e1b1f14',
    fileName: 'sample2.pdf',
    documentType: {
      commonType: SystemIntakeDocumentCommonType.SOO_SOW,
      otherTypeDescription: null,
      __typename: 'SystemIntakeDocumentType'
    },
    status: SystemIntakeDocumentStatus.PENDING,
    uploadedAt: '2023-06-14T18:24:46.32661Z',
    url:
      'http://host.docker.internal:9000/easi-app-file-uploads/7e047111-6228-4943-9c4b-0961f27858f4.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20230614%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230614T184943Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host&X-Amz-Signature=0e3f337697c616b01533accd95a316cbeabeb6990961b9881911c757837cbf95',
    __typename: 'SystemIntakeDocument'
  },
  {
    id: 'f7138102-c9aa-4215-a331-6ee9aedf5ef3',
    fileName: 'sample3.pdf',
    documentType: {
      commonType: SystemIntakeDocumentCommonType.OTHER,
      otherTypeDescription: 'Some other type of doc',
      __typename: 'SystemIntakeDocumentType'
    },
    status: SystemIntakeDocumentStatus.UNAVAILABLE,
    uploadedAt: '2023-06-14T18:24:46.342866Z',
    url:
      'http://host.docker.internal:9000/easi-app-file-uploads/f779e8e4-9c78-4b14-bbab-37618447f3f9.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20230614%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230614T184943Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host&X-Amz-Signature=7e6755645a1f163d41d2fa7c19776d0ceb4cfd3ff8e1c2918c428a551fe44764',
    __typename: 'SystemIntakeDocument'
  }
];

const systemIntake: NonNullable<GetSystemIntake['systemIntake']> = {
  __typename: 'SystemIntake',
  id: 'ccdfdcf5-5085-4521-9f77-fa1ea324502b',
  euaUserId: 'SF13',
  adminLead: null,
  businessNeed: null,
  businessSolution: null,
  businessOwner: {
    __typename: 'SystemIntakeBusinessOwner',
    component: null,
    name: null
  },
  contract: {
    __typename: 'SystemIntakeContract',
    contractor: null,
    endDate: {
      __typename: 'ContractDate',
      day: null,
      month: null,
      year: null
    },
    hasContract: null,
    startDate: {
      __typename: 'ContractDate',
      day: null,
      month: null,
      year: null
    },
    vehicle: null,
    number: '123456-7890'
  },
  annualSpending: {
    __typename: 'SystemIntakeAnnualSpending',
    currentAnnualSpending: null,
    plannedYearOneSpending: null
  },
  costs: {
    __typename: 'SystemIntakeCosts',
    isExpectingIncrease: null,
    expectedIncreaseAmount: null
  },
  currentStage: null,
  decisionNextSteps: null,
  grbDate: null,
  grtDate: null,
  grtFeedbacks: [],
  governanceTeams: {
    __typename: 'SystemIntakeGovernanceTeam',
    isPresent: false,
    teams: null
  },
  isso: {
    __typename: 'SystemIntakeISSO',
    isPresent: false,
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
    __typename: 'SystemIntakeProductManager',
    component: null,
    name: null
  },
  rejectionReason: null,
  requester: {
    __typename: 'SystemIntakeRequester',
    component: null,
    email: null,
    name: 'Jerry Seinfeld'
  },
  requestName: '',
  requestType: SystemIntakeRequestType.NEW,
  status: SystemIntakeStatus.INTAKE_DRAFT,
  createdAt: '2023-06-14T18:20:46.342866Z',
  submittedAt: null,
  updatedAt: null,
  archivedAt: null,
  decidedAt: null,
  businessCaseId: null,
  lastAdminNote: {
    __typename: 'LastAdminNote',
    content: null,
    createdAt: null
  },
  hasUiChanges: null,
  grtReviewEmailBody: null,
  documents
};

describe('The System Intake page', () => {
  const intakeQuery: MockedQuery<GetSystemIntake, GetSystemIntakeVariables> = {
    request: {
      query: GetSytemIntakeQuery,
      variables: {
        id: systemIntake.id
      }
    },
    result: {
      data: {
        systemIntake
      }
    }
  };

  it('renders without crashing', async () => {
    render(
      <MemoryRouter
        initialEntries={[`/system/${systemIntake.id}/contact-details`]}
      >
        <MockedProvider mocks={[intakeQuery]}>
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
        <MockedProvider mocks={[intakeQuery]}>
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
        <MockedProvider mocks={[intakeQuery]}>
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
        <MockedProvider mocks={[intakeQuery]}>
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
        <MockedProvider mocks={[intakeQuery]}>
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
        <MockedProvider mocks={[intakeQuery]}>
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
        <MockedProvider mocks={[intakeQuery]}>
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
        <MockedProvider mocks={[intakeQuery]}>
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
