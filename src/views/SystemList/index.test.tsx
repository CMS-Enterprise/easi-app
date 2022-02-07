import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import GetCedarSystemBookmarksQuery from 'queries/GetCedarSystemBookmarksQuery';
import GetCedarSystemsQuery from 'queries/GetCedarSystemsQuery';
import { mockBookmarkInfo, mockSystemInfo } from 'views/Sandbox/mockSystemData';

import SystemList from './index';

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
        },
        {
          request: {
            query: GetCedarSystemBookmarksQuery
          },
          result: {
            data: {
              cedarSystemBookmarks: []
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
      },
      {
        request: {
          query: GetCedarSystemBookmarksQuery
        },
        result: {
          data: {
            cedarSystemBookmarks: mockBookmarkInfo
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
        expect(screen.getAllByText('CMS Component')[0]).toBeInTheDocument();
      });
    });

    it('displays relevant results from filter', async () => {
      render(
        <MemoryRouter>
          <MockedProvider mocks={mocks} addTypename={false}>
            <SystemList />
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
      expect(await screen.queryByText('ZXC')).toBeNull();
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
