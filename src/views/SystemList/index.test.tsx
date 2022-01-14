import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';

import GetCedarSystemsAndBookmarksQuery from 'queries/GetCedarSystemsAndBookmarksQuery';
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
            query: GetCedarSystemsAndBookmarksQuery
          },
          result: {
            data: {
              cedarSystems: [],
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
          query: GetCedarSystemsAndBookmarksQuery
        },
        result: {
          data: {
            cedarSystems: mockSystemInfo,
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

      // Table line item text
      expect(
        await screen.findByText('Happiness Achievement Module')
      ).toBeInTheDocument();
      // Bookmark Text
      expect(await screen.getAllByText('CMS Component')[0]).toBeInTheDocument();
      expect(await screen.findByRole('table')).toBeInTheDocument();
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
