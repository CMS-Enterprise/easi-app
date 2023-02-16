import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import configureMockStore from 'redux-mock-store';

import {
  trbRequestAdviceLetter,
  trbRequestSummary
} from 'data/mock/trbRequest';
import GetTrbRequestSummaryQuery from 'queries/GetTrbRequestSummaryQuery';
import { GetTrbAdviceLetterQuery } from 'queries/TrbAdviceLetterQueries';

import AdminHome from '.';

const trbRequestId = 'a4093ec7-caec-4e73-be3d-a8d6262bc61b';

const getTrbRequestQuery = {
  request: {
    query: GetTrbRequestSummaryQuery,
    variables: {
      id: trbRequestId
    }
  },
  result: {
    data: { trbRequest: trbRequestSummary }
  }
};

const getAdviceLetterQuery = {
  request: {
    query: GetTrbAdviceLetterQuery,
    variables: {
      id: trbRequestId
    }
  },
  result: {
    data: { trbRequest: trbRequestAdviceLetter }
  }
};

const mockStore = configureMockStore();

const defaultStore = mockStore({
  auth: {
    euaId: 'SF13',
    name: 'Jerry Seinfeld',
    isUserSet: true,
    groups: ['EASI_TRB_ADMIN_D']
  }
});

describe('TRB admin home', () => {
  it('matches the snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={[`/trb/${trbRequestId}/request`]}>
        <Provider store={defaultStore}>
          <MockedProvider mocks={[getTrbRequestQuery]} addTypename={false}>
            <Route path="/trb/:id/:activePage?">
              <AdminHome />
            </Route>
          </MockedProvider>
        </Provider>
      </MemoryRouter>
    );

    // Wait for page to load
    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    // Snapshot
    expect(asFragment()).toMatchSnapshot();
  });

  const subpages = [
    'initial-request-form',
    'documents',
    'feedback',
    'advice',
    'notes'
  ];

  test.each(subpages)('Renders each subpage', async subpage => {
    const { findByTestId } = render(
      <MemoryRouter initialEntries={[`/trb/${trbRequestId}/${subpage}`]}>
        <Provider store={defaultStore}>
          <MockedProvider mocks={[getTrbRequestQuery]} addTypename={false}>
            <Route path="/trb/:id/:activePage?">
              <AdminHome />
            </Route>
          </MockedProvider>
        </Provider>
      </MemoryRouter>
    );

    const subPageContent = await findByTestId(`trb-admin-home__${subpage}`);
    expect(subPageContent).toBeInTheDocument();
  });

  it.only('Renders advice letters', async () => {
    const { findByTestId, getByText, asFragment } = render(
      <MemoryRouter initialEntries={[`/trb/${trbRequestId}/advice`]}>
        <Provider store={defaultStore}>
          <MockedProvider
            mocks={[getTrbRequestQuery, getAdviceLetterQuery]}
            addTypename={false}
          >
            <Route path="/trb/:id/:activePage?">
              <AdminHome />
            </Route>
          </MockedProvider>
        </Provider>
      </MemoryRouter>
    );

    // Wait for page to load
    const subPageContent = await findByTestId(`trb-admin-home__advice`);
    expect(subPageContent).toBeInTheDocument();

    // Advice letter renders
    expect(getByText('Meeting summary text')).toBeInTheDocument();

    // Recommendation letter renders
    expect(getByText('Recommendation 1')).toBeInTheDocument();

    // Snapshot
    expect(asFragment()).toMatchSnapshot();
  });
});
