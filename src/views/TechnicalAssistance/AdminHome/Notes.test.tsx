import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import i18next from 'i18next';
import configureMockStore from 'redux-mock-store';

import { MessageProvider } from 'hooks/useMessage';
import GetTrbAdminNotesQuery from 'queries/GetTrbAdminNotesQuery';
import GetTrbRequestSummaryQuery from 'queries/GetTrbRequestSummaryQuery';
import { GetTRBRequestAttendees } from 'queries/TrbAttendeeQueries';
import { TRBAdminNoteCategory } from 'types/graphql-global-types';

import Notes from './Notes';
import TRBRequestInfoWrapper from './RequestContext';
import AdminHome from '.';

describe('Trb Admin Notes: View Notes', () => {
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

  it('renders successfully ', async () => {
    const { getByText, asFragment, findByText } = render(
      <Provider store={store}>
        <MockedProvider
          defaultOptions={{
            watchQuery: { fetchPolicy: 'no-cache' },
            query: { fetchPolicy: 'no-cache' }
          }}
          mocks={[
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
                        noteText: 'My cute note',
                        author: {
                          __typename: 'UserInfo',
                          commonName: 'Jerry Seinfeld'
                        },
                        createdAt: '2023-03-28T13:20:37.852099Z',
                        __typename: 'TRBAdminNote'
                      }
                    ]
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
                      { id: '861fa6c5-c9af-4cda-a559-0995b7b76855' }
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
            }
          ]}
        >
          <MemoryRouter initialEntries={[`/trb/${trbRequestId}/notes`]}>
            <TRBRequestInfoWrapper>
              <MessageProvider>
                <Route exact path="/trb/:id/:activePage">
                  <AdminHome />
                </Route>

                <Route exact path="/trb/:id/:activePage">
                  <Notes trbRequestId={trbRequestId} />
                </Route>
              </MessageProvider>
            </TRBRequestInfoWrapper>
          </MemoryRouter>
        </MockedProvider>
      </Provider>
    );

    getByText(i18next.t<string>('technicalAssistance:notes.description'));

    // Note component successfully passed query data and rendered
    const submissionDate = await findByText('March 28, 2023');
    expect(submissionDate).toBeInTheDocument();

    const author = await findByText('Jerry Seinfeld');
    expect(author).toBeInTheDocument();

    const noteText = await findByText('My cute note');
    expect(noteText).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });
});
