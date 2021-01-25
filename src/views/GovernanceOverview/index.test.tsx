import React from 'react';
import { MemoryRouter } from 'react-router-dom';
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
    shallow(<GovernanceOverview />);
  });

  it('matches the snapshot', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <GovernanceOverview />
        </MemoryRouter>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
