import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockSystemInfo } from 'features/Systems/SystemProfile/data/mockSystemData';
import GetCedarSystemsQuery from 'gql/legacyGQL/GetCedarSystemsQuery';

import SystemList from './index';
import Table from './SystemsTable';

// TODO:  Mock Bookmark GQL query once connected to BE
// Currently component is baked with mocked data from file

describe('System List View', () => {
  describe('when there are no requests', () => {
    it('displays an empty table', async () => {
      const mocks = [
        {
          request: {
            query: GetCedarSystemsQuery
          },
          result: {
            data: {
              cedarSystems: []
            }
          }
        }
      ];

      render(
        <MemoryRouter>
          <MockedProvider mocks={mocks} addTypename={false}>
            <SystemList />
          </MockedProvider>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.queryAllByRole('cell')).toEqual([]);
      });
    });
  });

  describe('when there are requests', () => {
    const mocks = [
      {
        request: {
          query: GetCedarSystemsQuery
        },
        result: {
          data: {
            cedarSystems: mockSystemInfo
          }
        }
      }
    ];

    it('displays a table', async () => {
      render(
        <MemoryRouter>
          <MockedProvider mocks={mocks} addTypename={false}>
            <SystemList />
          </MockedProvider>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByText('Happiness Achievement Module')
        ).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getAllByText('CMS component')[0]).toBeInTheDocument();
      });
    });

    it('displays relevant results from filter', async () => {
      render(
        <MemoryRouter>
          <MockedProvider mocks={mocks} addTypename={false}>
            <Table defaultPageSize={3} systems={mockSystemInfo} />
          </MockedProvider>
        </MemoryRouter>
      );

      // User event to typing in query with debounce
      await waitFor(() => {
        userEvent.type(
          screen.getByRole('searchbox'),
          'Happiness Achievement Module'
        );
      });

      // Mocked time for debounce of input
      await waitFor(() => new Promise(res => setTimeout(res, 200)));

      // ZXC is a mocked table row text item that should not be included in filtered results
      expect(screen.queryByText('ASD')).toBeNull();
    });

    it('matches snapshot', async () => {
      const { asFragment } = render(
        <MemoryRouter>
          <MockedProvider mocks={mocks} addTypename={false}>
            <SystemList />
          </MockedProvider>
        </MemoryRouter>
      );
      expect(await screen.findByRole('table')).toBeInTheDocument();
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
