import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { Mock, vi } from 'vitest';

import { AppRoutes } from './index';

vi.mock('react-ga4', () => ({
  default: {
    send: vi.fn()
  }
}));

vi.mock('@okta/okta-react', () => ({
  LoginCallback: () => <div>LoginCallback</div>,
  SecureRoute: ({
    component: Component,
    render: routeRender,
    children,
    ...props
  }: any) => {
    if (Component) {
      return (
        <Route
          {...props}
          render={routeProps => <Component {...routeProps} />}
        />
      );
    }

    if (routeRender) {
      return <Route {...props} render={routeRender} />;
    }

    return <Route {...props}>{children}</Route>;
  }
}));

vi.mock('@trussworks/react-uswds', () => ({
  GovBanner: () => <div>GovBanner</div>,
  GridContainer: ({ children }: any) => <div>{children}</div>
}));

vi.mock('launchdarkly-react-client-sdk', () => ({
  useFlags: vi.fn()
}));

vi.mock('features/Help', () => ({ default: () => <div>Help</div> }));
vi.mock('features/Home', () => ({ default: () => <div>Home</div> }));
vi.mock('features/Home/MyRequests', () => ({
  default: () => <div>MyRequests</div>
}));
vi.mock('features/ITGovernance/Admin', () => ({
  default: () => <div>GovernanceReviewTeam</div>
}));
vi.mock('features/ITGovernance/Home', () => ({
  default: () => <div>MakingARequest</div>
}));
vi.mock('features/ITGovernance/Requester/BusinessCase', () => ({
  default: () => <div>BusinessCase</div>
}));
vi.mock('features/ITGovernance/Requester/GovernanceOverview', () => ({
  default: () => <div>GovernanceOverview</div>
}));
vi.mock('features/ITGovernance/Requester/PrepareForGRB', () => ({
  default: () => <div>PrepareForGRB</div>
}));
vi.mock('features/ITGovernance/Requester/PrepareForGRT', () => ({
  default: () => <div>PrepareForGRT</div>
}));
vi.mock('features/ITGovernance/Requester/SystemIntake', () => ({
  default: () => <div>SystemIntake</div>
}));
vi.mock('features/ITGovernance/Requester/TaskList', () => ({
  default: () => <div>GovernanceTaskList</div>
}));
vi.mock('features/ITGovernance/Requester/TaskList/Feedback', () => ({
  default: () => <div>GovernanceFeedback</div>
}));
vi.mock('features/ITGovernance/Requester/TaskList/LcidInfo', () => ({
  default: () => <div>LcidInfo</div>
}));
vi.mock(
  'features/ITGovernance/Requester/TaskList/PresentationDeckUpload',
  () => ({
    default: () => <div>PresentationDeckUpload</div>
  })
);
vi.mock('features/ITGovernance/Requester/TaskList/RequestDecision', () => ({
  default: () => <div>RequestDecision</div>
}));
vi.mock('features/LinkedSystems', () => ({
  default: () => <div>LinkedSystems</div>
}));
vi.mock('features/LinkedSystems/LinkedSystemsForm', () => ({
  default: () => <div>LinkedSystemsForm</div>
}));
vi.mock('features/Login', () => ({ default: () => <div>Login</div> }));
vi.mock('features/Miscellaneous/AccessibilityStatement', () => ({
  default: () => <div>AccessibilityStatement</div>
}));
vi.mock('features/Miscellaneous/Cookies', () => ({
  default: () => <div>Cookies</div>
}));
vi.mock('features/Miscellaneous/Navigation', () => ({
  default: ({ children }: any) => <div>{children}</div>
}));
vi.mock('features/Miscellaneous/NotFound', () => ({
  default: () => <div>NotFound</div>
}));
vi.mock('features/Miscellaneous/PrivacyPolicy', () => ({
  default: () => <div>PrivacyPolicy</div>
}));
vi.mock('features/Miscellaneous/TermsAndConditions', () => ({
  default: () => <div>TermsAndConditions</div>
}));
vi.mock('features/Miscellaneous/User', () => ({
  default: () => <div>UserInfo</div>
}));
vi.mock('features/RequestLinking/RequestLinkForm', () => ({
  default: () => <div>RequestLinkForm</div>
}));
vi.mock('features/RequestLinking/RequestTypeForm', () => ({
  default: () => <div>RequestTypeForm</div>
}));
vi.mock('features/Systems/EditSystemProfile', () => ({
  default: () => <div>EditSystemProfile</div>
}));
vi.mock('features/Systems/Home', () => ({
  default: () => <div>SystemList</div>
}));
vi.mock('features/Systems/SystemProfile', () => ({
  default: () => <div>SystemProfile</div>
}));
vi.mock('features/Systems/SystemWorkspace', () => ({
  SystemWorkspace: () => <div>SystemWorkspace</div>
}));
vi.mock('features/Systems/SystemWorkspace/SystemWorkspaceRequests', () => ({
  default: () => <div>SystemWorkspaceRequests</div>
}));
vi.mock('features/TechnicalAssistance/Routes', () => ({
  default: () => <div>TechnicalAssistance</div>
}));

