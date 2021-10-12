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

import { businessCaseInitialData } from 'data/businessCase';
import { initialSystemIntakeForm } from 'data/systemIntake';
import CreateSystemIntakeActionBusinessCaseNeeded from 'queries/CreateSystemIntakeActionBusinessCaseNeededQuery';
import CreateSystemIntakeActionBusinessCaseNeedsChanges from 'queries/CreateSystemIntakeActionBusinessCaseNeedsChangesQuery';
import CreateSystemIntakeActionGuideReceievedClose from 'queries/CreateSystemIntakeActionGuideReceievedCloseQuery';
import CreateSystemIntakeActionNoGovernanceNeeded from 'queries/CreateSystemIntakeActionNoGovernanceNeededQuery';
import CreateSystemIntakeActionNotItRequest from 'queries/CreateSystemIntakeActionNotItRequestQuery';
import CreateSystemIntakeActionNotRespondingClose from 'queries/CreateSystemIntakeActionNotRespondingCloseQuery';
import CreateSystemIntakeActionReadyForGRT from 'queries/CreateSystemIntakeActionReadyForGRTQuery';
import CreateSystemIntakeActionSendEmail from 'queries/CreateSystemIntakeActionSendEmailQuery';
import GetSystemIntakeQuery from 'queries/GetSystemIntakeQuery';

import RequestOverview from '../RequestOverview';

const waitForPageLoad = async () => {
  await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));
};

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

