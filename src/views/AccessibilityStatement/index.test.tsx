import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import renderer, { act } from 'react-test-renderer';

import AccessibilityStatement from './index';

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

describe('The Cookies static page', () => {
  it('matches the snapshot', async () => {
    let tree: any;
    await act(async () => {
      tree = renderer.create(
        <MemoryRouter>
          <AccessibilityStatement />
        </MemoryRouter>
      );
    });

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
