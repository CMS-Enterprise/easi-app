import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import GetCedarSystemQuery from 'queries/GetCedarSystemQuery';
import { mockSystemInfo } from 'views/Sandbox/mockSystemData';

import SystemProfile from './index';

const mocks = [
  {
    request: {
      query: GetCedarSystemQuery,
      variables: {
        id: '326-9-0'
      }
    },
    result: {
      data: {
        cedarSystem: mockSystemInfo[3]
      }
    }
  }
];

describe('The making a request page', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={['/system-profile/326-9-0/tools-and-software']}
      >
        <Route path="/system-profile/:systemId/:subinfo">
          <MockedProvider mocks={mocks} addTypename={false}>
            <SystemProfile />
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText('Medicare Beneficiary Contact Center')
      ).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={['/system-profile/326-9-0/tools-and-software']}
      >
        <Route path="/system-profile/:systemId/:subinfo">
          <MockedProvider mocks={mocks} addTypename={false}>
            <SystemProfile />
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
