import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';

import { MessageProvider } from 'hooks/useMessage';
import GetSystemIntakeQuery from 'queries/GetSystemIntakeQuery';
import { GetSystemIntakeContactsQuery } from 'queries/SystemIntakeContactsQueries';
import { GetSystemIntake_systemIntake as SystemIntake } from 'queries/types/GetSystemIntake';
import {
  SystemIntakeRequestType,
  SystemIntakeStatus
} from 'types/graphql-global-types';
import { SystemIntakeContactProps } from 'types/systemIntake';

import IntakeReview from './index';

describe('The GRT intake review view', () => {
  let dateSpy: any;
  beforeAll(() => {
    // September 30, 2020
    dateSpy = jest.spyOn(Date, 'now').mockImplementation(() => 1601449200000);
  });

  afterAll(() => {
    dateSpy.mockRestore();
  });

  const systemIntakeId = 'a4158ad8-1236-4a55-9ad5-7e15a5d49de2';

  const requester: SystemIntakeContactProps = {
    systemIntakeId,
    role: 'Requester',
    euaUserId: 'SF13',
    commonName: 'Jerry Seinfeld',
    component: 'Center for Medicaid and CHIP Services',
    email: 'sf13@local.fake',
    id: 'dadffca7-35ef-4498-974b-e5fe95ff028e'
  };

  const businessOwner: SystemIntakeContactProps = {
    systemIntakeId,
    role: 'Business Owner',
    euaUserId: 'SF13',
    commonName: 'Jerry Seinfeld',
    component: 'Center for Medicaid and CHIP Services',
    email: 'sf13@local.fake',
    id: 'b25bd13b-72a0-4d0e-b5be-7852a1a8259d'
  };

  const productManager: SystemIntakeContactProps = {
    systemIntakeId,
    euaUserId: 'KR14',
    role: 'Product Manager',
    commonName: 'Cosmo Kramer',
    component: 'Center for Program Integrity',
    email: 'kr14@local.fake',
    id: '' // Leave out ID so contact shows as unverified
  };

  const isso: SystemIntakeContactProps = {
    systemIntakeId,
    euaUserId: 'WXYZ',
    role: 'ISSO',
    commonName: 'John Smith',
    component: 'CMS Wide',
    email: 'wxyz@local.fake',
    id: '346eefa9-c635-4c0b-bc29-26f272c33d0c'
  };

  const systemIntake: SystemIntake = {
    __typename: 'SystemIntake',
    requestName: 'Mock System Intake Request',
    id: systemIntakeId,
    euaUserId: requester.euaUserId,
    adminLead: '',
    status: SystemIntakeStatus.INTAKE_SUBMITTED,
    requester: {
      __typename: 'SystemIntakeRequester',
      name: requester.commonName,
      component: requester.component,
      email: requester.email
    },
    requestType: SystemIntakeRequestType.NEW,
    businessOwner: {
      __typename: 'SystemIntakeBusinessOwner',
      name: businessOwner.commonName,
      component: businessOwner.component
    },
    productManager: {
      __typename: 'SystemIntakeProductManager',
      name: productManager.commonName,
      component: productManager.component
    },
    isso: {
      __typename: 'SystemIntakeISSO',
      isPresent: true,
      name: isso.commonName
    },
    governanceTeams: {
      __typename: 'SystemIntakeGovernanceTeam',
      isPresent: false,
      teams: null
    },
    existingFunding: false,
    fundingSources: [],
    costs: {
      __typename: 'SystemIntakeCosts',
      expectedIncreaseAmount: '',
      isExpectingIncrease: 'NO'
    },
    annualSpending: {
      __typename: 'SystemIntakeAnnualSpending',
      currentAnnualSpending: '',
      plannedYearOneSpending: ''
    },
    contract: {
      __typename: 'SystemIntakeContract',
      hasContract: 'IN_PROGRESS',
      contractor: 'TrussWorks, Inc.',
      vehicle: 'Sole Source',
      number: '123456-7890',
      startDate: {
        __typename: 'ContractDate',
        month: '1',
        day: '',
        year: '2020'
      },
      endDate: {
        __typename: 'ContractDate',
        month: '12',
        day: '',
        year: '2020'
      }
    },
    decisionNextSteps: '',
    businessNeed: 'The quick brown fox jumps over the lazy dog.',
    businessSolution: 'The quick brown fox jumps over the lazy dog.',
    currentStage: 'The quick brown fox jumps over the lazy dog.',
    needsEaSupport: false,
    grtReviewEmailBody: 'The quick brown fox jumps over the lazy dog.',
    decidedAt: new Date().toISOString(),
    submittedAt: new Date(2020, 8, 30).toISOString(),
    grbDate: null,
    grtDate: null,
    grtFeedbacks: [],
    lcid: null,
    lcidExpiresAt: null,
    lcidScope: null,
    lcidCostBaseline: null,
    rejectionReason: null,
    updatedAt: null,
    createdAt: '2022-10-21T14:55:47.88283Z',
    businessCaseId: null,
    archivedAt: null,
    lastAdminNote: {
      __typename: 'LastAdminNote',
      content: null,
      createdAt: null
    },
    hasUiChanges: false,
    documents: []
  };

  const getSystemIntakeContactsQuery = {
    request: {
      query: GetSystemIntakeContactsQuery,
      variables: {
        id: systemIntakeId
      }
    },
    result: {
      data: {
        systemIntakeContacts: {
          systemIntakeContacts: [requester, businessOwner, isso]
        }
      }
    }
  };

  const systemIntakeQuery = {
    request: {
      query: GetSystemIntakeQuery,
      variables: {
        id: systemIntakeId
      }
    },
    result: {
      data: {
        systemIntake
      }
    }
  };

  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <MockedProvider
          mocks={[systemIntakeQuery, getSystemIntakeContactsQuery]}
        >
          <MessageProvider>
            <IntakeReview systemIntake={systemIntake} />
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );
    expect(screen.getByTestId('intake-review')).toBeInTheDocument();
  });

  it('matches the snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          `/governance-review-team/${systemIntake.id}/intake-request`
        ]}
      >
        <MockedProvider
          mocks={[systemIntakeQuery, getSystemIntakeContactsQuery]}
          addTypename={false}
        >
          <Route path={['/governance-review-team/:systemId/intake-request']}>
            <MessageProvider>
              <IntakeReview systemIntake={systemIntake} />
            </MessageProvider>
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(
      await screen.findByTestId(`contact-requester-${requester.id}`)
    ).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders increased costs data', () => {
    const mockIntake: SystemIntake = {
      ...systemIntake,
      costs: {
        __typename: 'SystemIntakeCosts',
        isExpectingIncrease: 'YES',
        expectedIncreaseAmount: 'less than $1 million'
      }
    };

    render(
      <MemoryRouter>
        <MockedProvider mocks={[getSystemIntakeContactsQuery]}>
          <MessageProvider>
            <IntakeReview systemIntake={mockIntake} />
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/less than \$1 million/i)).toBeInTheDocument();
  });

  it('renders annual spending data', () => {
    const mockIntake: SystemIntake = {
      ...systemIntake,
      annualSpending: {
        __typename: 'SystemIntakeAnnualSpending',
        currentAnnualSpending: 'about $3.50',
        plannedYearOneSpending: 'more than $1 million'
      }
    };

    render(
      <MemoryRouter>
        <MockedProvider mocks={[getSystemIntakeContactsQuery]}>
          <MessageProvider>
            <IntakeReview systemIntake={mockIntake} />
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/about \$3.50/i)).toBeInTheDocument();
    expect(screen.getByText(/more than \$1 million/i)).toBeInTheDocument();
  });
});
