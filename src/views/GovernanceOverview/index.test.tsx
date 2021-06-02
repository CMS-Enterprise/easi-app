import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import GovernanceOverview from './index';

jest.mock('@okta/okta-react', () => ({
  useOktaAuth: () => {
    return {
      authState: {
        isAuthenticated: true
      },
      oktaAuth: {
        getUser: async () => {},
        logout: async () => {}
      }
    };
  }
}));

describe('The governance overview page', () => {
  it('renders without crashing', () => {
    shallow(
      <MemoryRouter>
        <GovernanceOverview />
      </MemoryRouter>
    );
  });

  it('matches the snapshot (w/o id param)', () => {
    const tree = renderer
      .create(
        <MemoryRouter initialEntries={['/governance-overview']}>
          <Route
            path="/governance-overview/:systemId?"
            component={GovernanceOverview}
          />
        </MemoryRouter>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('matches the snapshot (w/ id param)', () => {
    const tree = renderer
      .create(
        <MemoryRouter
          initialEntries={['/governance-overview/test-intake-guid']}
        >
          <Route
            path="/governance-overview/:systemId?"
            component={GovernanceOverview}
          />
        </MemoryRouter>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
