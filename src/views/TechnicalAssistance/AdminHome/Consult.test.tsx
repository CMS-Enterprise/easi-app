import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18next from 'i18next';
import configureMockStore from 'redux-mock-store';

import { MessageProvider } from 'hooks/useMessage';
import GetTrbAdminNotesQuery from 'queries/GetTrbAdminNotesQuery';
import GetTrbRequestSummaryQuery from 'queries/GetTrbRequestSummaryQuery';
import { GetTRBRequestAttendees } from 'queries/TrbAttendeeQueries';
import UpdateTrbRequestConsultMeetingQuery from 'queries/UpdateTrbRequestConsultMeetingQuery';
import { TRBAdminNoteCategory } from 'types/graphql-global-types';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import Consult from './Consult';
import InitialRequestForm from './InitialRequestForm';
import TRBRequestInfoWrapper from './RequestContext';

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
        <VerboseMockedProvider
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
                    id: trbRequestId,
                    name: 'Draft',
                    type: 'NEED_HELP',
                    state: 'OPEN',
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
                    adminNotes: [
                      {
                        id: '123'
                      }
                    ],
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
            },
            {
              request: {
                query: GetTrbAdminNotesQuery,
                variables: {
                  id: trbRequestId
                }
              },
              result: {
                data: {
                  trbRequest: {
                    id: trbRequestId,
                    adminNotes: [
                      {
                        id: '861fa6c5-c9af-4cda-a559-0995b7b76855',
                        isArchived: false,
                        category: TRBAdminNoteCategory.GENERAL_REQUEST,
                        noteText: 'My cute original note',
                        author: {
                          __typename: 'UserInfo',
                          commonName: 'Jerry Seinfeld'
                        },
                        createdAt: '2024-03-28T13:20:37.852099Z',
                        __typename: 'TRBAdminNote'
                      }
                    ]
                  }
                }
              }
            }
          ]}
        >
          <MemoryRouter
            initialEntries={[
              `/trb/${trbRequestId}/initial-request-form/schedule-consult`
            ]}
          >
            <TRBRequestInfoWrapper>
              <MessageProvider>
                <Route exact path="/trb/:id/:activePage">
                  <InitialRequestForm
                    trbRequestId={trbRequestId}
                    noteCount={0}
                  />
                </Route>
                <Route exact path="/trb/:id/:activePage/:action">
                  <Consult />
                </Route>
              </MessageProvider>
            </TRBRequestInfoWrapper>
          </MemoryRouter>
        </VerboseMockedProvider>
      </Provider>
    );

    getByText(
      i18next.t<string>('technicalAssistance:actionScheduleConsult.heading')
    );

    const submitButton = getByRole('button', {
      name: i18next.t<string>('technicalAssistance:actionRequestEdits.submit')
    });

    expect(submitButton).toBeDisabled();

    userEvent.type(
      getByLabelText(
        RegExp(
          i18next.t<string>(
            'technicalAssistance:actionScheduleConsult.labels.meetingDate'
          )
        )
      ),
      '02/23/2023'
    );

    userEvent.type(
      getByLabelText(
        RegExp(
          i18next.t<string>(
            'technicalAssistance:actionScheduleConsult.labels.meetingTime'
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
    //   i18next.t<string>('technicalAssistance:actionScheduleConsult.success', {
    //     date: '02/23/2023',
    //     time: '1:00 pm',
    //     interpolation: {
    //       escapeValue: false
    //     }
    //   })
    // );
  });

  it('shows the error summary on missing required fields', async () => {
    const { getByLabelText, getByRole, findByText } = render(
      <VerboseMockedProvider>
        <MemoryRouter
          initialEntries={[
            `/trb/${trbRequestId}/initial-request-form/schedule-consult`
          ]}
        >
          <TRBRequestInfoWrapper>
            <MessageProvider>
              <Route exact path="/trb/:id/:activePage/:action">
                <Consult />
              </Route>
            </MessageProvider>
          </TRBRequestInfoWrapper>
        </MemoryRouter>
      </VerboseMockedProvider>
    );

    userEvent.type(
      getByLabelText(
        RegExp(
          i18next.t<string>(
            'technicalAssistance:actionScheduleConsult.labels.notes'
          )
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
          'technicalAssistance:actionScheduleConsult.labels.meetingDate'
        )
      )
    });

    getByRole('button', {
      name: RegExp(
        i18next.t<string>(
          'technicalAssistance:actionScheduleConsult.labels.meetingTime'
        )
      )
    });
  });

  it('shows an error notice when submission fails', async () => {
    const { getByLabelText, getByRole, findByText } = render(
      <VerboseMockedProvider
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
          initialEntries={[
            `/trb/${trbRequestId}/initial-request-form/schedule-consult`
          ]}
        >
          <TRBRequestInfoWrapper>
            <MessageProvider>
              <Route exact path="/trb/:id/:activePage/:action">
                <Consult />
              </Route>
            </MessageProvider>
          </TRBRequestInfoWrapper>
        </MemoryRouter>
      </VerboseMockedProvider>
    );

    userEvent.type(
      getByLabelText(
        RegExp(
          i18next.t<string>(
            'technicalAssistance:actionScheduleConsult.labels.meetingDate'
          )
        )
      ),
      '02/23/2023'
    );

    userEvent.type(
      getByLabelText(
        RegExp(
          i18next.t<string>(
            'technicalAssistance:actionScheduleConsult.labels.meetingTime'
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
      i18next.t<string>('technicalAssistance:actionScheduleConsult.error')
    );
  });
});
