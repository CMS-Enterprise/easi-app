import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  GetTRBRequestQuery,
  GetTRBRequestQueryVariables
} from 'gql/generated/graphql';
import i18next from 'i18next';
import {
  attendees,
  getTrbRequestQuery,
  trbRequest
} from 'tests/mock/trbRequest';

import {
  TRBFeedbackAction,
  TRBFeedbackStatus
} from 'types/graphql-global-types';
import { MockedQuery } from 'types/util';
import easiMockStore from 'utils/testing/easiMockStore';
import { mockTrbRequestId } from 'utils/testing/MockTrbAttendees';

import RequestForm from '.';

const getTrbRequestQueryWithFeedback: MockedQuery<
  GetTRBRequestQuery,
  GetTRBRequestQueryVariables
> = {
  ...getTrbRequestQuery,
  result: {
    data: {
      __typename: 'Query',
      trbRequest: {
        ...trbRequest,
        taskStatuses: {
          ...trbRequest.taskStatuses,
          feedbackStatus: TRBFeedbackStatus.EDITS_REQUESTED
        },
        feedback: [
          {
            id: 'edf39ac2-ced6-4cfd-a328-a1707c2e04c7',
            feedbackMessage:
              'Purus morbi pellentesque eget erat. Egestas venenatis vitae pretium pretium, orci, elit praesent tortor. Turpis semper sollicitudin sagittis pellentesque est dictum. Rhoncus, nulla turpis netus praesent consequat leo orci, vel.',
            action: TRBFeedbackAction.REQUEST_EDITS,
            author: {
              commonName: attendees[1].userInfo.commonName,
              __typename: 'UserInfo'
            },
            createdAt: '2023-01-30T16:23:34.576076Z',
            __typename: 'TRBRequestFeedback'
          },
          {
            id: 'eeb2dab6-d436-433a-90a9-673c8e9256f5',
            feedbackMessage:
              'Id mauris pharetra volutpat, praesent faucibus aliquam, penatibus. Convallis maecenas cras dignissim in diam duis odio maecenas. Mi amet ullamcorper dolor tempus vulputate elit a volutpat purus. Nunc, vel arcu imperdiet duis enim leo quis. Aliquam nibh tincidunt aliquam morbi non. A in porttitor suspendisse nunc turpis turpis eros, at ultrices. Scelerisque netus quisque semper ullamcorper porta interdum scelerisque elementum. Egestas enim egestas imperdiet sociis porta.',
            action: TRBFeedbackAction.REQUEST_EDITS,
            author: {
              commonName: attendees[1].userInfo.commonName,
              __typename: 'UserInfo'
            },
            createdAt: '2023-01-31T18:22:13.029728Z',
            __typename: 'TRBRequestFeedback'
          }
        ]
      }
    }
  }
};

function renderFeedbackTest() {
  const store = easiMockStore();
  return render(
    <MemoryRouter initialEntries={[`/trb/requests/${mockTrbRequestId}/basic`]}>
      <MockedProvider mocks={[getTrbRequestQueryWithFeedback]}>
        <Route exact path="/trb/requests/:id/:step?/:view?">
          <Provider store={store}>
            <RequestForm />
          </Provider>
        </Route>
      </MockedProvider>
    </MemoryRouter>
  );
}

describe('TRB Request Form Feedback', () => {
  it('shows the View feedback warning banner in the header if there are edits requested', async () => {
    const { getByRole, findByText } = renderFeedbackTest();

    expect(
      await findByText(
        i18next.t<string>('technicalAssistance:editsRequested.alert')
      )
    ).toBeInTheDocument();

    getByRole('link', {
      name: i18next.t<string>('technicalAssistance:editsRequested.viewFeedback')
    });
  });

  it('goes to and renders the feedback view', async () => {
    const { asFragment, findByText, findByRole, getAllByText, getAllByTestId } =
      renderFeedbackTest();

    const feedbackLink = await findByRole('link', {
      name: i18next.t<string>('technicalAssistance:editsRequested.viewFeedback')
    });

    userEvent.click(feedbackLink);

    await findByText(
      i18next.t<string>('technicalAssistance:requestFeedback.heading')
    );

    // Check feedback author name
    getAllByText(/Audrey Abrams/);

    // Check feedback ordered by dates desc
    const sortedDates = getAllByTestId('feedback-date');
    expect(sortedDates.length).toBe(2);
    expect(sortedDates[0]).toHaveTextContent('January 31, 2023');
    expect(sortedDates[1]).toHaveTextContent('January 30, 2023');

    expect(asFragment()).toMatchSnapshot();
  });
});
