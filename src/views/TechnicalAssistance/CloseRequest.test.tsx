import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18next from 'i18next';
import configureMockStore from 'redux-mock-store';

import { MessageProvider } from 'hooks/useMessage';
import CloseTrbRequestQuery from 'queries/CloseTrbRequestQuery';
import GetTrbRequestSummaryQuery from 'queries/GetTrbRequestSummaryQuery';
import ReopenTrbRequestQuery from 'queries/ReopenTrbRequestQuery';
import { GetTRBRequestAttendees } from 'queries/TrbAttendeeQueries';

import AdminHome from './AdminHome';
import CloseRequest from './CloseRequest';

describe('Trb Admin: Action: Close & Re-open Request', () => {
  const mockStore = configureMockStore();
  const store = mockStore({
    auth: {
      euaId: 'ABCD',
      name: 'Jerry Seinfeld',
      isUserSet: true,
      groups: ['EASI_TRB_ADMIN_D']
    }
  });
  const id = '449ea115-8bfa-48c3-b1dd-5a613d79fbae';
  const text = 'test message';

  it('closes a request with a reason', async () => {
    const {
      getByText,
      getByLabelText,
      getByRole,
      findByText,
      findByRole
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
                query: CloseTrbRequestQuery,
                variables: {
                  input: {
                    id,
                    reasonClosed: text,
                    notifyEuaIds: ['ABCD'],
                    copyTrbMailbox: false
                  }
                }
              },
              result: {
                data: {
                  closeTRBRequest: {
                    id,
                    __typename: 'TRBRequest'
                  }
                }
              }
            },
            {
              request: {
                query: GetTrbRequestSummaryQuery,
                variables: {
                  id
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
                query: GetTRBRequestAttendees,
                variables: {
                  id
                }
              },
              result: {
                data: {
                  trbRequest: {
                    id,
                    attendees: []
                  }
                }
              }
            }
          ]}
        >
          <MemoryRouter
            initialEntries={[`/trb/${id}/initial-request-form/close-request`]}
          >
            <MessageProvider>
              <Route exact path="/trb/:id/:activePage">
                <AdminHome />
              </Route>
              <Route exact path="/trb/:id/:activePage/:action">
                <CloseRequest />
              </Route>
            </MessageProvider>
          </MemoryRouter>
        </MockedProvider>
      </Provider>
    );

    getByText(
      i18next.t<string>('technicalAssistance:actionCloseRequest.heading')
    );

    userEvent.type(
      getByLabelText(
        RegExp(
          i18next.t<string>('technicalAssistance:actionCloseRequest.label')
        )
      ),
      text
    );

    userEvent.click(
      getByRole('button', {
        name: i18next.t<string>('technicalAssistance:actionCloseRequest.submit')
      })
    );

    // Click through the modal
    userEvent.click(
      await findByRole('button', {
        name: i18next.t<string>(
          'technicalAssistance:actionCloseRequest.confirmModal.close'
        )
      })
    );

    await findByText(
      i18next.t<string>('technicalAssistance:actionCloseRequest.success')
    );
  });

  it('shows an error notice when close submission fails', async () => {
    const { getByLabelText, getByRole, findByText, findByRole } = render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: CloseTrbRequestQuery,
              variables: {
                input: {
                  id,
                  reasonClosed: text,
                  notifyEuaIds: ['ABCD'],
                  copyTrbMailbox: false
                }
              }
            },
            error: new Error()
          }
        ]}
      >
        <MemoryRouter
          initialEntries={[`/trb/${id}/initial-request-form/close-request`]}
        >
          <MessageProvider>
            <Route exact path="/trb/:id/:activePage/:action">
              <CloseRequest />
            </Route>
          </MessageProvider>
        </MemoryRouter>
      </MockedProvider>
    );

    userEvent.type(
      getByLabelText(
        RegExp(
          i18next.t<string>('technicalAssistance:actionCloseRequest.label')
        )
      ),
      text
    );

    userEvent.click(
      getByRole('button', {
        name: i18next.t<string>('technicalAssistance:actionCloseRequest.submit')
      })
    );

    userEvent.click(
      await findByRole('button', {
        name: i18next.t<string>(
          'technicalAssistance:actionCloseRequest.confirmModal.close'
        )
      })
    );

    await findByText(
      i18next.t<string>('technicalAssistance:actionCloseRequest.error')
    );
  });

  it('re-opens a request with a reason', async () => {
    const { getByText, getByLabelText, getByRole, findByText } = render(
      <Provider store={store}>
        <MockedProvider
          defaultOptions={{
            watchQuery: { fetchPolicy: 'no-cache' },
            query: { fetchPolicy: 'no-cache' }
          }}
          mocks={[
            {
              request: {
                query: ReopenTrbRequestQuery,
                variables: {
                  input: {
                    trbRequestId: id,
                    reasonReopened: text,
                    notifyEuaIds: ['ABCD'],
                    copyTrbMailbox: false
                  }
                }
              },
              result: {
                data: {
                  closeTRBRequest: {
                    id,
                    __typename: 'TRBRequest'
                  }
                }
              }
            },
            {
              request: {
                query: GetTrbRequestSummaryQuery,
                variables: {
                  id
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
                query: GetTRBRequestAttendees,
                variables: {
                  id
                }
              },
              result: {
                data: {
                  trbRequest: {
                    id,
                    attendees: []
                  }
                }
              }
            }
          ]}
        >
          <MemoryRouter
            initialEntries={[`/trb/${id}/initial-request-form/reopen-request`]}
          >
            <MessageProvider>
              <Route exact path="/trb/:id/:activePage">
                <AdminHome />
              </Route>
              <Route exact path="/trb/:id/:activePage/:action">
                <CloseRequest />
              </Route>
            </MessageProvider>
          </MemoryRouter>
        </MockedProvider>
      </Provider>
    );

    getByText(
      i18next.t<string>('technicalAssistance:actionReopenRequest.heading')
    );

    userEvent.type(
      getByLabelText(
        RegExp(
          i18next.t<string>('technicalAssistance:actionReopenRequest.label')
        )
      ),
      text
    );

    userEvent.click(
      getByRole('button', {
        name: i18next.t<string>(
          'technicalAssistance:actionReopenRequest.submit'
        )
      })
    );

    await findByText(
      i18next.t<string>('technicalAssistance:actionReopenRequest.success')
    );
  });

  it('shows an error notice when re-open submission fails', async () => {
    const { getByLabelText, getByRole, findByText } = render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: ReopenTrbRequestQuery,
              variables: {
                input: {
                  trbRequestId: id,
                  reasonReopened: text,
                  notifyEuaIds: ['ABCD'],
                  copyTrbMailbox: false
                }
              }
            },
            error: new Error()
          }
        ]}
      >
        <MemoryRouter
          initialEntries={[`/trb/${id}/initial-request-form/reopen-request`]}
        >
          <MessageProvider>
            <Route exact path="/trb/:id/:activePage/:action">
              <CloseRequest />
            </Route>
          </MessageProvider>
        </MemoryRouter>
      </MockedProvider>
    );

    userEvent.type(
      getByLabelText(
        RegExp(
          i18next.t<string>('technicalAssistance:actionReopenRequest.label')
        )
      ),
      text
    );

    userEvent.click(
      getByRole('button', {
        name: i18next.t<string>(
          'technicalAssistance:actionReopenRequest.submit'
        )
      })
    );

    await findByText(
      i18next.t<string>('technicalAssistance:actionReopenRequest.error')
    );
  });
});
