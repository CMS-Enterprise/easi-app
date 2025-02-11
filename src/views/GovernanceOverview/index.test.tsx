import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';

import GovernanceOverview from './index';

vi.mock('@okta/okta-react', () => ({
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

describe('The governance overview page', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <GovernanceOverview />
      </MemoryRouter>
    );
  });

  it('matches the snapshot (w/o id param)', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/governance-overview']}>
        <Route
          path="/governance-overview/:systemId?"
          component={GovernanceOverview}
        />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('matches the snapshot (w/ id param)', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/governance-overview/test-intake-guid']}>
        <Route
          path="/governance-overview/:systemId?"
          component={GovernanceOverview}
        />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
