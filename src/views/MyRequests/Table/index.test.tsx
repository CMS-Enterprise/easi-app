import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import { getRequestsQuery } from 'data/mock/trbRequest';

import Table from '.';

describe('My Requests Table', () => {
  describe('when there are no requests', () => {
    it('displays an empty message', async () => {
      render(
        <MemoryRouter>
          <MockedProvider mocks={[getRequestsQuery([])]}>
            <Table />
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
            <Table />
          </MockedProvider>
        </MemoryRouter>
      );

      expect(await screen.findByRole('table')).toBeInTheDocument();
      expect(
        await screen.findByText('My excellent question')
      ).toBeInTheDocument();
    });

    it('displays an IT Goverance request only table with hidden columns', async () => {
      render(
        <MemoryRouter>
          <MockedProvider mocks={[getRequestsQuery()]}>
            <Table
              type="itgov"
              hiddenColumns={['Governance', 'Upcoming meeting date']}
            />
          </MockedProvider>
        </MemoryRouter>
      );

      expect(
        await screen.queryByText('Upcoming meeting date')
      ).not.toBeInTheDocument();
    });

    it('displays relevant results from filter', async () => {
      render(
        <MemoryRouter>
          <MockedProvider mocks={[getRequestsQuery()]}>
            <Table defaultPageSize={4} />
          </MockedProvider>
        </MemoryRouter>
      );

      // Mocked time for debounce of input
      await waitFor(() => new Promise(res => setTimeout(res, 200)));

      // Intake 1 is a mocked table row text item that should not be included in filtered results
      expect(await screen.queryByText('Intake 1')).toBeNull();
    });

    it('matches snapshot', async () => {
      const { asFragment } = render(
        <MemoryRouter>
          <MockedProvider mocks={[getRequestsQuery()]}>
            <Table />
          </MockedProvider>
        </MemoryRouter>
      );
      expect(await screen.findByRole('table')).toBeInTheDocument();
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
