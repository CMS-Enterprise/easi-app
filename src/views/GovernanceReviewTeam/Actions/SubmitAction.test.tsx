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
import { GetSystemIntakeContactsQuery } from 'queries/SystemIntakeContactsQueries';

import RequestOverview from '../RequestOverview';

const waitForPageLoad = async () => {
  await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));
};

const systemIntakeId = 'a4158ad8-1236-4a55-9ad5-7e15a5d49de2';

const requester = {
  euaUserId: 'SF13',
  name: 'Jerry Seinfeld',
  component: 'Center for Medicaid and CHIP Services',
  email: 'sf13@local.fake'
};

const businessOwner = {
  systemIntakeId,
  role: 'Business Owner',
  euaUserId: 'SF13',
  commonName: 'Jerry Seinfeld',
  component: 'Center for Medicaid and CHIP Services',
  email: 'sf13@local.fake',
  id: 'b25bd13b-72a0-4d0e-b5be-7852a1a8259d'
};

const productManager = {
  systemIntakeId,
  euaUserId: 'ABCD',
  role: 'Product Manager',
  commonName: 'Jane Doe',
  component: 'Center for Program Integrity',
  email: 'abcd@local.fake',
  id: '25b3c345-8896-4373-91ec-1b0dfbf69673'
};

const isso = {
  systemIntakeId,
  euaUserId: 'WXYZ',
  role: 'ISSO',
  commonName: 'John Smith',
  component: 'CMS Wide',
  email: 'wxyz@local.fake',
  id: '346eefa9-c635-4c0b-bc29-26f272c33d0c'
};

