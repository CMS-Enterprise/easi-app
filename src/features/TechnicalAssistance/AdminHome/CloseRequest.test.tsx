import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CloseTrbRequestQuery from 'gql/legacyGQL/CloseTrbRequestQuery';
import GetTrbRequestSummaryQuery from 'gql/legacyGQL/GetTrbRequestSummaryQuery';
import ReopenTrbRequestQuery from 'gql/legacyGQL/ReopenTrbRequestQuery';
import { GetTRBRequestAttendeesQuery } from 'gql/legacyGQL/TrbAttendeeQueries';
import i18next from 'i18next';

import { MessageProvider } from 'hooks/useMessage';
import { PersonRole } from 'types/graphql-global-types';
import easiMockStore from 'utils/testing/easiMockStore';

import CloseRequest from './CloseRequest';
import TRBRequestInfoWrapper from './RequestContext';
import AdminHome from '.';

const userInfo = {
  __typename: 'UserInfo',
  commonName: 'Jerry Seinfeld',
  email: 'jerry.seinfeld@local.fake',
  euaUserId: 'SF13'
};

const requesterLabel = `${userInfo.commonName}, OEOCR (Requester) ${userInfo.email}`;

describe('Trb Admin: Action: Close & Re-open Request', () => {
  const store = easiMockStore({
    euaUserId: 'SF13',
    groups: ['EASI_TRB_ADMIN_D']
  });

  const id = '449ea115-8bfa-48c3-b1dd-5a613d79fbae';
  const text = 'test message';

  const getAttendeesQuery = {
    request: {
      query: GetTRBRequestAttendeesQuery,
      variables: {
        id
      }
    },
    result: {
      data: {
        trbRequest: {
          id,
          attendees: [
            {
              __typename: 'TRBRequestAttendee',
              id: '91a14322-34a8-4838-bde3-17b1d483fb63',
              trbRequestId: id,
              userInfo,
              component: 'Office of Equal Opportunity and Civil Rights',
              role: PersonRole.PRODUCT_OWNER,
              createdAt: '2023-01-05T07:26:16.036618Z'
            }
          ]
        }
      }
    }
  };

  it('closes a request with a reason', async () => {
    const { getByLabelText, getByRole, findByText, findByRole } = render(
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
                    notifyEuaIds: ['SF13'],
                    copyTrbMailbox: true
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
                    id,
                    name: 'Draft',
                    type: 'NEED_HELP',
                    state: 'OPEN',
                    trbLeadInfo: {
                      __typename: 'UserInfo',
                      commonName: ''
                    },
                    createdAt: '2023-02-16T15:21:34.156885Z',
                    taskStatuses: {
                      formStatus: 'IN_PROGRESS',
                      feedbackStatus: 'EDITS_REQUESTED',
                      consultPrepStatus: 'CANNOT_START_YET',
                      attendConsultStatus: 'CANNOT_START_YET',
                      guidanceLetterStatus: 'IN_PROGRESS',
                      __typename: 'TRBTaskStatuses'
                    },
                    adminNotes: [
                      {
                        id: '123'
                      }
                    ],
                    contractNumbers: [
                      {
                        id: 'd547c413-00d7-4bd4-a43e-5a2c45fbb98d',
                        contractNumber: '00004',
                        __typename: 'TRBRequestContractNumber'
                      },
                      {
                        id: '74c53a09-506d-4be4-a781-c999c1a52c5c',
                        contractNumber: '00005',
                        __typename: 'TRBRequestContractNumber'
                      }
                    ],
                    __typename: 'TRBRequest'
                  }
                }
              }
            },
            getAttendeesQuery
          ]}
        >
          <MemoryRouter
            initialEntries={[`/trb/${id}/initial-request-form/close-request`]}
          >
            <MessageProvider>
              <TRBRequestInfoWrapper>
                <Route exact path="/trb/:id/:activePage">
                  <AdminHome />
                </Route>
                <Route exact path="/trb/:id/:activePage/:action">
                  <CloseRequest />
                </Route>
              </TRBRequestInfoWrapper>
            </MessageProvider>
          </MemoryRouter>
        </MockedProvider>
      </Provider>
    );

    await findByText(
      i18next.t<string>('technicalAssistance:actionCloseRequest.heading')
    );

    const requester = await findByRole('checkbox', {
      name: requesterLabel
    });
    expect(requester).toBeChecked();

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
          getAttendeesQuery,
          {
            request: {
              query: CloseTrbRequestQuery,
              variables: {
                input: {
                  id,
                  reasonClosed: text,
                  notifyEuaIds: ['SF13'],
                  copyTrbMailbox: true
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

    await findByText(
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
    const { getByLabelText, getByRole, findByText, findByRole } = render(
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
                    notifyEuaIds: ['SF13'],
                    copyTrbMailbox: true
                  }
                }
              },
              result: {
                data: {
                  reopenTrbRequest: {
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
                    id,
                    name: 'Draft',
                    type: 'NEED_HELP',
                    state: 'OPEN',
                    trbLeadInfo: {
                      __typename: 'UserInfo',
                      commonName: ''
                    },
                    createdAt: '2023-02-16T15:21:34.156885Z',
                    taskStatuses: {
                      formStatus: 'IN_PROGRESS',
                      feedbackStatus: 'EDITS_REQUESTED',
                      consultPrepStatus: 'CANNOT_START_YET',
                      attendConsultStatus: 'CANNOT_START_YET',
                      guidanceLetterStatus: 'IN_PROGRESS',
                      __typename: 'TRBTaskStatuses'
                    },
                    adminNotes: [
                      {
                        id: '123'
                      }
                    ],
                    contractNumbers: [
                      {
                        id: 'd547c413-00d7-4bd4-a43e-5a2c45fbb98d',
                        contractNumber: '00004',
                        __typename: 'TRBRequestContractNumber'
                      },
                      {
                        id: '74c53a09-506d-4be4-a781-c999c1a52c5c',
                        contractNumber: '00005',
                        __typename: 'TRBRequestContractNumber'
                      }
                    ],
                    __typename: 'TRBRequest'
                  }
                }
              }
            },
            getAttendeesQuery
          ]}
        >
          <MemoryRouter
            initialEntries={[`/trb/${id}/initial-request-form/reopen-request`]}
          >
            <MessageProvider>
              <TRBRequestInfoWrapper>
                <Route exact path="/trb/:id/:activePage">
                  <AdminHome />
                </Route>
                <Route exact path="/trb/:id/:activePage/:action">
                  <CloseRequest />
                </Route>
              </TRBRequestInfoWrapper>
            </MessageProvider>
          </MemoryRouter>
        </MockedProvider>
      </Provider>
    );

    await findByText(
      i18next.t<string>('technicalAssistance:actionReopenRequest.heading')
    );

    const requester = await findByRole('checkbox', {
      name: requesterLabel
    });
    expect(requester).toBeChecked();

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
          getAttendeesQuery,
          {
            request: {
              query: ReopenTrbRequestQuery,
              variables: {
                input: {
                  trbRequestId: id,
                  reasonReopened: text,
                  notifyEuaIds: ['SF13'],
                  copyTrbMailbox: true
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
            <TRBRequestInfoWrapper>
              <Route exact path="/trb/:id/:activePage/:action">
                <CloseRequest />
              </Route>
            </TRBRequestInfoWrapper>
          </MessageProvider>
        </MemoryRouter>
      </MockedProvider>
    );

    await findByText(
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
      i18next.t<string>('technicalAssistance:actionReopenRequest.error')
    );
  });
});
