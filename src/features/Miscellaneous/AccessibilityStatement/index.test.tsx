import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import AccessibilityStatement from './index';

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

describe('The Accessibility Statement static page', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <AccessibilityStatement />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
