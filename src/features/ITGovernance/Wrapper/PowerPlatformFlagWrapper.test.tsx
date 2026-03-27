import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { Mock, vi } from 'vitest';

import PowerPlatformFlagWrapper from './PowerPlatformFlagWrapper';

const validUUID = '550e8400-e29b-41d4-a716-446655440000';

// mock launchdarkly with a function created inside the factory to avoid hoisting errors
vi.mock('launchdarkly-react-client-sdk', () => ({
  useFlags: vi.fn()
}));

// mock the powerPlatformLink util so tests don't rely on NODE_ENV or environment
vi.mock('../../../utils/powerPlatformLink', () => ({
  default: () => 'https://example.com'
}));

describe('PowerPlatformFlagWrapper', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    // mock location.href assignment in a type-safe way
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: { href: '' } as Location
    });
  });

  afterEach(() => {
    // restore location and reset mocks in a type-safe way
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: originalLocation
    });
    vi.resetAllMocks();
  });

  it('renders loader and sets window.location.href when flag enabled and path has intake id', () => {
    (useFlags as Mock).mockReturnValue({
      enablePowerPlatform: true
    });

    render(
      <MemoryRouter initialEntries={[`/it-governance/${validUUID}`]}>
        <Route path="/it-governance/:intakeId">
          <PowerPlatformFlagWrapper />
        </Route>
      </MemoryRouter>
    );

    // PageLoading should be present in the document body (portal)
    expect(screen.getByTestId('page-loading')).toBeInTheDocument();
    // location href should be set (non-empty)
    expect(window.location.href).not.toBe('');
  });

  it('renders loader and sets window.location.href when flag enabled and path is /system/request-type', () => {
    (useFlags as Mock).mockReturnValue({
      enablePowerPlatform: true
    });

    render(
      <MemoryRouter initialEntries={['/system/request-type']}>
        <Route path="/system/request-type">
          <PowerPlatformFlagWrapper />
        </Route>
      </MemoryRouter>
    );

    // PageLoading should be present in the document body (portal)
    expect(screen.getByTestId('page-loading')).toBeInTheDocument();
    // location href should be set (non-empty)
    expect(window.location.href).not.toBe('');
  });

  it('does nothing when an invalid uuid is passed, even when the flag is enabled', () => {
    (useFlags as Mock).mockReturnValue({
      enablePowerPlatform: true
    });

    render(
      <MemoryRouter initialEntries={[`/it-governance/123`]}>
        <Route path="/it-governance/:intakeId">
          <PowerPlatformFlagWrapper />
        </Route>
      </MemoryRouter>
    );

    // should not render loading screen when invalid id
    expect(screen.queryByTestId('page-loading')).toBeNull();
    // location href should be empty
    expect(window.location.href).toBe('');
  });

  it('does nothing when flag disabled', () => {
    (useFlags as Mock).mockReturnValue({
      enablePowerPlatform: false
    });

    render(
      <MemoryRouter initialEntries={[`/it-governance/${validUUID}`]}>
        <Route path="/it-governance/:intakeId">
          <PowerPlatformFlagWrapper />
        </Route>
      </MemoryRouter>
    );

    // should not render loader
    expect(screen.queryByTestId('page-loading')).toBeNull();
    // location href should be empty
    expect(window.location.href).toBe('');
  });
});
