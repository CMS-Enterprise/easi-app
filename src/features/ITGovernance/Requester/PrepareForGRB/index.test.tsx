import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import PrepareForGRB from './index';

vi.mock('@okta/okta-react', () => ({
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

describe('The prepare for GRB info page', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <PrepareForGRB />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
