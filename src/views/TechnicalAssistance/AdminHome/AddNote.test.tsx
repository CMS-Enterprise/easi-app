import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18next from 'i18next';
import configureMockStore from 'redux-mock-store';

import { MessageProvider } from 'hooks/useMessage';
import CreateTrbAdminNote from 'queries/CreateTrbAdminNote';
import GetTrbRequestSummaryQuery from 'queries/GetTrbRequestSummaryQuery';
import { GetTRBRequestAttendeesQuery } from 'queries/TrbAttendeeQueries';
import { TRBAdminNoteCategory } from 'types/graphql-global-types';

import AddNote from './AddNote';
import TRBRequestInfoWrapper from './RequestContext';
import AdminHome from '.';

describe('Trb Admin Notes: Add Note', () => {
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
    const { getByText, getByLabelText, getByRole } = render(
      <Provider store={store}>
        <MockedProvider
          defaultOptions={{
            watchQuery: { fetchPolicy: 'no-cache' },
            query: { fetchPolicy: 'no-cache' }
          }}
          mocks={[
            {
              request: {
                query: CreateTrbAdminNote,
                variables: {
                  input: {
                    trbRequestId,
                    category: '' as TRBAdminNoteCategory,
                    noteText: ''
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
                    __typename: 'TRBRequest'
                  }
                }
              }
            },
            {
              request: {
                query: GetTRBRequestAttendeesQuery,
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
            initialEntries={[`/trb/${trbRequestId}/notes/add-note`]}
          >
            <TRBRequestInfoWrapper>
              <MessageProvider>
                <Route exact path="/trb/:id/:activePage">
                  <AdminHome />
                </Route>

                <Route exact path="/trb/:id/notes/add-note">
                  <AddNote />
                </Route>
              </MessageProvider>
            </TRBRequestInfoWrapper>
          </MemoryRouter>
        </MockedProvider>
      </Provider>
    );

    getByText(
      i18next.t<string>('technicalAssistance:notes.addNoteDescription')
    );

    const submitButton = getByRole('button', {
      name: i18next.t<string>('technicalAssistance:notes.saveNote')
    });

    expect(submitButton).toBeDisabled();

    // Select note category
    userEvent.selectOptions(
      getByLabelText(
        RegExp(i18next.t<string>('technicalAssistance:notes.labels.category'))
      ),
      ['Supporting documents']
    );

    // Enter note text
    userEvent.type(
      getByLabelText(
        RegExp(i18next.t<string>('technicalAssistance:notes.labels.noteText'))
      ),
      'My cute note'
    );

    userEvent.click(submitButton);
  });

  it('shows an error notice when submission fails', async () => {
    const { getByLabelText, getByRole, findByText } = render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: CreateTrbAdminNote,
              variables: {
                input: {
                  trbRequestId,
                  category: '' as TRBAdminNoteCategory,
                  noteText: ''
                }
              }
            },
            error: new Error()
          }
        ]}
      >
        <MemoryRouter initialEntries={[`/trb/${trbRequestId}/notes/add-note`]}>
          <TRBRequestInfoWrapper>
            <MessageProvider>
              <Route exact path="/trb/:id/notes/add-note">
                <AddNote />
              </Route>
            </MessageProvider>
          </TRBRequestInfoWrapper>
        </MemoryRouter>
      </MockedProvider>
    );

    // Select note category
    userEvent.selectOptions(
      getByLabelText(
        RegExp(i18next.t<string>('technicalAssistance:notes.labels.category'))
      ),
      ['Supporting documents']
    );

    // Enter note text
    userEvent.type(
      getByLabelText(
        RegExp(i18next.t<string>('technicalAssistance:notes.labels.noteText'))
      ),
      'My cute note'
    );

    userEvent.click(
      getByRole('button', {
        name: i18next.t<string>('technicalAssistance:notes.saveNote')
      })
    );

    await findByText(
      i18next.t<string>('technicalAssistance:notes.status.error')
    );
  });
});
