import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18next from 'i18next';
import configureMockStore from 'redux-mock-store';

import { MessageProvider } from 'hooks/useMessage';
import GetTrbRequestSummaryQuery from 'queries/GetTrbRequestSummaryQuery';
import { GetTRBRequestAttendees } from 'queries/TrbAttendeeQueries';
import UpdateTrbRequestConsultMeetingQuery from 'queries/UpdateTrbRequestConsultMeetingQuery';

import Consult from './Consult';
import AdminHome from '.';

describe('Trb Admin: Action: Schedule a TRB consult session', () => {
  Element.prototype.scrollIntoView = jest.fn();

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

  it('submits successfully ', async () => {
    const { getByText, getByLabelText, getByRole, findByRole } = render(
      <Provider store={store}>
        <MockedProvider
          defaultOptions={{
            watchQuery: { fetchPolicy: 'no-cache' },
            query: { fetchPolicy: 'no-cache' }
          }}
          mocks={[
            {
              request: {
                query: UpdateTrbRequestConsultMeetingQuery,
                variables: {
                  input: {
                    trbRequestId,
                    consultMeetingTime: '2023-02-23T13:00:00.000Z',
                    notes: '',
                    copyTrbMailbox: false,
                    notifyEuaIds: ['ABCD']
                  }
                }
              },
              result: {
                data: {
                  updateTRBRequestConsultMeetingTime: {
                    id: 'd35a1f08-e04e-48f9-8d58-7f2409bae8fe',
                    __typename: 'TRBRequest'
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
              `/trb/${trbRequestId}/initial-request-form/consult`
            ]}
          >
            <MessageProvider>
              <Route exact path="/trb/:id/:activePage">
                <AdminHome />
              </Route>
              <Route exact path="/trb/:id/:activePage/:action">
                <Consult />
              </Route>
            </MessageProvider>
          </MemoryRouter>
        </MockedProvider>
      </Provider>
    );

    getByText(i18next.t<string>('technicalAssistance:actionConsult.heading'));

    const submitButton = getByRole('button', {
      name: i18next.t<string>('technicalAssistance:actionRequestEdits.submit')
    });

    expect(submitButton).toBeDisabled();

    userEvent.type(
      getByLabelText(
        RegExp(
          i18next.t<string>(
            'technicalAssistance:actionConsult.labels.meetingDate'
          )
        )
      ),
      '02/23/2023'
    );

    userEvent.type(
      getByLabelText(
        RegExp(
          i18next.t<string>(
            'technicalAssistance:actionConsult.labels.meetingTime'
          )
        )
      ),
      '1:00pm{enter}'
    );

    userEvent.click(submitButton);

    // This test will check that the meetingDate and meetingTime field inputs
    // are properly parsed to utc iso for the query
    // Note: the jest timezone is set to utc in `jest-global-setup.js`

    await findByRole('heading', { name: /Initial request form/ });

    // await findByText(
    //   i18next.t<string>('technicalAssistance:actionRequestEdits.success')
    // );
  });

  it('shows the error summary on missing required fields', async () => {
    const { getByLabelText, getByRole, findByText } = render(
      <MockedProvider>
        <MemoryRouter
          initialEntries={[`/trb/${trbRequestId}/initial-request-form/consult`]}
        >
          <MessageProvider>
            <Route exact path="/trb/:id/:activePage/:action">
              <Consult />
            </Route>
          </MessageProvider>
        </MemoryRouter>
      </MockedProvider>
    );

    userEvent.type(
      getByLabelText(
        RegExp(
          i18next.t<string>('technicalAssistance:actionConsult.labels.notes')
        )
      ),
      'note'
    );

    // Submit the required date and time missing

    userEvent.click(
      getByRole('button', {
        name: i18next.t<string>('technicalAssistance:actionRequestEdits.submit')
      })
    );

    await findByText(i18next.t<string>('technicalAssistance:errors.checkFix'));

    // Check that error alert buttons appear for the missing fields

    getByRole('button', {
      name: RegExp(
        i18next.t<string>(
          'technicalAssistance:actionConsult.labels.meetingDate'
        )
      )
    });

    getByRole('button', {
      name: RegExp(
        i18next.t<string>(
          'technicalAssistance:actionConsult.labels.meetingTime'
        )
      )
    });
  });

  it('shows an error notice when submission fails', async () => {
    const { getByLabelText, getByRole, findByText } = render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: UpdateTrbRequestConsultMeetingQuery,
              variables: {
                input: {
                  trbRequestId,
                  consultMeetingTime: '2023-02-23T18:00:00.000Z',
                  notes: '',
                  copyTrbMailbox: false,
                  notifyEuaIds: ['ABCD']
                }
              }
            },
            error: new Error()
          }
        ]}
      >
        <MemoryRouter
          initialEntries={[`/trb/${trbRequestId}/initial-request-form/consult`]}
        >
          <MessageProvider>
            <Route exact path="/trb/:id/:activePage/:action">
              <Consult />
            </Route>
          </MessageProvider>
        </MemoryRouter>
      </MockedProvider>
    );

    userEvent.type(
      getByLabelText(
        RegExp(
          i18next.t<string>(
            'technicalAssistance:actionConsult.labels.meetingDate'
          )
        )
      ),
      '02/23/2023'
    );

    userEvent.type(
      getByLabelText(
        RegExp(
          i18next.t<string>(
            'technicalAssistance:actionConsult.labels.meetingTime'
          )
        )
      ),
      '1:00pm{enter}'
    );

    userEvent.click(
      getByRole('button', {
        name: i18next.t<string>('technicalAssistance:actionRequestEdits.submit')
      })
    );

    await findByText(
      i18next.t<string>('technicalAssistance:actionConsult.error')
    );
  });
});
