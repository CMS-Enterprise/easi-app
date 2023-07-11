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
import { GetTRBRequestAttendeesQuery } from 'queries/TrbAttendeeQueries';
import { TRBAdminNoteCategory } from 'types/graphql-global-types';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import Notes from './Notes';
import TRBRequestInfoWrapper from './RequestContext';

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
    const {
      getByText,
      asFragment,
      findByText,
      findByRole,
      queryByText
    } = render(
      <Provider store={store}>
        <VerboseMockedProvider
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
                        noteText: 'My cute original note',
                        author: {
                          __typename: 'UserInfo',
                          commonName: 'Jerry Seinfeld'
                        },
                        createdAt: '2024-03-28T13:20:37.852099Z',
                        __typename: 'TRBAdminNote'
                      },
                      {
                        id: '123123-c9af-4cda-a559-0995b7b76856',
                        isArchived: false,
                        category: TRBAdminNoteCategory.GENERAL_REQUEST,
                        noteText: 'My cute note2',
                        author: {
                          __typename: 'UserInfo',
                          commonName: 'Jerry Who'
                        },
                        createdAt: '2023-05-29T13:20:37.852099Z',
                        __typename: 'TRBAdminNote'
                      },
                      {
                        id: '345345-c9af-4cda-a559-0995b7b76857',
                        isArchived: false,
                        category: TRBAdminNoteCategory.GENERAL_REQUEST,
                        noteText: 'My cute note3',
                        author: {
                          __typename: 'UserInfo',
                          commonName: 'Jerry Who'
                        },
                        createdAt: '2023-05-29T13:20:37.852099Z',
                        __typename: 'TRBAdminNote'
                      },
                      {
                        id: '353734-c9af-4cda-a559-0995b7b76858',
                        isArchived: false,
                        category: TRBAdminNoteCategory.GENERAL_REQUEST,
                        noteText: 'My cute note4',
                        author: {
                          __typename: 'UserInfo',
                          commonName: 'Jerry Who'
                        },
                        createdAt: '2023-05-29T13:20:37.852099Z',
                        __typename: 'TRBAdminNote'
                      },
                      {
                        id: '567567-c9af-4cda-a559-0995b7b76859',
                        isArchived: false,
                        category: TRBAdminNoteCategory.GENERAL_REQUEST,
                        noteText: 'My cute note5',
                        author: {
                          __typename: 'UserInfo',
                          commonName: 'Jerry Who'
                        },
                        createdAt: '2023-05-29T13:20:37.852099Z',
                        __typename: 'TRBAdminNote'
                      },
                      {
                        id: '6789678-c9af-4cda-a559-0995b7b76850',
                        isArchived: false,
                        category: TRBAdminNoteCategory.GENERAL_REQUEST,
                        noteText: 'My cute note more',
                        author: {
                          __typename: 'UserInfo',
                          commonName: 'Jerry Who'
                        },
                        createdAt: '2021-05-29T13:20:37.852099Z',
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
                    trbLeadInfo: {
                      commonName: 'John Doe'
                    },
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
          <MemoryRouter initialEntries={[`/trb/${trbRequestId}/notes`]}>
            <TRBRequestInfoWrapper>
              <MessageProvider>
                <Route exact path="/trb/:id/:activePage">
                  <Notes trbRequestId={trbRequestId} />
                </Route>
              </MessageProvider>
            </TRBRequestInfoWrapper>
          </MemoryRouter>
        </VerboseMockedProvider>
      </Provider>
    );

    getByText(i18next.t<string>('technicalAssistance:notes.description'));

    // Note component successfully passed query data and rendered
    const submissionDate = await findByText('March 28, 2024');
    expect(submissionDate).toBeInTheDocument();

    const author = await findByText('Jerry Seinfeld');
    expect(author).toBeInTheDocument();

    const noteText = await findByText('My cute original note');
    expect(noteText).toBeInTheDocument();

    const noteTextMore = queryByText('My cute note more');
    expect(noteTextMore).not.toBeInTheDocument();

    const moreNotes = await findByRole('button', {
      name: i18next.t<string>(
        i18next.t<string>('technicalAssistance:notes.viewMore')
      )
    });

    userEvent.click(moreNotes);

    expect(moreNotes).not.toBeInTheDocument();

    const noteTextMore2 = await findByText('My cute note more');
    expect(noteTextMore2).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });
});
