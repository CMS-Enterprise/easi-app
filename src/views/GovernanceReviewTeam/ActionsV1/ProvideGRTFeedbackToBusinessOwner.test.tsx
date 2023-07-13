import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import configureMockStore from 'redux-mock-store';

import { businessCaseInitialData } from 'data/businessCase';
import {
  getSystemIntakeContactsQuery,
  requester,
  systemIntake
} from 'data/mock/systemIntake';
import AddGRTFeedbackKeepDraftBizCase from 'queries/AddGRTFeedbackKeepDraftBizCase';
import AddGRTFeedbackProgressToFinal from 'queries/AddGRTFeedbackProgressToFinal';
import AddGRTFeedbackRequestBizCaseQuery from 'queries/AddGRTFeedbackRequestBizCaseQuery';
import GetAdminNotesAndActionsQuery from 'queries/GetAdminNotesAndActionsQuery';
import GetSystemIntakeQuery from 'queries/GetSystemIntakeQuery';
import {
  GetAdminNotesAndActions,
  GetAdminNotesAndActionsVariables
} from 'queries/types/GetAdminNotesAndActions';
import { MockedQuery } from 'types/util';
import Notes from 'views/GovernanceReviewTeam/Notes';

import RequestOverview from '../RequestOverview';

const waitForPageLoad = async () => {
  await waitFor(() => {
    expect(screen.getByTestId('provide-feedback-biz-case')).toBeInTheDocument();
  });
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

describe('Provide GRT Feedback to GRT Business Owner', () => {
  const intakeQuery = {
    request: {
      query: GetSystemIntakeQuery,
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

  const noteActionQuery: MockedQuery<
    GetAdminNotesAndActions,
    GetAdminNotesAndActionsVariables
  > = {
    request: {
      query: GetAdminNotesAndActionsQuery,
      variables: {
        id: systemIntake.id
      }
    },
    result: {
      data: {
        systemIntake: {
          __typename: 'SystemIntake',
          id: systemIntake.id,
          lcid: null,
          notes: [],
          actions: []
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

  const emailButtonMatch = /send email/i;

  describe('actions', () => {
    it('displays formik validation errors', async () => {
      renderActionPage('provide-feedback-need-biz-case', [intakeQuery]);
      await waitForPageLoad();

      screen.getByRole('button', { name: emailButtonMatch }).click();

      expect(
        await screen.findByTestId('formik-validation-errors')
      ).toBeInTheDocument();

      screen.getByRole('button', { name: /without sending an email/i }).click();

      expect(
        await screen.findByTestId('formik-validation-errors')
      ).toBeInTheDocument();
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
              <Route path="/governance-review-team/:systemId/notes">
                <Notes />
              </Route>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );
    };

    it('executes provide feedback, need business case mutation', async () => {
      const provideFeedbackNeedBizCaseMutation = {
        request: {
          query: AddGRTFeedbackRequestBizCaseQuery,
          variables: {
            input: {
              notificationRecipients: {
                regularRecipientEmails: [requester.email],
                shouldNotifyITGovernance: true,
                shouldNotifyITInvestment: false
              },
              emailBody: 'Test email',
              feedback: 'Test feedback',
              intakeID: systemIntake.id
            }
          }
        },
        result: {
          data: {
            addGRTFeedbackAndRequestBusinessCase: {
              id: systemIntake.id
            }
          }
        }
      };
      renderActionPage('provide-feedback-need-biz-case', [
        intakeQuery,
        getSystemIntakeContactsQuery,
        provideFeedbackNeedBizCaseMutation,
        noteActionQuery
      ]);
      await waitForPageLoad();

      expect(
        screen.getByText(/Provide GRT Feedback and progress to business case/i)
      ).toBeInTheDocument();

      const feedbackField = screen.getByRole('textbox', { name: /feedback/i });
      userEvent.type(feedbackField, 'Test feedback');
      expect(feedbackField).toHaveValue('Test feedback');

      const emailField = screen.getByRole('textbox', { name: /email/i });
      userEvent.type(emailField, 'Test email');
      expect(emailField).toHaveValue('Test email');

      screen.getByRole('button', { name: emailButtonMatch }).click();

      expect(await screen.findByTestId('grt-notes-view')).toBeInTheDocument();
    });

    it('executes provide feedback, keep business case in draft mutation', async () => {
      const provideFeedbackKeepDraftBizCaseMutation = {
        request: {
          query: AddGRTFeedbackKeepDraftBizCase,
          variables: {
            input: {
              notificationRecipients: {
                regularRecipientEmails: [requester.email],
                shouldNotifyITGovernance: true,
                shouldNotifyITInvestment: false
              },
              emailBody: 'Test email',
              feedback: 'Test feedback',
              intakeID: systemIntake.id
            }
          }
        },
        result: {
          data: {
            addGRTFeedbackAndKeepBusinessCaseInDraft: {
              id: systemIntake.id
            }
          }
        }
      };

      renderActionPage('provide-feedback-keep-draft', [
        intakeQuery,
        getSystemIntakeContactsQuery,
        provideFeedbackKeepDraftBizCaseMutation,
        noteActionQuery
      ]);
      await waitForPageLoad();

      expect(
        screen.getByText(
          /Provide GRT feedback and keep working on draft business case/i
        )
      ).toBeInTheDocument();

      const feedbackField = screen.getByRole('textbox', { name: /feedback/i });
      userEvent.type(feedbackField, 'Test feedback');
      expect(feedbackField).toHaveValue('Test feedback');

      const emailField = screen.getByRole('textbox', { name: /email/i });
      userEvent.type(emailField, 'Test email');
      expect(emailField).toHaveValue('Test email');

      screen.getByRole('button', { name: emailButtonMatch }).click();

      expect(await screen.findByTestId('grt-notes-view')).toBeInTheDocument();
    });

    it('executes provide feedback, progress to final business case mutation', async () => {
      const provideFeedbackProgressToFinalBizCaseMutation = {
        request: {
          query: AddGRTFeedbackProgressToFinal,
          variables: {
            input: {
              notificationRecipients: {
                regularRecipientEmails: [requester.email],
                shouldNotifyITGovernance: true,
                shouldNotifyITInvestment: false
              },
              emailBody: 'Test email',
              feedback: 'Test feedback',
              intakeID: systemIntake.id
            }
          }
        },
        result: {
          data: {
            addGRTFeedbackAndProgressToFinalBusinessCase: {
              id: systemIntake.id
            }
          }
        }
      };

      renderActionPage('provide-feedback-need-final', [
        intakeQuery,
        getSystemIntakeContactsQuery,
        provideFeedbackProgressToFinalBizCaseMutation,
        noteActionQuery
      ]);
      await waitForPageLoad();

      expect(
        screen.getByText(
          /Provide GRT feedback and request final business case for GRB/i
        )
      ).toBeInTheDocument();

      const feedbackField = screen.getByRole('textbox', { name: /feedback/i });
      userEvent.type(feedbackField, 'Test feedback');
      expect(feedbackField).toHaveValue('Test feedback');

      const emailField = screen.getByRole('textbox', { name: /email/i });
      userEvent.type(emailField, 'Test email');
      expect(emailField).toHaveValue('Test email');

      screen.getByRole('button', { name: emailButtonMatch }).click();

      expect(await screen.findByTestId('grt-notes-view')).toBeInTheDocument();
    });
  });
});