const systemIntake = {
  id: systemIntakeId,
  euaUserId: requester.euaUserId,
  adminLead: '',
  businessNeed: 'Test business need',
  businessSolution: 'Test business solution',
  businessOwner: {
    component: businessOwner.component,
    name: businessOwner.commonName
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
  currentStage: 'I have done some initial research',
  decisionNextSteps: '',
  grbDate: null,
  grtDate: null,
  grtFeedbacks: [],
  governanceTeams: {
    isPresent: true,
    teams: []
  },
  isso: {
    isPresent: true,
    component: isso.component,
    name: isso.commonName
  },
  existingFunding: true,
  fundingSources: [{ fundingNumber: '123456', source: 'Research' }],
  lcid: '',
  lcidExpiresAt: null,
  lcidScope: '',
  lcidCostBaseline: null,
  needsEaSupport: true,
  productManager: {
    component: productManager.component,
    name: productManager.commonName
  },
  rejectionReason: '',
  requester: {
    component: requester.component,
    email: requester.email,
    name: requester.name
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
  lastAdminNote: null,
  grtReviewEmailBody: ''
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
        id: systemIntakeId
      }
    },
    result: {
      data: {
        systemIntake
      }
    }
  };

  const contactsQuery = {
    request: {
      query: GetSystemIntakeContactsQuery,
      variables: {
        id: systemIntakeId
      }
    },
    result: {
      data: {
        systemIntakeContacts: {
          systemIntakeContacts: [businessOwner, productManager, isso]
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
          `/governance-review-team/${systemIntakeId}/actions/${slug}`
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

  test.each([
    { action: 'not-it-request' },
    { action: 'need-biz-case' },
    { action: 'provide-feedback-need-biz-case' },
    { action: 'ready-for-grt' },
    { action: 'ready-for-grb' },
    { action: 'no-governance' },
    { action: 'issue-lcid' },
    { action: 'extend-lcid' }
  ])(
    'renders submit action with and without email notification %j',
    // '$action' title sub did not work
    async ({ action }) => {
      renderActionPage(action, [intakeQuery]);
      await waitForPageLoad();
      expect(
        screen.getByRole('button', { name: /send email/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /without sending an email/i })
      ).toBeInTheDocument();
    }
  );

  describe('actions', () => {
    it('renders additional contacts', async () => {
      const { asFragment } = render(
        <MemoryRouter
          initialEntries={[
            `/governance-review-team/${systemIntakeId}/actions/not-it-request`
          ]}
        >
          <MockedProvider
            mocks={[intakeQuery, contactsQuery]}
            addTypename={false}
          >
            <Provider store={defaultStore}>
              <Route
                path={[
                  '/governance-review-team/:systemId/intake-request',
                  `/governance-review-team/:systemId/actions/not-it-request`
                ]}
              >
                <RequestOverview />
              </Route>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );
      await waitForPageLoad();
      screen.getByTestId('truncatedContentButton').click();
      expect(asFragment()).toMatchSnapshot();
    });

    it('executes not an IT request mutation', async () => {
      const notITRequestMutation = {
        request: {
          query: CreateSystemIntakeActionNotItRequest,
          variables: {
            input: {
              notificationRecipients: {
                regularRecipientEmails: [requester.email],
                shouldNotifyITGovernance: true,
                shouldNotifyITInvestment: true
              },
              feedback: 'Test email',
              intakeId: systemIntakeId,
              shouldSendEmail: true
            }
          }
        },
        result: {
          data: {
            createSystemIntakeActionNotItRequest: {
              systemIntake: {
                id: systemIntakeId,
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

      // Check requester is set as default recipient
      expect(
        screen.getByRole('checkbox', {
          name: `${requester.name}, ${requester.component} (Requester)`
        })
      ).toBeChecked();

      // Check IT Governance is set as default recipient
      expect(
        screen.getByRole('checkbox', { name: 'IT Governance Mailbox' })
      ).toBeChecked();

      // Check IT Investment is set as default recipient
      expect(
        screen.getByRole('checkbox', { name: 'IT Investment Mailbox' })
      ).toBeChecked();

      const emailField = screen.getByRole('textbox', { name: /email/i });
      userEvent.type(emailField, 'Test email');
      expect(emailField).toHaveValue('Test email');

      screen.getByRole('button', { name: /send email/i }).click();

      expect(await screen.findByTestId('intake-review')).toBeInTheDocument();
    });

    it('executes not an IT request mutation without email field', async () => {
      const notITRequestMutation = {
        request: {
          query: CreateSystemIntakeActionNotItRequest,
          variables: {
            input: {
              notificationRecipients: {
                regularRecipientEmails: [requester.email],
                shouldNotifyITGovernance: true,
                shouldNotifyITInvestment: true
              },
              feedback: '',
              intakeId: systemIntakeId,
              shouldSendEmail: false
            }
          }
        },
        result: {
          data: {
            createSystemIntakeActionNotItRequest: {
              systemIntake: {
                status: 'NOT_IT_REQUEST',
                id: systemIntakeId
              }
            }
          }
        }
      };
      renderActionPage('not-it-request', [intakeQuery, notITRequestMutation]);
      await waitForPageLoad();

      screen.getByRole('button', { name: /without sending an email/i }).click();

      expect(await screen.findByTestId('intake-review')).toBeInTheDocument();
    });

    it('executes need business case mutation', async () => {
      const needBizCaseMutation = {
        request: {
          query: CreateSystemIntakeActionBusinessCaseNeeded,
          variables: {
            input: {
              notificationRecipients: {
                regularRecipientEmails: [requester.email],
                shouldNotifyITGovernance: true,
                shouldNotifyITInvestment: false
              },
              feedback: 'Test email',
              intakeId: systemIntakeId,
              shouldSendEmail: true
            }
          }
        },
        result: {
          data: {
            createSystemIntakeActionBusinessCaseNeeded: {
              systemIntake: {
                id: systemIntakeId,
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

      // Check requester is set as default recipient
      expect(
        screen.getByRole('checkbox', {
          name: `${requester.name}, ${requester.component} (Requester)`
        })
      ).toBeChecked();

      // Check IT Governance is set as default recipient
      expect(
        screen.getByRole('checkbox', { name: 'IT Governance Mailbox' })
      ).toBeChecked();

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
              notificationRecipients: {
                regularRecipientEmails: [requester.email],
                shouldNotifyITGovernance: true,
                shouldNotifyITInvestment: false
              },
              feedback: 'Test email',
              intakeId: systemIntakeId,
              shouldSendEmail: true
            }
          }
        },
        result: {
          data: {
            createSystemIntakeActionReadyForGRT: {
              systemIntake: {
                id: systemIntakeId,
                status: 'READY_FOR_GRT'
              }
            }
          }
        }
      };

      renderActionPage('ready-for-grt', [intakeQuery, readyForGRTMutation]);
      await waitForPageLoad();

      expect(screen.getByText(/Mark as ready for GRT/i)).toBeInTheDocument();

      // Check requester is set as default recipient
      expect(
        screen.getByRole('checkbox', {
          name: `${requester.name}, ${requester.component} (Requester)`
        })
      ).toBeChecked();

      // Check IT Governance is set as default recipient
      expect(
        screen.getByRole('checkbox', { name: 'IT Governance Mailbox' })
      ).toBeChecked();

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
              notificationRecipients: {
                regularRecipientEmails: [requester.email],
                shouldNotifyITGovernance: true,
                shouldNotifyITInvestment: false
              },
              feedback: 'Test email',
              intakeId: systemIntakeId,
              shouldSendEmail: true
            }
          }
        },
        result: {
          data: {
            createSystemIntakeActionBusinessCaseNeedsChanges: {
              systemIntake: {
                id: systemIntakeId,
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

      // Check requester is set as default recipient
      expect(
        screen.getByRole('checkbox', {
          name: `${requester.name}, ${requester.component} (Requester)`
        })
      ).toBeChecked();

      // Check IT Governance is set as default recipient
      expect(
        screen.getByRole('checkbox', { name: 'IT Governance Mailbox' })
      ).toBeChecked();

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
              notificationRecipients: {
                regularRecipientEmails: [requester.email],
                shouldNotifyITGovernance: true,
                shouldNotifyITInvestment: true
              },
              feedback: 'Test email',
              intakeId: systemIntakeId,
              shouldSendEmail: true
            }
          }
        },
        result: {
          data: {
            createSystemIntakeActionNoGovernanceNeeded: {
              systemIntake: {
                id: systemIntakeId,
                status: 'NO_GOVERNANCE'
              }
            }
          }
        }
      };

      renderActionPage('no-governance', [intakeQuery, noGovernanceMutation]);
      await waitForPageLoad();

      expect(screen.getByText(/Close project/i)).toBeInTheDocument();

      // Check requester is set as default recipient
      expect(
        screen.getByRole('checkbox', {
          name: `${requester.name}, ${requester.component} (Requester)`
        })
      ).toBeChecked();

      // Check IT Governance is set as default recipient
      expect(
        screen.getByRole('checkbox', { name: 'IT Governance Mailbox' })
      ).toBeChecked();

      // Check IT Investment is set as default recipient
      expect(
        screen.getByRole('checkbox', { name: 'IT Investment Mailbox' })
      ).toBeChecked();

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
              notificationRecipients: {
                regularRecipientEmails: [requester.email],
                shouldNotifyITGovernance: true,
                shouldNotifyITInvestment: false
              },
              feedback: 'Test email',
              intakeId: systemIntakeId,
              shouldSendEmail: true
            }
          }
        },
        result: {
          data: {
            createSystemIntakeActionSendEmail: {
              systemIntake: {
                id: systemIntakeId,
                status: 'SHUTDOWN_IN_PROGRESS'
              }
            }
          }
        }
      };

      renderActionPage('send-email', [intakeQuery, sendEmailMutation]);
      await waitForPageLoad();

      // Check requester is set as default recipient
      expect(
        screen.getByRole('checkbox', {
          name: `${requester.name}, ${requester.component} (Requester)`
        })
      ).toBeChecked();

      // Check IT Governance is set as default recipient
      expect(
        screen.getByRole('checkbox', { name: 'IT Governance Mailbox' })
      ).toBeChecked();

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
              notificationRecipients: {
                regularRecipientEmails: [requester.email],
                shouldNotifyITGovernance: true,
                shouldNotifyITInvestment: false
              },
              feedback: 'Test email',
              intakeId: systemIntakeId,
              shouldSendEmail: true
            }
          }
        },
        result: {
          data: {
            createSystemIntakeActionGuideReceievedClose: {
              systemIntake: {
                id: systemIntakeId,
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

      // Check requester is set as default recipient
      expect(
        screen.getByRole('checkbox', {
          name: `${requester.name}, ${requester.component} (Requester)`
        })
      ).toBeChecked();

      // Check IT Governance is set as default recipient
      expect(
        screen.getByRole('checkbox', { name: 'IT Governance Mailbox' })
      ).toBeChecked();

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
              notificationRecipients: {
                regularRecipientEmails: [requester.email],
                shouldNotifyITGovernance: true,
                shouldNotifyITInvestment: false
              },
              feedback: 'Test email',
              intakeId: systemIntakeId,
              shouldSendEmail: true
            }
          }
        },
        result: {
          data: {
            createSystemIntakeActionNotRespondingClose: {
              systemIntake: {
                id: systemIntakeId,
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

      // Check requester is set as default recipient
      expect(
        screen.getByRole('checkbox', {
          name: `${requester.name}, ${requester.component} (Requester)`
        })
      ).toBeChecked();

      // Check IT Governance is set as default recipient
      expect(
        screen.getByRole('checkbox', { name: 'IT Governance Mailbox' })
      ).toBeChecked();

      const emailField = screen.getByRole('textbox', { name: /email/i });
      userEvent.type(emailField, 'Test email');
      expect(emailField).toHaveValue('Test email');

      screen.getByRole('button', { name: /send email/i }).click();

      expect(await screen.findByTestId('intake-review')).toBeInTheDocument();
    });
  });
});
