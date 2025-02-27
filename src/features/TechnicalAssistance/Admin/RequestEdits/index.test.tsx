import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GetTRBRequestSummaryQuery } from 'gql/generated/graphql';
import CreateTrbRequestFeedbackQuery from 'gql/legacyGQL/CreateTrbRequestFeedbackQuery';
import {
  CreateTrbRequestFeedback,
  CreateTrbRequestFeedbackVariables
} from 'gql/legacyGQL/types/CreateTrbRequestFeedback';
import i18next from 'i18next';
import {
  getTrbLeadOptionsQuery,
  getTRBRequestAttendeesQuery,
  getTrbRequestQuery,
  getTrbRequestSummary,
  getTrbRequestSummaryQuery,
  requester,
  trbRequestSummary
} from 'tests/mock/trbRequest';

import { MessageProvider } from 'hooks/useMessage';
import { TRBFeedbackAction, TRBFormStatus } from 'types/graphql-global-types';
import { MockedQuery } from 'types/util';
import easiMockStore from 'utils/testing/easiMockStore';
import typeRichText from 'utils/testing/typeRichText';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import TRBRequestInfoWrapper from '../_components/RequestContext';
import AdminHome from '..';

import RequestEdits from '.';

const summaryQuery: MockedQuery<GetTRBRequestSummaryQuery> = {
  ...getTrbRequestSummaryQuery,
  result: {
    data: {
      __typename: 'Query',
      trbRequest: getTrbRequestSummary({
        taskStatuses: {
          formStatus: TRBFormStatus.COMPLETED
        }
      })
    }
  }
};

describe('Trb Admin: Action: Request Edits', () => {
  const store = easiMockStore({ groups: ['EASI_TRB_ADMIN_D'] });

  const trbRequestId = trbRequestSummary.id;
  const feedbackMessage = 'test message';

  const createTrbRequestFeedbackQuery: MockedQuery<
    CreateTrbRequestFeedback,
    CreateTrbRequestFeedbackVariables
  > = {
    request: {
      query: CreateTrbRequestFeedbackQuery,
      variables: {
        input: {
          trbRequestId,
          feedbackMessage: `<p>${feedbackMessage}</p>`,
          copyTrbMailbox: true,
          notifyEuaIds: [requester.userInfo.euaUserId],
          action: TRBFeedbackAction.REQUEST_EDITS
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

  it('submits a feedback message', async () => {
    const { asFragment } = render(
      <Provider store={store}>
        <VerboseMockedProvider
          defaultOptions={{
            watchQuery: { fetchPolicy: 'no-cache' },
            query: { fetchPolicy: 'no-cache' }
          }}
          mocks={[
            createTrbRequestFeedbackQuery,
            getTrbRequestQuery,
            getTrbLeadOptionsQuery,
            getTRBRequestAttendeesQuery,
            getTRBRequestAttendeesQuery,
            summaryQuery,
            summaryQuery
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

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    await screen.findByText(
      i18next.t<string>('technicalAssistance:actionRequestEdits.heading')
    );

    expect(asFragment()).toMatchSnapshot();

    const submitButton = screen.getByRole('button', {
      name: i18next.t<string>('technicalAssistance:actionRequestEdits.submit')
    });

    await typeRichText(screen.getByTestId('feedbackMessage'), feedbackMessage);

    userEvent.click(submitButton);

    await screen.findByText(
      i18next.t<string>('technicalAssistance:actionRequestEdits.success')
    );
  });

  it('shows error notice when submission fails', async () => {
    render(
      <MockedProvider
        mocks={[
          summaryQuery,
          getTRBRequestAttendeesQuery,
          {
            ...createTrbRequestFeedbackQuery,
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

    await screen.findByText(
      i18next.t<string>('technicalAssistance:actionRequestEdits.heading')
    );

    await typeRichText(screen.getByTestId('feedbackMessage'), feedbackMessage);

    userEvent.click(
      screen.getByRole('button', {
        name: i18next.t<string>('technicalAssistance:actionRequestEdits.submit')
      })
    );

    await screen.findByText(
      i18next.t<string>('technicalAssistance:actionRequestEdits.error')
    );
  });
});
