import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18next from 'i18next';
import configureMockStore from 'redux-mock-store';

import { trbRequestSummary } from 'data/mock/trbRequest';
import { MessageProvider } from 'hooks/useMessage';
import CreateTrbRequestFeedbackQuery from 'queries/CreateTrbRequestFeedbackQuery';
import GetTrbRequestSummaryQuery from 'queries/GetTrbRequestSummaryQuery';
import { GetTRBRequestAttendeesQuery } from 'queries/TrbAttendeeQueries';
import { PersonRole } from 'types/graphql-global-types';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import TRBRequestInfoWrapper from './RequestContext';
import RequestEdits from './RequestEdits';
import AdminHome from '.';

describe('Trb Admin: Action: Request Edits', () => {
  const mockStore = configureMockStore();
  const store = mockStore({
    auth: {
      euaId: 'SF13',
      name: 'Jerry Seinfeld',
      isUserSet: true,
      groups: ['EASI_TRB_ADMIN_D']
    }
  });
  const trbRequestId = trbRequestSummary.id;
  const feedbackMessage = 'test message';

  const mockCreateTrbRequestFeedback = {
    request: {
      query: CreateTrbRequestFeedbackQuery,
      variables: {
        input: {
          trbRequestId,
          feedbackMessage,
          copyTrbMailbox: true,
          notifyEuaIds: ['SF13'],
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
  };

  const mockGetTrbRequestSummary = {
    request: {
      query: GetTrbRequestSummaryQuery,
      variables: {
        id: trbRequestId
      }
    },
    result: {
      data: {
        trbRequest: trbRequestSummary
      }
    }
  };

  const mockGetTrbRequestAttendeesQuery = {
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
          attendees: [
            {
              __typename: 'TRBRequestAttendee',
              id: '91a14322-34a8-4838-bde3-17b1d483fb63',
              trbRequestId,
              userInfo: {
                __typename: 'UserInfo',
                commonName: 'Jerry Seinfeld',
                email: 'jerry.seinfeld@local.fake',
                euaUserId: 'SF13'
              },
              component: 'Office of Equal Opportunity and Civil Rights',
              role: PersonRole.PRODUCT_OWNER,
              createdAt: '2023-01-05T07:26:16.036618Z'
            }
          ]
        }
      }
    }
  };

  it('submits a feedback message', async () => {
    const {
      getByLabelText,
      getByRole,
      findByText,
      asFragment,
      findByRole
    } = render(
      <Provider store={store}>
        <VerboseMockedProvider
          defaultOptions={{
            watchQuery: { fetchPolicy: 'no-cache' },
            query: { fetchPolicy: 'no-cache' }
          }}
          mocks={[
            mockCreateTrbRequestFeedback,
            mockGetTrbRequestSummary,
            mockGetTrbRequestAttendeesQuery
          ]}
        >
          <MemoryRouter
            initialEntries={[
              `/trb/${trbRequestId}/initial-request-form/request-edits`
            ]}
          >
            <TRBRequestInfoWrapper>
              <MessageProvider>
                <Route exact path="/trb/:id/:activePage">
                  <AdminHome />
                </Route>
                <Route exact path="/trb/:id/:activePage/:action">
                  <RequestEdits />
                </Route>
              </MessageProvider>
            </TRBRequestInfoWrapper>
          </MemoryRouter>
        </VerboseMockedProvider>
      </Provider>
    );

    await findByText(
      i18next.t<string>('technicalAssistance:actionRequestEdits.heading')
    );

    const requester = await findByRole('checkbox', {
      name:
        'Jerry Seinfeld, Office of Equal Opportunity and Civil Rights (Requester)'
    });
    expect(requester).toBeChecked();

    expect(asFragment()).toMatchSnapshot();

    const submitButton = getByRole('button', {
      name: i18next.t<string>('technicalAssistance:actionRequestEdits.submit')
    });

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
      <MockedProvider
        mocks={[
          mockGetTrbRequestAttendeesQuery,
          {
            request: {
              query: CreateTrbRequestFeedbackQuery,
              variables: {
                input: {
                  trbRequestId,
                  feedbackMessage,
                  copyTrbMailbox: false,
                  notifyEuaIds: ['SF13'],
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
          <TRBRequestInfoWrapper>
            <MessageProvider>
              <Route exact path="/trb/:id/:activePage/:action">
                <RequestEdits />
              </Route>
            </MessageProvider>
          </TRBRequestInfoWrapper>
        </MemoryRouter>
      </MockedProvider>
    );

    await findByText(
      i18next.t<string>('technicalAssistance:actionRequestEdits.heading')
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