vi.mock('wrappers/AuthenticationWrapper', () => ({
  default: ({ children }: any) => <div>{children}</div>
}));
vi.mock('wrappers/FlagsWrapper', () => ({
  default: ({ children }: any) => <div>{children}</div>
}));
vi.mock('wrappers/TableStateWrapper', () => ({
  default: ({ children }: any) => <div>{children}</div>
}));
vi.mock('wrappers/TimeOutWrapper', () => ({
  default: ({ children }: any) => <div>{children}</div>
}));
vi.mock('wrappers/UserInfoWrapper', () => ({
  default: ({ children }: any) => <div>{children}</div>
}));

vi.mock('components/CedarAlertBanner', () => ({
  default: () => <div>CedarAlertBanner</div>
}));
vi.mock('components/Footer', () => ({ default: () => <div>Footer</div> }));
vi.mock('components/Header', () => ({ default: () => <div>Header</div> }));
vi.mock('components/MainContent', () => ({
  default: ({ children }: any) => <div>{children}</div>
}));
vi.mock('components/PageWrapper', () => ({
  default: ({ children }: any) => <div>{children}</div>
}));

vi.mock('hooks/useMessage', () => ({
  MessageProvider: ({ children }: any) => <div>{children}</div>
}));

vi.mock('../../features/ITGovernance/Wrapper/PowerPlatformRedirect', () => ({
  default: () => <div>PowerPlatformRedirect</div>
}));
vi.mock('../../features/Systems/Wrapper/SystemIDWrapper', () => ({
  default: ({ children }: any) => <div>{children}</div>
}));
vi.mock('../../utils/scrollConfig', () => ({
  default: vi.fn(() => false)
}));

describe('AppRoutes Power Platform routing', () => {
  beforeEach(() => {
    (window.scrollTo as any) = vi.fn();
  });

  const renderRoutes = (path: string, flags: Record<string, boolean>) => {
    (useFlags as Mock).mockReturnValue(flags);

    return render(
      <MemoryRouter initialEntries={[path]}>
        <AppRoutes />
      </MemoryRouter>
    );
  };

  it('routes /system/request-type to PowerPlatformRedirect when the flag is on', () => {
    renderRoutes('/system/request-type', {
      enablePowerPlatform: true,
      systemWorkspace: false
    });

    expect(screen.getByText('PowerPlatformRedirect')).toBeInTheDocument();
    expect(screen.queryByText('RequestTypeForm')).not.toBeInTheDocument();
  });

  it('routes /system/request-type to RequestTypeForm when the flag is off', () => {
    renderRoutes('/system/request-type', {
      enablePowerPlatform: false,
      systemWorkspace: false
    });

    expect(screen.getByText('RequestTypeForm')).toBeInTheDocument();
    expect(screen.queryByText('PowerPlatformRedirect')).not.toBeInTheDocument();
  });

  it('routes nested governance task list paths to PowerPlatformRedirect when the flag is on', () => {
    renderRoutes(
      '/governance-task-list/550e8400-e29b-41d4-a716-446655440000/feedback',
      {
        enablePowerPlatform: true,
        systemWorkspace: false
      }
    );

    expect(screen.getByText('PowerPlatformRedirect')).toBeInTheDocument();
    expect(screen.queryByText('GovernanceFeedback')).not.toBeInTheDocument();
  });

  it('routes nested governance task list paths to the in-app component when the flag is off', () => {
    renderRoutes(
      '/governance-task-list/550e8400-e29b-41d4-a716-446655440000/feedback',
      {
        enablePowerPlatform: false,
        systemWorkspace: false
      }
    );

    expect(screen.getByText('GovernanceFeedback')).toBeInTheDocument();
    expect(screen.queryByText('PowerPlatformRedirect')).not.toBeInTheDocument();
  });

  it('routes system intake detail pages to PowerPlatformRedirect when the flag is on', () => {
    renderRoutes(
      '/system/550e8400-e29b-41d4-a716-446655440000/contact-details',
      {
        enablePowerPlatform: true,
        systemWorkspace: false
      }
    );

    expect(screen.getByText('PowerPlatformRedirect')).toBeInTheDocument();
    expect(screen.queryByText('SystemIntake')).not.toBeInTheDocument();
  });

  it('does not redirect TRB routes when the flag is on', () => {
    renderRoutes('/trb', {
      enablePowerPlatform: true,
      systemWorkspace: false
    });

    expect(screen.getByText('TechnicalAssistance')).toBeInTheDocument();
    expect(screen.queryByText('PowerPlatformRedirect')).not.toBeInTheDocument();
  });
});
