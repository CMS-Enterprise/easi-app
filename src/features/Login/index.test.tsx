import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { render, screen } from '@testing-library/react';
import { Mock, vi } from 'vitest';

import Login from './index';

const mockSignInWithRedirect = vi.fn();

vi.mock('@okta/okta-react', () => ({
  useOktaAuth: vi.fn()
}));

vi.mock('components/OktaSignInWidget', () => ({
  default: () => <div data-testid="okta-sign-in-widget" />
}));

vi.mock('wrappers/AuthenticationWrapper/DevLogin', () => ({
  default: () => <div data-testid="dev-login" />
}));

vi.mock('utils/auth', () => ({
  isLocalAuthEnabled: vi.fn(() => false),
  isOktaRedirectLoginEnabled: vi.fn(() => false)
}));

const mockUseOktaAuth = useOktaAuth as Mock;

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    mockUseOktaAuth.mockReturnValue({
      oktaAuth: {
        signInWithRedirect: mockSignInWithRedirect,
        getOriginalUri: vi.fn(),
        handleLoginRedirect: vi.fn().mockResolvedValue(undefined)
      },
      authState: {
        isAuthenticated: false
      }
    });
  });

  it('renders the widget when redirect login is disabled', async () => {
    const { isOktaRedirectLoginEnabled } = await import('utils/auth');
    (isOktaRedirectLoginEnabled as Mock).mockReturnValue(false);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByTestId('okta-sign-in-widget')).toBeInTheDocument();
    expect(screen.queryByTestId('okta-redirect-login')).not.toBeInTheDocument();
    expect(mockSignInWithRedirect).not.toHaveBeenCalled();
  });

  it('redirects to hosted Okta login when redirect login is enabled', async () => {
    const { isOktaRedirectLoginEnabled } = await import('utils/auth');
    (isOktaRedirectLoginEnabled as Mock).mockReturnValue(true);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByTestId('okta-redirect-login')).toBeInTheDocument();
    expect(screen.queryByTestId('okta-sign-in-widget')).not.toBeInTheDocument();
    expect(mockSignInWithRedirect).toHaveBeenCalledTimes(1);
  });

  it('renders local auth when ?local=true is present', async () => {
    const { isLocalAuthEnabled, isOktaRedirectLoginEnabled } =
      await import('utils/auth');
    (isLocalAuthEnabled as Mock).mockReturnValue(true);
    (isOktaRedirectLoginEnabled as Mock).mockReturnValue(true);

    render(
      <MemoryRouter initialEntries={['/signin?local=true']}>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByTestId('dev-login')).toBeInTheDocument();
    expect(mockSignInWithRedirect).not.toHaveBeenCalled();
  });
});
