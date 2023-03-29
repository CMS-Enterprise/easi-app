import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import i18next from 'i18next';

import GetTrbRequestHomeQuery from 'queries/GetTrbRequestHomeQuery';
import {
  TRBAdviceLetterStatus,
  TRBFormStatus
} from 'types/graphql-global-types';

import RequestHome from './RequestHome';

describe('Trb Admin Request Home', () => {
  Element.prototype.scrollIntoView = jest.fn();

  const trbRequestId = '449ea115-8bfa-48c3-b1dd-5a613d79fbae';

  it('renders successfully ', async () => {
    const { getByText, asFragment, getByRole, getByTestId } = render(
      <MockedProvider
        defaultOptions={{
          watchQuery: { fetchPolicy: 'no-cache' },
          query: { fetchPolicy: 'no-cache' }
        }}
        mocks={[
          {
            request: {
              query: GetTrbRequestHomeQuery,
              variables: {
                id: trbRequestId
              }
            },
            result: {
              data: {
                trbRequest: {
                  id: trbRequestId,
                  consultMeetingTime: null,
                  taskStatuses: {
                    formStatus: TRBFormStatus.READY_TO_START,
                    adviceLetterStatus: TRBAdviceLetterStatus.CANNOT_START_YET,
                    __typename: 'TRBTaskStatuses'
                  },
                  form: {
                    id: 'c92ec6a6-cd5b-4be3-895a-e88f7de76c22',
                    modifiedAt: null,
                    __typename: 'TRBRequestForm'
                  },
                  adviceLetter: null,
                  trbLeadComponent: null,
                  trbLeadInfo: {
                    commonName: '',
                    email: '',
                    __typename: 'UserInfo'
                  },
                  documents: [],
                  adminNotes: [],
                  __typename: 'TRBRequest'
                }
              }
            }
          }
        ]}
      >
        <MemoryRouter initialEntries={[`/trb/${trbRequestId}/request`]}>
          <Route exact path="/trb/:id/:activePage">
            <RequestHome trbRequestId={trbRequestId} />
          </Route>
        </MemoryRouter>
      </MockedProvider>
    );

    expect(
      getByText(
        i18next.t<string>('technicalAssistance:adminHome.subnav.requestHome')
      )
    ).toBeInTheDocument();

    await waitForElementToBeRemoved(() => getByTestId('page-loading'));

    expect(
      getByText(
        i18next.t<string>('technicalAssistance:adminHome.reviewInitialRequest')
      )
    ).toBeInTheDocument();

    expect(
      getByRole('button', {
        name: i18next.t<string>('technicalAssistance:adminHome.assignLead')
      })
    ).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });
});
