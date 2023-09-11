import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import i18next from 'i18next';
import configureMockStore from 'redux-mock-store';

import { MessageProvider } from 'hooks/useMessage';
import CreateTrbAdminNote from 'queries/CreateTrbAdminNote';
import GetTrbAdminNotesQuery from 'queries/GetTrbAdminNotesQuery';
import { TRBAdminNoteCategory } from 'types/graphql-global-types';

import NotesModal from '.';

describe('Trb Admin Notes: Modal Component', () => {
  Element.prototype.scrollIntoView = vi.fn();

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

  it('renders Notes successfully on modal open', async () => {
    Element.prototype.scrollIntoView = vi.fn();

    // ReactModel is throwing warning - App element is not defined. Please use `Modal.setAppElement(el)`.  The app is being set within the modal but RTL is not picking up on it
    // eslint-disable-next-line
    console.error = vi.fn();

    const { findByText } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/trb/${trbRequestId}/request`]}>
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
              }
            ]}
          >
            <MessageProvider>
              <Route path="/trb/:id/:activePage?">
                <NotesModal
                  isOpen
                  trbRequestId={trbRequestId}
                  openModal={() => null}
                  addNote={false}
                />
              </Route>
            </MessageProvider>
          </MockedProvider>
        </MemoryRouter>
      </Provider>
    );

    // Notes component successfully rendered from modal
    const submissionDate = await findByText('March 28, 2023');
    expect(submissionDate).toBeInTheDocument();
  });

  it('renders AddNote successfully on modal open', async () => {
    Element.prototype.scrollIntoView = vi.fn();

    // ReactModel is throwing warning - App element is not defined. Please use `Modal.setAppElement(el)`.  The app is being set within the modal but RTL is not picking up on it
    // eslint-disable-next-line
    console.error = vi.fn();

    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/trb/${trbRequestId}/request`]}>
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
              }
            ]}
          >
            <MessageProvider>
              <Route path="/trb/:id/:activePage?">
                <NotesModal
                  isOpen
                  trbRequestId={trbRequestId}
                  openModal={() => null}
                  addNote
                />
              </Route>
            </MessageProvider>
          </MockedProvider>
        </MemoryRouter>
      </Provider>
    );

    // AddNote component successfully rendered from modal
    getByText(
      i18next.t<string>('technicalAssistance:notes.addNoteDescription')
    );
  });
});
