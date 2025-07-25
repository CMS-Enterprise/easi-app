import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { act, render, screen } from '@testing-library/react';

import easiMockStore from 'utils/testing/easiMockStore';

import { Header } from './index';

vi.mock('@okta/okta-react', () => ({
  useOktaAuth: () => {
    return {
      authState: {
        isAuthenticated: true
      },
      oktaAuth: {
        getUser: async () => ({
          name: 'John Doe'
        }),
        logout: async () => {}
      }
    };
  }
}));

describe('The Header component', () => {
  const store = easiMockStore();

  it('renders without crashing', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      );
    });
    screen.getByText('Sign Out');
  });

  describe('When logged in', () => {
    it('displays a login button', async () => {
      await act(async () => {
        render(
          <MemoryRouter>
            <Header />
          </MemoryRouter>
        );
      });
      screen.getByText(/Sign Out/);
      expect(screen.queryByText(/Sign In/)).not.toBeInTheDocument();
    });

    it('displays the users name', async () => {
      await act(async () => {
        render(
          <Provider store={store}>
            <MemoryRouter>
              <Header />
            </MemoryRouter>
          </Provider>
        );
      });

      await screen.findByText('John Doe');
    });
  });
});
