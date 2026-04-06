import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import {
  GetGovernanceTaskListDocument,
  GetSystemIntakeContactsDocument
} from 'gql/generated/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';
import configureMockStore from 'redux-mock-store';
import { Mock, vi } from 'vitest';

import { businessCaseInitialData } from 'data/businessCase';
import { BusinessCaseState } from 'types/businessCase';
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
  default: vi.fn((id?: string) =>
    id ? `https://example.com/intake/${id}` : 'https://example.com/generic'
  )
}));

describe('PowerPlatformRedirect', () => {
  const originalLocation = window.location;
  const mockStore = configureMockStore();

  const createBusinessCaseState = (
    overrides: Partial<BusinessCaseState> = {}
  ): BusinessCaseState => ({
    form: {
      ...businessCaseInitialData,
      systemIntakeId: validUUID,
      id: '75746af8-9a9b-4558-a375-cf9848eb2b0d'
    },
    isLoading: false,
    isSaving: false,
    error: null,
    ...overrides
  });

  const createStore = (
    businessCaseOverrides: Partial<BusinessCaseState> = {}
  ) =>
    mockStore({
      auth: {
        euaId: 'ADMI',
        name: 'Admin',
        isUserSet: true,
        groups: []
      },
      businessCase: createBusinessCaseState(businessCaseOverrides),
      action: {
        isPosting: false,
        error: null,
        actions: []
      }
    });

  const governanceTaskListMock = {
    request: {
      query: GetGovernanceTaskListDocument,
      variables: { id: validUUID }
    },
    result: {
      data: {
        systemIntake: {
          __typename: 'SystemIntake',
          id: validUUID,
          contractName: null,
          decisionState: null,
          grbDate: null,
          grtDate: null,
          lcid: null,
          lcidRetiresAt: null,
          relationType: null,
          requestType: null,
          requestName: 'Test Intake',
          state: null,
          statusAdmin: null,
          step: 'DRAFT_BUSINESS_CASE',
          submittedAt: null,
          updatedAt: null,
          businessCase: {
            __typename: 'BusinessCase',
            id: '75746af8-9a9b-4558-a375-cf9848eb2b0d'
          },
          contractNumbers: [],
          governanceRequestFeedbacks: [],
          itGovTaskStatuses: {
            __typename: 'ITGovTaskStatuses',
            intakeFormStatus: 'COMPLETED',
            feedbackFromInitialReviewStatus: 'COMPLETED',
            bizCaseDraftStatus: 'COMPLETED',
            grtMeetingStatus: 'COMPLETED',
            bizCaseFinalStatus: 'COMPLETED',
            grbMeetingStatus: 'COMPLETED',
            decisionAndNextStepsStatus: 'COMPLETED'
          },
          grbReviewType: null,
          grbReviewStartedAt: null,
          grbReviewAsyncEndDate: null,
          grbReviewAsyncManualEndDate: null,
          grbReviewAsyncRecordingTime: null,
          doesNotSupportSystems: null,
          systems: [],
          grbPresentationLinks: [],
          requester: {
            __typename: 'SystemIntakeRequester',
            userAccount: {
              __typename: 'UserAccount',
              username: 'ADMI'
            }
          }
        }
      }
    }
  };

  const systemIntakeContactsMock = {
    request: {
      query: GetSystemIntakeContactsDocument,
      variables: { id: validUUID }
    },
    result: {
      data: {
        systemIntakeContacts: {
          __typename: 'SystemIntakeContacts',
          requester: {
            __typename: 'SystemIntakeContact',
            systemIntakeId: validUUID,
            id: 'requester-contact-id',
            component: 'Requester',
            roles: [],
            isRequester: true,
            createdAt: '2024-01-01',
            userAccount: {
              __typename: 'UserAccount',
              id: 'requester-user-id',
              username: 'ADMI',
              commonName: 'Admin User',
              email: 'admin@example.com'
            }
          },
          businessOwners: [],
          productManagers: [],
          additionalContacts: [],
          allContacts: []
        }
      }
    }
  };

  const renderBusinessCase = ({
    businessCaseOverrides,
    initialEntry = `/business/75746af8-9a9b-4558-a375-cf9848eb2b0d/view`,
    mocks = [],
    locationState
  }: {
    businessCaseOverrides?: Partial<BusinessCaseState>;
    initialEntry?: string;
    mocks?: any[];
    locationState?: Record<string, unknown>;
  }) =>
    render(
      <MemoryRouter
        initialEntries={[
          locationState
            ? { pathname: initialEntry, state: locationState }
            : initialEntry
        ]}
      >
        <Provider store={createStore(businessCaseOverrides)}>
          <VerboseMockedProvider mocks={mocks}>
            <Route path="/business/:businessCaseId/:formPage">
              <BusinessCase />
            </Route>
          </VerboseMockedProvider>
        </Provider>
      </MemoryRouter>
    );

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

  it('renders loader and sets window.location.href when flag enabled and path has intake id', () => {
    (useFlags as Mock).mockReturnValue({
      enablePowerPlatform: true
    });
    (powerPlatformLink as Mock).mockReturnValue('https://example.com');

    render(
      <MemoryRouter initialEntries={[`/it-governance/${validUUID}`]}>
        <Provider store={createStore()}>
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
        <Provider store={createStore()}>
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
        <Provider store={createStore()}>
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
        <Provider store={createStore()}>
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

  it('shows loading and does not redirect yet for an unresolved existing BusinessCase', async () => {
    (useFlags as Mock).mockReturnValue({
      enablePowerPlatform: true
    });

    renderBusinessCase({
      businessCaseOverrides: {
        form: businessCaseInitialData,
        isLoading: null,
        isSaving: false,
        error: null
      }
    });

    expect(screen.getByTestId('page-loading')).toBeInTheDocument();
    await waitFor(() => {
      expect(window.location.href).toBe('');
    });
    expect(powerPlatformLink).not.toHaveBeenCalled();
  });

  it('redirects to the intake-specific URL after an existing BusinessCase resolves', async () => {
    (useFlags as Mock).mockReturnValue({
      enablePowerPlatform: true
    });

    renderBusinessCase({
      businessCaseOverrides: {
        form: {
          ...businessCaseInitialData,
          systemIntakeId: validUUID,
          id: '75746af8-9a9b-4558-a375-cf9848eb2b0d'
        },
        isLoading: false,
        isSaving: false,
        error: null
      },
      mocks: [governanceTaskListMock]
    });

    expect(screen.getByTestId('page-loading')).toBeInTheDocument();
    await waitFor(() => {
      expect(window.location.href).toBe(
        `https://example.com/intake/${validUUID}`
      );
    });
    expect(powerPlatformLink).toHaveBeenCalledWith(validUUID);
  });

  it('redirects to the generic URL when an existing BusinessCase resolves without a valid intake id', async () => {
    (useFlags as Mock).mockReturnValue({
      enablePowerPlatform: true
    });

    renderBusinessCase({
      businessCaseOverrides: {
        form: {
          ...businessCaseInitialData,
          systemIntakeId: '',
          id: '75746af8-9a9b-4558-a375-cf9848eb2b0d'
        },
        isLoading: false,
        isSaving: false,
        error: null
      }
    });

    expect(screen.getByTestId('page-loading')).toBeInTheDocument();
    await waitFor(() => {
      expect(window.location.href).toBe('https://example.com/generic');
    });
    expect(powerPlatformLink).toHaveBeenCalledWith(undefined);
  });

  it('shows loading and does not redirect yet for a new BusinessCase while create is pending', async () => {
    (useFlags as Mock).mockReturnValue({
      enablePowerPlatform: true
    });

    renderBusinessCase({
      businessCaseOverrides: {
        form: businessCaseInitialData,
        isLoading: null,
        isSaving: true,
        error: null
      },
      initialEntry: '/business/new/view',
      locationState: {
        systemIntakeId: validUUID
      }
    });

    expect(screen.getByTestId('page-loading')).toBeInTheDocument();
    await waitFor(() => {
      expect(window.location.href).toBe('');
    });
    expect(powerPlatformLink).not.toHaveBeenCalled();
  });

  it('redirects a new BusinessCase to the intake-specific URL after creation resolves', async () => {
    (useFlags as Mock).mockReturnValue({
      enablePowerPlatform: true
    });

    renderBusinessCase({
      businessCaseOverrides: {
        form: {
          ...businessCaseInitialData,
          systemIntakeId: validUUID,
          id: '75746af8-9a9b-4558-a375-cf9848eb2b0d'
        },
        isLoading: null,
        isSaving: false,
        error: null
      },
      initialEntry: '/business/new/view',
      locationState: {
        systemIntakeId: validUUID
      },
      mocks: [governanceTaskListMock]
    });

    expect(screen.getByTestId('page-loading')).toBeInTheDocument();
    await waitFor(() => {
      expect(window.location.href).toBe(
        `https://example.com/intake/${validUUID}`
      );
    });
    expect(powerPlatformLink).toHaveBeenCalledWith(validUUID);
  });

  it('falls back to the generic URL when BusinessCase fetch has failed', async () => {
    (useFlags as Mock).mockReturnValue({
      enablePowerPlatform: true
    });

    renderBusinessCase({
      businessCaseOverrides: {
        form: businessCaseInitialData,
        isLoading: false,
        isSaving: false,
        error: 'fetch failed'
      }
    });

    expect(screen.getByTestId('page-loading')).toBeInTheDocument();
    await waitFor(() => {
      expect(window.location.href).toBe('https://example.com/generic');
    });
    expect(powerPlatformLink).toHaveBeenCalledWith(undefined);
  });

  it('renders BusinessCase when flag is disabled', async () => {
    (useFlags as Mock).mockReturnValue({
      enablePowerPlatform: false
    });
    renderBusinessCase({
      businessCaseOverrides: {
        form: {
          ...businessCaseInitialData,
          systemIntakeId: validUUID,
          id: '75746af8-9a9b-4558-a375-cf9848eb2b0d'
        },
        isLoading: false,
        isSaving: false,
        error: null
      },
      mocks: [governanceTaskListMock, systemIntakeContactsMock]
    });

    await waitFor(() => {
      expect(screen.getByText('Review your Business Case')).toBeInTheDocument();
    });
    expect(window.location.href).toBe('');
    expect(powerPlatformLink).not.toHaveBeenCalled();
  });
});
