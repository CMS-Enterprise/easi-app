import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import renderer, { act } from 'react-test-renderer';
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
    let tree: any;
    await act(async () => {
      tree = renderer.create(
        <MemoryRouter initialEntries={['/governance-overview']}>
          <Route
            path="/governance-overview/:systemId?"
            component={GovernanceOverview}
          />
        </MemoryRouter>
      );
    });

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('matches the snapshot (w/ id param)', async () => {
    let tree: any;
    await act(async () => {
      tree = renderer.create(
        <MemoryRouter
          initialEntries={['/governance-overview/test-intake-guid']}
        >
          <Route
            path="/governance-overview/:systemId?"
            component={GovernanceOverview}
          />
        </MemoryRouter>
      );
    });

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
