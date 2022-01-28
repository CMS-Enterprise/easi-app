import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';

import SystemProfile from './index';

jest.mock('@okta/okta-react', () => ({
  useOktaAuth: () => {
    return {
      authState: {
        isAuthenticated: true
      },
      oktaAuth: {
        getUser: async () => {
          return {
            name: 'John Doe'
          };
        },
        logout: async () => {}
      }
    };
  }
}));

// TODO: Mock cedar data once available

describe('The making a request page', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={['/system-profile/326-9-0/tools-and-software']}
      >
        <Route path="/system-profile/:systemId/:subinfo">
          <SystemProfile />
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
          <SystemProfile />
        </Route>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
