import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import configureMockStore from 'redux-mock-store';

import { businessCaseInitialData } from 'data/businessCase';
import { grtActions } from 'data/mock/grtActions';
import {
  getSystemIntakeContactsQuery,
  getSystemIntakeQuery,
  productManager,
  requester,
  systemIntake
} from 'data/mock/systemIntake';
import { initialSystemIntakeForm } from 'data/systemIntake';
import { MessageProvider } from 'hooks/useMessage';
import CreateSystemIntakeActionBusinessCaseNeeded from 'queries/CreateSystemIntakeActionBusinessCaseNeededQuery';
import CreateSystemIntakeActionBusinessCaseNeedsChanges from 'queries/CreateSystemIntakeActionBusinessCaseNeedsChangesQuery';
import CreateSystemIntakeActionGuideReceievedClose from 'queries/CreateSystemIntakeActionGuideReceievedCloseQuery';
import CreateSystemIntakeActionNoGovernanceNeeded from 'queries/CreateSystemIntakeActionNoGovernanceNeededQuery';
import CreateSystemIntakeActionNotItRequest from 'queries/CreateSystemIntakeActionNotItRequestQuery';
import CreateSystemIntakeActionNotRespondingClose from 'queries/CreateSystemIntakeActionNotRespondingCloseQuery';
import CreateSystemIntakeActionReadyForGRT from 'queries/CreateSystemIntakeActionReadyForGRTQuery';
import CreateSystemIntakeActionSendEmail from 'queries/CreateSystemIntakeActionSendEmailQuery';
import GetCedarContactsQuery from 'queries/GetCedarContactsQuery';
import {
  GetCedarContacts,
  GetCedarContactsVariables
} from 'queries/types/GetCedarContacts';
import { MockedQuery } from 'types/util';

import RequestOverview from '../RequestOverview';

const waitForPageLoad = async (testId: string = 'grt-submit-action-view') => {
  await waitFor(() => {
    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });
};

// Mock system intake and contacts data
const systemIntakeId = systemIntake.id;

const getCedarContactsQuery: MockedQuery<
  GetCedarContacts,
  GetCedarContactsVariables
> = {
  request: {
    query: GetCedarContactsQuery,
    variables: {
      commonName: productManager.commonName!
    }
  },
  result: {
    data: {
      cedarPersonsByCommonName: [
        {
          __typename: 'UserInfo',
          commonName: productManager.commonName!,
          euaUserId: productManager.euaUserId,
          email: productManager.email!
        }
      ]
    }
  }
};

// Mock contact queries

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

window.scrollTo = vi.fn;

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
  return render(
    <MemoryRouter
      initialEntries={[
        `/governance-review-team/${systemIntakeId}/actions/${slug}`
      ]}
    >
      <MockedProvider mocks={mocks} addTypename={false}>
        <Provider store={defaultStore}>
          <MessageProvider>
            <Route
              path={[
                '/governance-review-team/:systemId/intake-request',
                `/governance-review-team/:systemId/actions/${slug}`
              ]}
            >
              <RequestOverview />
            </Route>
          </MessageProvider>
        </Provider>
      </MockedProvider>
    </MemoryRouter>
  );
};

describe('Renders action pages', () => {
  const actionsList = [
    'not-it-request',
    'need-biz-case',
    'provide-feedback-need-biz-case',
    'ready-for-grt',
    'ready-for-grb',
    'no-governance',
    'issue-lcid'
  ];

  test.each(actionsList)('%j', async action => {
    renderActionPage(action, [getSystemIntakeQuery]);
    await waitForPageLoad(grtActions[action as keyof typeof grtActions].view);
    expect(
      screen.getByRole('button', { name: /send email/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /without sending an email/i })
    ).toBeInTheDocument();
  });
});