describe('Submit Action', () => {
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
            teams: []
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

  const renderActionPage = (slug: string, mocks: any[]) => {
    render(
      <MemoryRouter
        initialEntries={[
          `/governance-review-team/a4158ad8-1236-4a55-9ad5-7e15a5d49de2/actions/${slug}`
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Provider store={defaultStore}>
            <Route
              path={[
                '/governance-review-team/:systemId/intake-request',
                `/governance-review-team/:systemId/actions/${slug}`
              ]}
            >
              <RequestOverview />
            </Route>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );
  };

  it('renders formik validation errors', async () => {
    // Random route; doesn't really matter
    renderActionPage('not-it-request', [intakeQuery]);
    await waitForPageLoad();

    screen.getByRole('button', { name: /send email/i }).click();

    expect(
      await screen.findByTestId('formik-validation-errors')
    ).toBeInTheDocument();
  });

  describe('actions', () => {
    it('executes not an IT request mutation', async () => {
      const notITRequestMutation = {
        request: {
          query: CreateSystemIntakeActionNotItRequest,
          variables: {
            input: {
              feedback: 'Test email',
              intakeId: 'a4158ad8-1236-4a55-9ad5-7e15a5d49de2'
            }
          }
        },
        result: {
          data: {
            createSystemIntakeActionNotItRequest: {
              systemIntake: {
                id: 'a4158ad8-1236-4a55-9ad5-7e15a5d49de2',
                status: 'NOT_IT_REQUEST'
              }
            }
          }
        }
      };

      renderActionPage('not-it-request', [intakeQuery, notITRequestMutation]);
      await waitForPageLoad();

      expect(
        screen.getByText(/Not an IT governance request/i)
      ).toBeInTheDocument();

      const emailField = screen.getByRole('textbox', { name: /email/i });
      userEvent.type(emailField, 'Test email');
      expect(emailField).toHaveValue('Test email');

      screen.getByRole('button', { name: /send email/i }).click();

      expect(await screen.findByTestId('intake-review')).toBeInTheDocument();
    });

    it('executes need business case mutation', async () => {
      const needBizCaseMutation = {
        request: {
          query: CreateSystemIntakeActionBusinessCaseNeeded,
          variables: {
            input: {
              feedback: 'Test email',
              intakeId: 'a4158ad8-1236-4a55-9ad5-7e15a5d49de2'
            }
          }
        },
        result: {
          data: {
            createSystemIntakeActionBusinessCaseNeeded: {
              systemIntake: {
                id: 'a4158ad8-1236-4a55-9ad5-7e15a5d49de2',
                status: 'NEED_BIZ_CASE'
              }
            }
          }
        }
      };

      renderActionPage('need-biz-case', [intakeQuery, needBizCaseMutation]);
      await waitForPageLoad();

      expect(
        screen.getByText(/Request a draft business case/i)
      ).toBeInTheDocument();

      const emailField = screen.getByRole('textbox', { name: /email/i });
      userEvent.type(emailField, 'Test email');
      expect(emailField).toHaveValue('Test email');

      screen.getByRole('button', { name: /send email/i }).click();

      expect(await screen.findByTestId('intake-review')).toBeInTheDocument();
    });

    it('executes ready for GRT mutation', async () => {
      const readyForGRTMutation = {
        request: {
          query: CreateSystemIntakeActionReadyForGRT,
          variables: {
            input: {
              feedback: 'Test email',
              intakeId: 'a4158ad8-1236-4a55-9ad5-7e15a5d49de2'
            }
          }
        },
        result: {
          data: {
            createSystemIntakeActionReadyForGRT: {
              systemIntake: {
                id: 'a4158ad8-1236-4a55-9ad5-7e15a5d49de2',
                status: 'READY_FOR_GRT'
              }
            }
          }
        }
      };

      renderActionPage('ready-for-grt', [intakeQuery, readyForGRTMutation]);
      await waitForPageLoad();

      expect(screen.getByText(/Mark as ready for GRT/i)).toBeInTheDocument();

      const emailField = screen.getByRole('textbox', { name: /email/i });
      userEvent.type(emailField, 'Test email');
      expect(emailField).toHaveValue('Test email');

      screen.getByRole('button', { name: /send email/i }).click();

      expect(await screen.findByTestId('intake-review')).toBeInTheDocument();
    });

    it('executes business case needs changes mutation', async () => {
      const needsChangesMutation = {
        request: {
          query: CreateSystemIntakeActionBusinessCaseNeedsChanges,
          variables: {
            input: {
              feedback: 'Test email',
              intakeId: 'a4158ad8-1236-4a55-9ad5-7e15a5d49de2'
            }
          }
        },
        result: {
          data: {
            createSystemIntakeActionBusinessCaseNeedsChanges: {
              systemIntake: {
                id: 'a4158ad8-1236-4a55-9ad5-7e15a5d49de2',
                status: 'BIZ_CASE_CHANGES_NEEDED'
              }
            }
          }
        }
      };

      renderActionPage('biz-case-needs-changes', [
        intakeQuery,
        needsChangesMutation
      ]);
      await waitForPageLoad();

      expect(
        screen.getByText(
          /Business case needs changes and is not ready for GRT/i
        )
      ).toBeInTheDocument();

      const emailField = screen.getByRole('textbox', { name: /email/i });
      userEvent.type(emailField, 'Test email');
      expect(emailField).toHaveValue('Test email');

      screen.getByRole('button', { name: /send email/i }).click();

      expect(await screen.findByTestId('intake-review')).toBeInTheDocument();
    });

    it('executes the no governance needed mutation', async () => {
      const noGovernanceMutation = {
        request: {
          query: CreateSystemIntakeActionNoGovernanceNeeded,
          variables: {
            input: {
              feedback: 'Test email',
              intakeId: 'a4158ad8-1236-4a55-9ad5-7e15a5d49de2'
            }
          }
        },
        result: {
          data: {
            createSystemIntakeActionNoGovernanceNeeded: {
              systemIntake: {
                id: 'a4158ad8-1236-4a55-9ad5-7e15a5d49de2',
                status: 'NO_GOVERNANCE'
              }
            }
          }
        }
      };

      renderActionPage('no-governance', [intakeQuery, noGovernanceMutation]);
      await waitForPageLoad();

      expect(screen.getByText(/Close project/i)).toBeInTheDocument();

      const emailField = screen.getByRole('textbox', { name: /email/i });
      userEvent.type(emailField, 'Test email');
      expect(emailField).toHaveValue('Test email');

      screen.getByRole('button', { name: /send email/i }).click();

      expect(await screen.findByTestId('intake-review')).toBeInTheDocument();
    });

    // TODO: "send email" is a poor name
    it('executes send email mutation (SHUTDOWN)', async () => {
      const sendEmailMutation = {
        request: {
          query: CreateSystemIntakeActionSendEmail,
          variables: {
            input: {
              feedback: 'Test email',
              intakeId: 'a4158ad8-1236-4a55-9ad5-7e15a5d49de2'
            }
          }
        },
        result: {
          data: {
            createSystemIntakeActionSendEmail: {
              systemIntake: {
                id: 'a4158ad8-1236-4a55-9ad5-7e15a5d49de2',
                status: 'SHUTDOWN_IN_PROGRESS'
              }
            }
          }
        }
      };

      renderActionPage('send-email', [intakeQuery, sendEmailMutation]);
      await waitForPageLoad();

      const emailField = screen.getByRole('textbox', { name: /email/i });
      userEvent.type(emailField, 'Test email');
      expect(emailField).toHaveValue('Test email');

      screen.getByRole('button', { name: /send email/i }).click();

      expect(await screen.findByTestId('intake-review')).toBeInTheDocument();
    });

    it('executes guide received close mutation (SHUTDOWN)', async () => {
      const guideReceivedCloseMutation = {
        request: {
          query: CreateSystemIntakeActionGuideReceievedClose,
          variables: {
            input: {
              feedback: 'Test email',
              intakeId: 'a4158ad8-1236-4a55-9ad5-7e15a5d49de2'
            }
          }
        },
        result: {
          data: {
            createSystemIntakeActionGuideReceievedClose: {
              systemIntake: {
                id: 'a4158ad8-1236-4a55-9ad5-7e15a5d49de2',
                status: 'SHUTDOWN_COMPLETE'
              }
            }
          }
        }
      };

      renderActionPage('guide-received-close', [
        intakeQuery,
        guideReceivedCloseMutation
      ]);
      await waitForPageLoad();

      expect(
        screen.getByText(/Decomission guide received/i)
      ).toBeInTheDocument();

      const emailField = screen.getByRole('textbox', { name: /email/i });
      userEvent.type(emailField, 'Test email');
      expect(emailField).toHaveValue('Test email');

      screen.getByRole('button', { name: /send email/i }).click();

      expect(await screen.findByTestId('intake-review')).toBeInTheDocument();
    });

    it('executes the team not responding mutation (SHUTDOWN)', async () => {
      const notRespondingCloseMutation = {
        request: {
          query: CreateSystemIntakeActionNotRespondingClose,
          variables: {
            input: {
              feedback: 'Test email',
              intakeId: 'a4158ad8-1236-4a55-9ad5-7e15a5d49de2'
            }
          }
        },
        result: {
          data: {
            createSystemIntakeActionNotRespondingClose: {
              systemIntake: {
                id: 'a4158ad8-1236-4a55-9ad5-7e15a5d49de2',
                status: 'NO_GOVERNANCE'
              }
            }
          }
        }
      };

      renderActionPage('not-responding-close', [
        intakeQuery,
        notRespondingCloseMutation
      ]);
      await waitForPageLoad();

      expect(
        screen.getByText(/Project team not responding/i)
      ).toBeInTheDocument();

      const emailField = screen.getByRole('textbox', { name: /email/i });
      userEvent.type(emailField, 'Test email');
      expect(emailField).toHaveValue('Test email');

      screen.getByRole('button', { name: /send email/i }).click();

      expect(await screen.findByTestId('intake-review')).toBeInTheDocument();
    });
  });
});
