import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import renderer, { act } from 'react-test-renderer';

import PrepareForGRT from './index';

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
          <PrepareForGRT />
        </MemoryRouter>
      );
    });

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
