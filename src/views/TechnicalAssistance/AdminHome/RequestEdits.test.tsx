import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18next from 'i18next';
import configureMockStore from 'redux-mock-store';

import { MessageProvider } from 'hooks/useMessage';
import CreateTrbRequestFeedbackQuery from 'queries/CreateTrbRequestFeedbackQuery';
import GetTrbRequestSummaryQuery from 'queries/GetTrbRequestSummaryQuery';
import { GetTRBRequestAttendees } from 'queries/TrbAttendeeQueries';

import RequestEdits from './RequestEdits';
import AdminHome from '.';

describe('Trb Admin: Action: Request Edits', () => {
  const mockStore = configureMockStore();
  const store = mockStore({
    auth: {
      euaId: 'ABCD',
      name: 'Jerry Seinfeld',
      isUserSet: true,
      groups: ['EASI_TRB_ADMIN_D']
    }
  });
  const trbRequestId = '449ea115-8bfa-48c3-b1dd-5a613d79fbae';
  const feedbackMessage = 'test message';

  it('submits a feedback message', async () => {
    const {
      getByText,
      getByLabelText,
      getByRole,
      findByText,
      asFragment
    } = render(
      <Provider store={store}>
        <MockedProvider
          defaultOptions={{
            watchQuery: { fetchPolicy: 'no-cache' },
            query: { fetchPolicy: 'no-cache' }
          }}
          mocks={[
            {
              request: {
                query: CreateTrbRequestFeedbackQuery,
                variables: {
                  input: {
                    trbRequestId,
                    feedbackMessage,
                    copyTrbMailbox: false,
                    notifyEuaIds: ['ABCD'],
                    action: 'REQUEST_EDITS'
                  }
                }
              },
              result: {
                data: {
                  createTRBRequestFeedback: {
                    id: '94ebed72-8c66-41fd-aaa6-085a715737c2',
                    __typename: 'TRBRequestFeedback'
                  }
                }
              }
            },
            {
              request: {
                query: GetTrbRequestSummaryQuery,
                variables: {
                  id: trbRequestId
                }
              },
              result: {
                data: {
                  trbRequest: {
                    name: 'Draft',
                    type: 'NEED_HELP',
                    status: 'OPEN',
                    trbLead: null,
                    createdAt: '2023-02-16T15:21:34.156885Z',
                    taskStatuses: {
                      formStatus: 'IN_PROGRESS',
                      feedbackStatus: 'EDITS_REQUESTED',
                      consultPrepStatus: 'CANNOT_START_YET',
                      attendConsultStatus: 'CANNOT_START_YET',
                      adviceLetterStatus: 'IN_PROGRESS',
                      __typename: 'TRBTaskStatuses'
                    },
                    __typename: 'TRBRequest'
                  }
                }
              }
            },
            {
              request: {
                query: GetTRBRequestAttendees,
                variables: {
                  id: trbRequestId
                }
              },
              result: {
                data: {
                  trbRequest: {
                    id: trbRequestId,
                    attendees: []
                  }
                }
              }
            }
          ]}
        >
          <MemoryRouter
            initialEntries={[
              `/trb/${trbRequestId}/initial-request-form/request-edits`
            ]}
          >
            <MessageProvider>
              <Route exact path="/trb/:id/:activePage">
                <AdminHome />
              </Route>
              <Route exact path="/trb/:id/:activePage/request-edits">
                <RequestEdits />
              </Route>
            </MessageProvider>
          </MemoryRouter>
        </MockedProvider>
      </Provider>
    );

    getByText(
      i18next.t<string>('technicalAssistance:actionRequestEdits.heading')
    );

    expect(asFragment()).toMatchSnapshot();

    const submitButton = getByRole('button', {
      name: i18next.t<string>('technicalAssistance:actionRequestEdits.submit')
    });

    expect(submitButton).toBeDisabled();

    userEvent.type(
      getByLabelText(
        RegExp(
          i18next.t<string>('technicalAssistance:actionRequestEdits.label')
        )
      ),
      feedbackMessage
    );

    userEvent.click(submitButton);

    await findByText(
      i18next.t<string>('technicalAssistance:actionRequestEdits.success')
    );
  });

  it('shows error notice when submission fails', async () => {
    const { getByLabelText, getByRole, findByText } = render(
      <Provider store={store}>
        <MockedProvider
          mocks={[
            {
              request: {
                query: CreateTrbRequestFeedbackQuery,
                variables: {
                  input: {
                    trbRequestId,
                    feedbackMessage,
                    copyTrbMailbox: false,
                    notifyEuaIds: ['ABCD'],
                    action: 'REQUEST_EDITS'
                  }
                }
              },
              error: new Error()
            }
          ]}
        >
          <MemoryRouter
            initialEntries={[
              `/trb/${trbRequestId}/initial-request-form/request-edits`
            ]}
          >
            <MessageProvider>
              <Route exact path="/trb/:id/:activePage/request-edits">
                <RequestEdits />
              </Route>
            </MessageProvider>
          </MemoryRouter>
        </MockedProvider>
      </Provider>
    );

    userEvent.type(
      getByLabelText(
        RegExp(
          i18next.t<string>('technicalAssistance:actionRequestEdits.label')
        )
      ),
      feedbackMessage
    );

    userEvent.click(
      getByRole('button', {
        name: i18next.t<string>('technicalAssistance:actionRequestEdits.submit')
      })
    );

    await findByText(
      i18next.t<string>('technicalAssistance:actionRequestEdits.error')
    );
  });
});
