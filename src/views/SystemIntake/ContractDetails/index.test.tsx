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
import { UpdateSystemIntakeContractDetails } from 'queries/SystemIntakeQueries';

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

describe('The intake request contract details', () => {
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
      <MemoryRouter initialEntries={[`/system/${INTAKE_ID}/contract-details`]}>
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
    const updateContractDetails = {
      request: {
        query: UpdateSystemIntakeContractDetails,
        variables: {
          input: {
            id: INTAKE_ID,
            currentStage: 'Just an idea',
            fundingSource: {
              fundingNumber: '',
              isFunded: false,
              source: ''
            },
            costs: {
              expectedIncreaseAmount: '',
              isExpectingIncrease: 'NO'
            },
            contract: {
              contractor: '',
              endDate: null,
              hasContract: 'NOT_NEEDED',
              startDate: null,
              vehicle: ''
            }
          }
        }
      },
      result: {
        data: {
          updateSystemIntakeContractDetails: {
            systemIntake: {
              id: INTAKE_ID,
              currentStage: 'Just an idea',
              fundingSource: {
                fundingNumber: null,
                isFunded: false,
                source: null
              },
              costs: {
                expectedIncreaseAmount: null,
                isExpectingIncrease: 'NO'
              },
              contract: {
                contractor: null,
                endDate: {
                  day: null,
                  month: null,
                  year: null
                },
                hasContract: 'NOT_NEEDED',
                startDate: {
                  day: null,
                  month: null,
                  year: null
                },
                vehicle: null
              }
            }
          }
        }
      }
    };

    render(
      <MemoryRouter initialEntries={[`/system/${INTAKE_ID}/contract-details`]}>
        <MockedProvider
          mocks={[intakeQuery, updateContractDetails]}
          addTypename={false}
        >
          <Route path="/system/:systemId/:formPage">
            <SystemIntake />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    const currentStageDropdown = screen.getByRole('combobox', {
      name: /where are you in the process/i
    });
    userEvent.selectOptions(currentStageDropdown, 'Just an idea');

    const fundingSourceFieldset = screen.getByTestId('funding-source-fieldset');
    const noFunding = within(fundingSourceFieldset).getByRole('radio', {
      name: /no/i
    });
    userEvent.click(noFunding);

    const exceedCostFieldset = screen.getByTestId('exceed-cost-fieldset');
    const noExceedCost = within(exceedCostFieldset).getByRole('radio', {
      name: 'No'
    });
    userEvent.click(noExceedCost);

    const contractFieldset = screen.getByTestId('contract-fieldset');
    const haveNotStarted = within(contractFieldset).getByRole('radio', {
      name: /don't anticipate needing contractor support/i
    });
    userEvent.click(haveNotStarted);

    screen.getByRole('button', { name: /next/i }).click();
    expect(
      await screen.findByRole('heading', {
        name: /check your answers before sending/i
      })
    ).toBeInTheDocument();
  });

  it('displays formik errors', async () => {
    render(
      <MemoryRouter initialEntries={[`/system/${INTAKE_ID}/contract-details`]}>
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
      await screen.findByTestId('contract-details-errors')
    ).toBeInTheDocument();
  });
});
