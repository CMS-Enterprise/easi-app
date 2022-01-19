import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import GetCedarSystemBookmarksQuery from 'queries/GetCedarSystemBookmarksQuery';
import GetCedarSystemsQuery from 'queries/GetCedarSystemsQuery';
import { mockBookmarkInfo, mockSystemInfo } from 'views/Sandbox/mockSystemData';

import SystemList from './index';

// TODO:  Mock Bookmark GQL query once connected to BE
// Currently component is baked with mocked data from file

jest.mock('@okta/okta-react', () => ({
  useOktaAuth: () => {
    return {
      authState: {
        isAuthenticated: true
      },
      oktaAuth: {
        getUser: () =>
          Promise.resolve({
            name: 'John Doe'
          })
      }
    };
  }
}));

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

      expect(
        await screen.findByText('Showing 1-10 of 0 results')
      ).toBeInTheDocument();
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

      waitFor(() => {
        expect(
          screen.getByText('Happiness Achievement Module')
        ).toBeInTheDocument();
      });

      waitFor(() => {
        expect(screen.getAllByText('CMS Component')[0]).toBeInTheDocument();
      });

      waitFor(() => {
        expect(screen.findByRole('table')).toBeInTheDocument();
      });
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
