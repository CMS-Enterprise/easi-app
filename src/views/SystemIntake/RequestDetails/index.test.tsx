import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  screen,
  waitForElementToBeRemoved,
  within
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import GetSytemIntakeQuery from 'queries/GetSystemIntakeQuery';
import { UpdateSystemIntakeRequestDetails } from 'queries/SystemIntakeQueries';

import SystemIntake from '../index';

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

describe('The intake request details page', () => {
  const INTAKE_ID = 'ccdfdcf5-5085-4521-9f77-fa1ea324502b';
  const intakeQuery = {
    request: {
      query: GetSytemIntakeQuery,
      variables: {
        id: INTAKE_ID
      }
    },
    result: {
      data: {
        systemIntake: {
          id: INTAKE_ID,
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
          submittedAt: null
        }
      }
    }
  };

  it('renders without errors', async () => {
    render(
      <MemoryRouter initialEntries={[`/system/${INTAKE_ID}/request-details`]}>
        <MockedProvider mocks={[intakeQuery]} addTypename={false}>
          <Route path="/system/:systemId/:formPage">
            <SystemIntake />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(screen.getByTestId('system-intake')).toBeInTheDocument();
  });

  it('fills out required fields', async () => {
    const updateRequestDetails = {
      request: {
        query: UpdateSystemIntakeRequestDetails,
        variables: {
          input: {
            businessNeed: 'Business need',
            businessSolution: 'Business solution',
            id: INTAKE_ID,
            needsEaSupport: false,
            requestName: 'Project name'
          }
        }
      },
      result: {
        data: {
          updateSystemIntakeRequestDetails: {
            systemIntake: {
              id: INTAKE_ID,
              requestName: 'Project name',
              businessNeed: 'Business need',
              businessSolution: 'Business solution',
              needsEaSupport: false
            }
          }
        }
      }
    };

    render(
      <MemoryRouter initialEntries={[`/system/${INTAKE_ID}/request-details`]}>
        <MockedProvider
          mocks={[intakeQuery, updateRequestDetails]}
          addTypename={false}
        >
          <Route path="/system/:systemId/:formPage">
            <SystemIntake />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    const projectName = screen.getByRole('textbox', { name: /project name/i });
    userEvent.type(projectName, 'Project name');
    expect(projectName).toHaveValue('Project name');

    const businessNeed = screen.getByRole('textbox', {
      name: /business need/i
    });
    userEvent.type(businessNeed, 'Business need');
    expect(businessNeed).toHaveValue('Business need');

    const businessSolution = screen.getByRole('textbox', {
      name: /how are you thinking of solving it/i
    });
    userEvent.type(businessSolution, 'Business solution');
    expect(businessSolution).toHaveValue('Business solution');

    const eaSupport = screen.getByTestId('ea-support');
    const eaSupportNo = within(eaSupport).getByRole('radio', {
      name: /no/i
    });
    userEvent.click(eaSupportNo);

    screen.getByRole('button', { name: /next/i }).click();
    expect(
      await screen.findByRole('heading', { name: /contract details/i })
    ).toBeInTheDocument();
  });

  it('displays formik errors', async () => {
    render(
      <MemoryRouter initialEntries={[`/system/${INTAKE_ID}/request-details`]}>
        <MockedProvider mocks={[intakeQuery]} addTypename={false}>
          <Route path="/system/:systemId/:formPage">
            <SystemIntake />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    screen.getByRole('button', { name: /next/i }).click();

    expect(
      await screen.findByTestId('request-details-errors')
    ).toBeInTheDocument();
  });

  it('navigates back a page', async () => {
    const updateRequestDetails = {
      request: {
        query: UpdateSystemIntakeRequestDetails,
        variables: {
          input: {
            businessNeed: '',
            businessSolution: '',
            id: INTAKE_ID,
            needsEaSupport: null,
            requestName: ''
          }
        }
      },
      result: {
        data: {
          updateSystemIntakeRequestDetails: {
            systemIntake: {
              id: INTAKE_ID,
              requestName: '',
              businessNeed: '',
              businessSolution: '',
              needsEaSupport: null
            }
          }
        }
      }
    };

    render(
      <MemoryRouter initialEntries={[`/system/${INTAKE_ID}/request-details`]}>
        <MockedProvider
          mocks={[intakeQuery, updateRequestDetails]}
          addTypename={false}
        >
          <Route path="/system/:systemId/:formPage">
            <SystemIntake />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    screen.getByRole('button', { name: /back/i }).click();
    expect(
      await screen.findByRole('heading', { name: /contact details/i, level: 1 })
    ).toBeInTheDocument();
  });
});
