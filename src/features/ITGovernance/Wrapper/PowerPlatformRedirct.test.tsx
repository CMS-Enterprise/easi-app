import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import {
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import { GetGovernanceTaskListDocument } from 'gql/generated/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';
import configureMockStore from 'redux-mock-store';
import { Mock, vi } from 'vitest';

import { businessCaseInitialData } from 'data/businessCase';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import powerPlatformLink from '../../../utils/powerPlatformLink';
import BusinessCase from '../Requester/BusinessCase';

import PowerPlatformRedirect from './PowerPlatformRedirect';

const validUUID = '550e8400-e29b-41d4-a716-446655440000';

// mock launchdarkly with a function created inside the factory to avoid hoisting errors
vi.mock('launchdarkly-react-client-sdk', () => ({
  useFlags: vi.fn()
}));

// mock the powerPlatformLink util so tests don't rely on NODE_ENV or environment
vi.mock('../../../utils/powerPlatformLink', () => ({
  default: vi.fn((id?: string, isRequestType?: boolean) =>
    id || isRequestType ? 'https://example.com' : ''
  )
}));

describe('PowerPlatformRedirect', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    // mock location.href assignment in a type-safe way
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: { href: '' } as Location
    });

    // mock matchMedia for react-media used in BusinessCase
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
      }))
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

  const mockStore = configureMockStore();
  const defaultStore = mockStore({
    auth: {
      euaId: 'ADMI',
      name: 'Admin',
      isUserSet: true,
      groups: []
    },
    businessCase: {
      form: {
        ...businessCaseInitialData,
        systemIntakeId: validUUID,
        id: '75746af8-9a9b-4558-a375-cf9848eb2b0d'
      },
      isLoading: false,
      isSaving: false,
      error: null
    },
    action: {
      isPosting: false,
      error: null,
      actions: []
    }
  });

  it('renders loader and sets window.location.href when flag enabled and path has intake id', () => {
    (useFlags as Mock).mockReturnValue({
      enablePowerPlatform: true
    });
    (powerPlatformLink as Mock).mockReturnValue('https://example.com');

    render(
      <MemoryRouter initialEntries={[`/it-governance/${validUUID}`]}>
        <Provider store={defaultStore}>
          <VerboseMockedProvider mocks={[]}>
            <Route path="/it-governance/:intakeId">
              <PowerPlatformRedirect />
            </Route>
          </VerboseMockedProvider>
        </Provider>
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
    (powerPlatformLink as Mock).mockReturnValue('https://example.com');

    render(
      <MemoryRouter initialEntries={['/system/request-type']}>
        <Provider store={defaultStore}>
          <VerboseMockedProvider mocks={[]}>
            <Route path="/system/request-type">
              <PowerPlatformRedirect />
            </Route>
          </VerboseMockedProvider>
        </Provider>
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
    (powerPlatformLink as Mock).mockReturnValue('');

    render(
      <MemoryRouter initialEntries={[`/it-governance/123`]}>
        <Provider store={defaultStore}>
          <VerboseMockedProvider mocks={[]}>
            <Route path="/it-governance/:intakeId">
              <PowerPlatformRedirect />
            </Route>
          </VerboseMockedProvider>
        </Provider>
      </MemoryRouter>
    );

    // should not render loading screen when invalid id
    expect(screen.queryByTestId('page-loading')).not.toBeInTheDocument();
    // location href should be empty
    expect(window.location.href).toBe('');
  });

  it('does nothing when flag disabled', () => {
    (useFlags as Mock).mockReturnValue({
      enablePowerPlatform: false
    });
    (powerPlatformLink as Mock).mockReturnValue('');

    render(
      <MemoryRouter initialEntries={[`/it-governance/${validUUID}`]}>
        <Provider store={defaultStore}>
          <VerboseMockedProvider mocks={[]}>
            <Route path="/it-governance/:intakeId">
              <PowerPlatformRedirect />
            </Route>
          </VerboseMockedProvider>
        </Provider>
      </MemoryRouter>
    );

    // should not render loader
    expect(screen.queryByTestId('page-loading')).not.toBeInTheDocument();
    // location href should be empty
    expect(window.location.href).toBe('');
  });

  it('renders loader and sets window.location.href when rendering BusinessCase and flag is enabled', async () => {
    (useFlags as Mock).mockReturnValue({
      enablePowerPlatform: true
    });
    (powerPlatformLink as Mock).mockReturnValue('https://example.com');

    render(
      <MemoryRouter
        initialEntries={[`/business/75746af8-9a9b-4558-a375-cf9848eb2b0d/view`]}
      >
        <Provider store={defaultStore}>
          <VerboseMockedProvider mocks={[]}>
            <Route path="/business/:businessCaseId/:formPage">
              <BusinessCase />
            </Route>
          </VerboseMockedProvider>
        </Provider>
      </MemoryRouter>
    );

    // PageLoading should be present
    expect(screen.getByTestId('page-loading')).toBeInTheDocument();
    // location href should be set
    expect(window.location.href).not.toBe('');
  });

  it('renders BusinessCase when flag is disabled', async () => {
    (useFlags as Mock).mockReturnValue({
      enablePowerPlatform: false
    });
    (powerPlatformLink as Mock).mockReturnValue('');

    render(
      <MemoryRouter
        initialEntries={[`/business/75746af8-9a9b-4558-a375-cf9848eb2b0d/view`]}
      >
        <Provider store={defaultStore}>
          <VerboseMockedProvider
            mocks={[
              {
                request: {
                  query: GetGovernanceTaskListDocument,
                  variables: { id: validUUID }
                },
                result: {
                  data: {
                    systemIntake: {
                      __typename: 'SystemIntake',
                      id: validUUID,
                      step: 'DRAFT_BUSINESS_CASE',
                      itGovTaskStatuses: {
                        __typename: 'ITGovTaskStatuses',
                        intakeFormStatus: 'COMPLETED',
                        feedbackFromInitialReviewStatus: 'COMPLETED',
                        bizCaseDraftStatus: 'COMPLETED',
                        grtMeetingStatus: 'COMPLETED',
                        bizCaseFinalStatus: 'COMPLETED',
                        grbMeetingStatus: 'COMPLETED',
                        decisionAndNextStepsStatus: 'COMPLETED'
                      }
                    }
                  }
                }
              }
            ]}
          >
            <Route path="/business/:businessCaseId/:formPage">
              <BusinessCase />
            </Route>
          </VerboseMockedProvider>
        </Provider>
      </MemoryRouter>
    );

    // BusinessCase starts by rendering PageLoading while it fetches data
    if (screen.queryByTestId('page-loading')) {
      await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));
    }

    // location href should NOT be set
    expect(window.location.href).toBe('');
  });
});
