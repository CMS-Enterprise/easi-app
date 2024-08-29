import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';

import { getRequestsQuery } from 'data/mock/trbRequest';

import Table from '.';

describe('My Requests Table', () => {
  const mockStore = configureMockStore();
  const store = mockStore({
    auth: {
      euaId: 'ABCD'
    },
    systemIntake: { systemIntake: {} },
    action: {}
  });

  describe('when there are no requests', () => {
    it('displays an empty message', async () => {
      render(
        <MemoryRouter>
          <MockedProvider mocks={[getRequestsQuery([])]}>
            <Provider store={store}>
              <Table />
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );

      expect(
        await screen.findByText(
          'You do not have any open requests in EASi. To start a new IT Governance request or technical assistance request, use the buttons above.'
        )
      ).toBeInTheDocument();
    });
  });

  describe('when there are requests', () => {
    it('displays a table', async () => {
      render(
        <MemoryRouter>
          <MockedProvider mocks={[getRequestsQuery()]}>
            <Provider store={store}>
              <Table />
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );

      expect(await screen.findByRole('table')).toBeInTheDocument();
      expect(
        await screen.findByText('My excellent question')
      ).toBeInTheDocument();
    });

    it('displays an IT Goverance request only table with hidden columns', () => {
      render(
        <MemoryRouter>
          <MockedProvider mocks={[getRequestsQuery()]}>
            <Provider store={store}>
              <Table
                type="itgov"
                hiddenColumns={['Governance', 'Upcoming meeting date']}
              />
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );

      expect(
        screen.queryByText('Upcoming meeting date')
      ).not.toBeInTheDocument();
    });

    it('displays relevant results from filter', async () => {
      render(
        <MemoryRouter>
          <MockedProvider mocks={[getRequestsQuery()]}>
            <Provider store={store}>
              <Table defaultPageSize={4} />
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );

      // Mocked time for debounce of input
      await waitFor(() => new Promise(res => setTimeout(res, 200)));

      // Intake 1 is a mocked table row text item that should not be included in filtered results
      expect(screen.queryByText('Intake 1')).toBeNull();
    });

    it('matches snapshot', async () => {
      const { asFragment } = render(
        <MemoryRouter>
          <MockedProvider mocks={[getRequestsQuery()]}>
            <Provider store={store}>
              <Table />
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );
      expect(await screen.findByRole('table')).toBeInTheDocument();
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
