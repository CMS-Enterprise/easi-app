import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { act, render, screen } from '@testing-library/react';
import { Mock, vi } from 'vitest';

import easiMockStore from 'utils/testing/easiMockStore';

import { Header } from './index';

vi.mock('@okta/okta-react', () => ({
  useOktaAuth: vi.fn()
}));

vi.mock('hooks/useOktaSession', () => ({
  default: vi.fn(() => ({
    hasSession: false,
    oktaAuth: {
      signInWithRedirect: vi.fn()
    }
  }))
}));

vi.mock('hooks/checkMobile', () => ({
  default: vi.fn(() => false)
}));

vi.mock('utils/auth', () => ({
  isLocalAuthEnabled: vi.fn(() => false),
  isOktaRedirectLoginEnabled: vi.fn(() => false)
}));

const mockUseOktaAuth = useOktaAuth as Mock;

describe('The Header component', () => {
  const store = easiMockStore();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseOktaAuth.mockReturnValue({
      authState: {
        isAuthenticated: true
      },
      oktaAuth: {
        getUser: async () => ({
          name: 'John Doe'
        }),
        signOut: async () => {}
      }
    });
  });

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

  describe('When logged out with Okta redirect login enabled', () => {
    beforeEach(() => {
      mockUseOktaAuth.mockReturnValue({
        authState: {
          isAuthenticated: false
        },
        oktaAuth: {
          signInWithRedirect: vi.fn()
        }
      });
    });

    it('shows the local auth link when local auth is enabled', async () => {
      const { isLocalAuthEnabled, isOktaRedirectLoginEnabled } =
        await import('utils/auth');
      (isOktaRedirectLoginEnabled as Mock).mockReturnValue(true);
      (isLocalAuthEnabled as Mock).mockReturnValue(true);

      await act(async () => {
        render(
          <MemoryRouter>
            <Header />
          </MemoryRouter>
        );
      });

      expect(screen.getByTestId('LocalAuth-Home')).toHaveAttribute(
        'href',
        '/signin?local=true'
      );
      expect(screen.getByText('Sign In')).toBeInTheDocument();
    });

    it('hides the local auth link when local auth is disabled', async () => {
      const { isLocalAuthEnabled, isOktaRedirectLoginEnabled } =
        await import('utils/auth');
      (isOktaRedirectLoginEnabled as Mock).mockReturnValue(true);
      (isLocalAuthEnabled as Mock).mockReturnValue(false);

      await act(async () => {
        render(
          <MemoryRouter>
            <Header />
          </MemoryRouter>
        );
      });

      expect(screen.queryByTestId('LocalAuth-Home')).not.toBeInTheDocument();
    });
  });
});
