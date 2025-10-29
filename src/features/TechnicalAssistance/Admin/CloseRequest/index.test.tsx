import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  CloseTRBRequestDocument,
  GetTRBRequestAttendeesDocument,
  GetTRBRequestSummaryDocument,
  PersonRole,
  ReopenTRBRequestDocument
} from 'gql/generated/graphql';
import i18next from 'i18next';

import { MessageProvider } from 'hooks/useMessage';
import easiMockStore from 'utils/testing/easiMockStore';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import TRBRequestInfoWrapper from '../_components/RequestContext';
import AdminHome from '..';

import CloseRequest from '.';

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
      query: GetTRBRequestAttendeesDocument,
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

  let user: ReturnType<typeof userEvent.setup>;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it('closes a request with a reason', async () => {
    const { getByLabelText, findByText, findByRole } = render(
      <Provider store={store}>
        <VerboseMockedProvider
          defaultOptions={{
            watchQuery: { fetchPolicy: 'no-cache' },
            query: { fetchPolicy: 'no-cache' }
          }}
          mocks={[
            {
              request: {
                query: CloseTRBRequestDocument,
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
                query: GetTRBRequestSummaryDocument,
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
        </VerboseMockedProvider>
      </Provider>
    );

    await findByText(
      i18next.t<string>('technicalAssistance:actionCloseRequest.heading')
    );

    const requester = await findByRole('checkbox', {
      name: requesterLabel
    });
    expect(requester).toBeChecked();

    await user.type(
      getByLabelText(
        RegExp(
          i18next.t<string>('technicalAssistance:actionCloseRequest.label')
        )
      ),
      text
    );

    // Click through the modal
    await user.click(
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
    const { getByLabelText, findByText, findByRole } = render(
      <VerboseMockedProvider
        mocks={[
          getAttendeesQuery,
          {
            request: {
              query: CloseTRBRequestDocument,
              variables: {
                input: {
                  id,
                  reasonClosed: text,
                  notifyEuaIds: ['SF13'],
                  copyTrbMailbox: true
                }
              }
            },
            error: new Error('Failed to close request')
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
      </VerboseMockedProvider>
    );

    await findByText(
      i18next.t<string>('technicalAssistance:actionCloseRequest.heading')
    );

    await user.type(
      getByLabelText(
        RegExp(
          i18next.t<string>('technicalAssistance:actionCloseRequest.label')
        )
      ),
      text
    );

    await user.click(
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
        <VerboseMockedProvider
          defaultOptions={{
            watchQuery: { fetchPolicy: 'no-cache' },
            query: { fetchPolicy: 'no-cache' }
          }}
          mocks={[
            {
              request: {
                query: ReopenTRBRequestDocument,
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
                query: GetTRBRequestSummaryDocument,
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
        </VerboseMockedProvider>
      </Provider>
    );

    await findByText(
      i18next.t<string>('technicalAssistance:actionReopenRequest.heading')
    );

    const requester = await findByRole('checkbox', {
      name: requesterLabel
    });
    expect(requester).toBeChecked();

    await user.type(
      getByLabelText(
        RegExp(
          i18next.t<string>('technicalAssistance:actionReopenRequest.label')
        )
      ),
      text
    );

    await user.click(
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
      <VerboseMockedProvider
        mocks={[
          getAttendeesQuery,
          {
            request: {
              query: ReopenTRBRequestDocument,
              variables: {
                input: {
                  trbRequestId: id,
                  reasonReopened: text,
                  notifyEuaIds: ['SF13'],
                  copyTrbMailbox: true
                }
              }
            },
            error: new Error('Failed to reopen request')
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
      </VerboseMockedProvider>
    );

    await findByText(
      i18next.t<string>('technicalAssistance:actionReopenRequest.heading')
    );

    await user.type(
      getByLabelText(
        RegExp(
          i18next.t<string>('technicalAssistance:actionReopenRequest.label')
        )
      ),
      text
    );

    await user.click(
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