describe('Submit Action', () => {
  it('renders formik validation errors', async () => {
    // Random route; doesn't really matter
    renderActionPage('not-it-request', [getSystemIntakeQuery]);
    await waitForPageLoad();

    screen.getByRole('button', { name: /send email/i }).click();

    expect(
      await screen.findByTestId('formik-validation-errors')
    ).toBeInTheDocument();
  });

  it('renders additional contacts', async () => {
    const {
      asFragment,
      getByTestId,
      findByText,
      getByRole
    } = renderActionPage('not-it-request', [
      getSystemIntakeQuery,
      getCedarContactsQuery,
      getSystemIntakeContactsQuery
    ]);

    await waitForPageLoad();
    getByTestId('truncatedContentButton').click();

    // Unverified recipients alert
    expect(getByTestId('alert_unverified-recipients')).toBeInTheDocument();

    // Click verify recipient button
    getByTestId('button_verify-recipient').click();

    // Verify recipient form snapshot
    expect(asFragment()).toMatchSnapshot();

    // Select field value should be unverified contact name
    const contactSelect = getByTestId('cedar-contact-select');
    expect(contactSelect).toHaveValue(productManager.commonName);

    const contactLabel = `${productManager.commonName}, ${productManager.euaUserId}`;

    // Check that select field loads mock CEDAR contact
    userEvent.click(contactSelect);
    const contactOption = await findByText(contactLabel);

    // Select recipient
    userEvent.click(contactOption);
    expect(contactSelect).toHaveValue(contactLabel);

    // Verify recipient
    const saveButton = getByRole('button', { name: 'Save' });
    userEvent.click(saveButton);

    // Confirm that recipient has been verified
    const verifiedContact = await findByText(
      `${productManager.commonName}, ${productManager.component} (${productManager.role})`
    );
    expect(verifiedContact).toBeInTheDocument();
  });

  describe('Action mutations', () => {
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
              intakeId: systemIntakeId
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

      renderActionPage('not-it-request', [
        getSystemIntakeQuery,
        getSystemIntakeContactsQuery,
        notITRequestMutation
      ]);
      await waitForPageLoad();

      expect(
        screen.getByText(/Not an IT governance request/i)
      ).toBeInTheDocument();

      // Check requester is set as default recipient
      expect(
        screen.getByRole('checkbox', {
          name: `${requester.commonName}, ${requester.component} (Requester)`
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
              feedback: '',
              intakeId: systemIntakeId
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
      renderActionPage('not-it-request', [
        getSystemIntakeQuery,
        notITRequestMutation
      ]);
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
              intakeId: systemIntakeId
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

      renderActionPage('need-biz-case', [
        getSystemIntakeQuery,
        getSystemIntakeContactsQuery,
        needBizCaseMutation
      ]);
      await waitForPageLoad();

      expect(
        screen.getByText(/Request a draft business case/i)
      ).toBeInTheDocument();

      // Check requester is set as default recipient
      expect(
        screen.getByRole('checkbox', {
          name: `${requester.commonName}, ${requester.component} (Requester)`
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
              intakeId: systemIntakeId
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

      renderActionPage('ready-for-grt', [
        getSystemIntakeQuery,
        getSystemIntakeContactsQuery,
        readyForGRTMutation
      ]);
      await waitForPageLoad();

      expect(screen.getByText(/Mark as ready for GRT/i)).toBeInTheDocument();

      // Check requester is set as default recipient
      expect(
        screen.getByRole('checkbox', {
          name: `${requester.commonName}, ${requester.component} (Requester)`
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
              intakeId: systemIntakeId
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
        getSystemIntakeQuery,
        getSystemIntakeContactsQuery,
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
          name: `${requester.commonName}, ${requester.component} (Requester)`
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
              intakeId: systemIntakeId
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

      renderActionPage('no-governance', [
        getSystemIntakeQuery,
        getSystemIntakeContactsQuery,
        noGovernanceMutation
      ]);
      await waitForPageLoad();

      expect(screen.getByText(/Close project/i)).toBeInTheDocument();

      // Check requester is set as default recipient
      expect(
        screen.getByRole('checkbox', {
          name: `${requester.commonName}, ${requester.component} (Requester)`
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
              intakeId: systemIntakeId
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

      renderActionPage('send-email', [
        getSystemIntakeQuery,
        getSystemIntakeContactsQuery,
        sendEmailMutation
      ]);
      await waitForPageLoad();

      // Check requester is set as default recipient
      expect(
        screen.getByRole('checkbox', {
          name: `${requester.commonName}, ${requester.component} (Requester)`
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
              intakeId: systemIntakeId
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
        getSystemIntakeQuery,
        getSystemIntakeContactsQuery,
        guideReceivedCloseMutation
      ]);
      await waitForPageLoad();

      expect(
        screen.getByText(/Decomission guide received/i)
      ).toBeInTheDocument();

      // Check requester is set as default recipient
      expect(
        screen.getByRole('checkbox', {
          name: `${requester.commonName}, ${requester.component} (Requester)`
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
              intakeId: systemIntakeId
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
        getSystemIntakeQuery,
        getSystemIntakeContactsQuery,
        notRespondingCloseMutation
      ]);
      await waitForPageLoad();

      expect(
        screen.getByText(/Project team not responding/i)
      ).toBeInTheDocument();

      // Check requester is set as default recipient
      expect(
        screen.getByRole('checkbox', {
          name: `${requester.commonName}, ${requester.component} (Requester)`
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
