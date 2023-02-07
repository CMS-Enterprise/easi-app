import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import configureMockStore from 'redux-mock-store';

import { trbRequest } from 'data/mock/trbRequest';
import GetTrbRequestQuery from 'queries/GetTrbRequestQuery';

import AdminHome from '.';

const getTrbRequestQuery = {
  request: {
    query: GetTrbRequestQuery,
    variables: {
      id: trbRequest.id
    }
  },
  result: {
    data: { trbRequest }
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

describe('TRB admin home wrapper', () => {
  it('matches the snapshot', async () => {
    const { asFragment, getByTestId } = render(
      <MemoryRouter initialEntries={[`/trb/${trbRequest.id}/request`]}>
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

    await waitFor(() => {
      expect(getByTestId('trbSummary-requester_ABCD')).toBeInTheDocument();
    });

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

  test.skip.each(subpages)(
    'renders submit action with and without email notification %j',
    async subpage => {
      const { getByTestId } = render(
        <MemoryRouter initialEntries={[`/trb/${trbRequest.id}/${subpage}`]}>
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

      // Check that correct subpage component is rendered
      expect(getByTestId(`trb-admin-home__${subpage}`)).toBeInTheDocument();
    }
  );
});
