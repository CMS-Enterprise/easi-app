import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import renderer, { act } from 'react-test-renderer';
import { shallow } from 'enzyme';

import TermsAndConditions from './index';

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
          }),
        logout: async () => {}
      }
    };
  }
}));

describe('The Terms & Conditions page', () => {
  it('renders without crashing', () => {
    shallow(<TermsAndConditions />);
  });

  it('matches the snapshot', async () => {
    let tree: any;
    await act(async () => {
      tree = renderer.create(
        <MemoryRouter>
          <TermsAndConditions />
        </MemoryRouter>
      );
    });

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
