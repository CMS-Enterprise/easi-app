import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import {
  SystemIntakeDecisionState,
  SystemIntakeLCIDStatus,
  SystemIntakeTRBFollowUp
} from 'gql/generated/graphql';
import i18next from 'i18next';

import { getByRoleWithNameTextKey } from 'utils/testing/helpers';

import Decision from './index';

// Mock RichTextViewer to render plain text for testing
vi.mock('components/RichTextEditor', () => ({
  RichTextViewer: ({ value }: { value: string }) => (
    <div data-testid="rich-text-viewer">{value}</div>
  )
}));

// Deterministic dates in assertions
vi.mock('utils/date', () => ({
  formatDateLocal: () => '09/29/2025'
})); // default export from your file

const routePath = '/grt/decision';
const routeFor = () => routePath;

const renderWith = (ui: React.ReactNode) =>
  render(
    <MemoryRouter initialEntries={[routeFor()]}>
      <Route path={routePath}>{ui}</Route>
    </MemoryRouter>
  );

describe('Decision component', () => {
  it('renders NO_DECISION state with CTA', () => {
    renderWith(
      <Decision decisionState={SystemIntakeDecisionState.NO_DECISION} />
    );

    // Page h1
    screen.getByRole('heading', {
      level: 1,
      name: i18next.t<string>('governanceReviewTeam:decision.heading')
    });

    // Subheading text
    screen.getByText(
      i18next.t<string>('governanceReviewTeam:decision.subheading')
    );

    // "Issue decision" button link
    getByRoleWithNameTextKey(
      'link',
      'governanceReviewTeam:decision.issueDecisionButton'
    );
  });

  it('renders LCID_ISSUED state with LCID info, next steps and TRB section', () => {
    renderWith(
      <Decision
        decisionState={SystemIntakeDecisionState.LCID_ISSUED}
        // DecisionProvider props (used via context)
        decidedAt="2025-09-29T00:00:00Z"
        lcid="E-12345"
        lcidIssuedAt="2025-09-20T00:00:00Z"
        lcidExpiresAt="2026-09-20T00:00:00Z"
        lcidRetiresAt={null}
        lcidScope="This is the scope"
        lcidCostBaseline="$1.2M over 3 years"
        lcidStatus={SystemIntakeLCIDStatus.ISSUED}
        rejectionReason={null}
        decisionNextSteps="Do the thing"
        trbFollowUpRecommendation={SystemIntakeTRBFollowUp.NOT_RECOMMENDED}
      />
    );

    // Banner shows state-specific text
    screen.getByText(
      i18next.t<string>('governanceReviewTeam:decision.decisionState', {
        context: SystemIntakeDecisionState.LCID_ISSUED
      })
    );

    // LCID info header
    screen.getByRole('heading', {
      level: 3,
      name: i18next.t<string>('governanceReviewTeam:decision.lcidInfoHeader')
    });

    // LCID number term/value
    screen.getByText(
      i18next.t<string>('governanceReviewTeam:decision.terms.lcidNumber')
    );
    screen.getByText('E-12345');

    // Issue date term/value
    screen.getByText(
      i18next.t<string>('governanceReviewTeam:decision.terms.issueDate')
    );
    screen.getAllByText('09/29/2025'); // from mocked formatter, appears multiple times

    // Expiration date is shown for ISSUED tag
    screen.getByText(
      i18next.t<string>('governanceReviewTeam:decision.terms.expirationDate')
    );

    // Scope and cost baseline
    screen.getByText(
      i18next.t<string>('governanceReviewTeam:decision.terms.scope')
    );
    screen.getByText('This is the scope');

    screen.getByText(
      i18next.t<string>(
        'governanceReviewTeam:decision.terms.projectCostBaseline'
      )
    );
    screen.getByText('$1.2M over 3 years');

    // Next steps term + provided content
    screen.getByText(
      i18next.t<string>('governanceReviewTeam:decision.terms.nextSteps')
    );
    screen.getByText('Do the thing');

    // TRB follow-up term + mapped recommendation string
    screen.getByText(
      i18next.t<string>('governanceReviewTeam:decision.terms.consultTRB')
    );
    screen.getByText(
      i18next.t<string>('action:issueLCID.trbFollowup.NOT_RECOMMENDED')
    );
  });

  it('renders NOT_APPROVED with decision date and rejection reason, and shows Next Steps block (fallback)', () => {
    renderWith(
      <Decision
        decisionState={SystemIntakeDecisionState.NOT_APPROVED}
        decidedAt="2025-09-29T00:00:00Z"
        rejectionReason="Not aligned with priorities"
        // unused LCID props are safe to omit or set null
        lcid={null}
        lcidIssuedAt={null}
        lcidExpiresAt={null}
        lcidRetiresAt={null}
        lcidScope={null}
        lcidCostBaseline={null}
        lcidStatus={null}
        decisionNextSteps={null}
        trbFollowUpRecommendation={null}
      />
    );

    // Banner text for NOT_APPROVED
    screen.getByText(
      i18next.t<string>('governanceReviewTeam:decision.decisionState', {
        context: SystemIntakeDecisionState.NOT_APPROVED
      })
    );

    // Decision date term/value
    screen.getByText(
      i18next.t<string>('governanceReviewTeam:decision.decisionDate')
    );
    screen.getByText('09/29/2025');

    // Reason term/value
    screen.getByText(i18next.t<string>('governanceReviewTeam:decision.reason'));
    screen.getByText('Not aligned with priorities');

    // Because decisionState !== NOT_GOVERNANCE, the Next Steps dl renders with fallback
    screen.getByText(
      i18next.t<string>('governanceReviewTeam:decision.terms.nextSteps')
    );

    // Check for the fallback text in the mocked RichTextViewer
    screen.getByText(
      i18next.t<string>('governanceReviewTeam:notes.extendLcid.noNextSteps')
    );
  });

  it('hides Next Steps when NOT_GOVERNANCE', () => {
    renderWith(
      <Decision
        decisionState={SystemIntakeDecisionState.NOT_GOVERNANCE}
        decidedAt="2025-09-29T00:00:00Z"
        rejectionReason="Outside of IT Governance"
        lcid={null}
        lcidIssuedAt={null}
        lcidExpiresAt={null}
        lcidRetiresAt={null}
        lcidScope={null}
        lcidCostBaseline={null}
        lcidStatus={null}
        decisionNextSteps="Should not show"
        trbFollowUpRecommendation={null}
      />
    );

    // Banner text for NOT_GOVERNANCE
    screen.getByText(
      i18next.t<string>('governanceReviewTeam:decision.decisionState', {
        context: SystemIntakeDecisionState.NOT_GOVERNANCE
      })
    );

    // Decision date + reason block (non-LCID path)
    screen.getByText(
      i18next.t<string>('governanceReviewTeam:decision.decisionDate')
    );
    screen.getByText(i18next.t<string>('governanceReviewTeam:decision.reason'));

    // Next Steps should not render at all for NOT_GOVERNANCE
    expect(
      screen.queryByText(
        i18next.t<string>('governanceReviewTeam:decision.terms.nextSteps')
      )
    ).toBeNull();
  });

  it('shows retirement date instead of expiration when LCID is RETIRED', () => {
    renderWith(
      <Decision
        decisionState={SystemIntakeDecisionState.LCID_ISSUED}
        decidedAt="2025-09-29T00:00:00Z"
        lcid="E-12345"
        lcidIssuedAt="2025-01-01T00:00:00Z"
        lcidExpiresAt="2026-01-01T00:00:00Z"
        lcidRetiresAt="2025-12-31T00:00:00Z"
        lcidScope="scope"
        lcidCostBaseline="$1"
        lcidStatus={SystemIntakeLCIDStatus.RETIRED}
        rejectionReason={null}
        decisionNextSteps="Next"
        trbFollowUpRecommendation={null}
      />
    );

    // Retirement date term visible
    screen.getByText(
      i18next.t<string>('governanceReviewTeam:decision.terms.retirementDate')
    );

    // Expiration term should NOT be visible for RETIRED
    expect(
      screen.queryByText(
        i18next.t<string>('governanceReviewTeam:decision.terms.expirationDate')
      )
    ).toBeNull();
  });

  it('shows planned retirement date when LCID is RETIRING_SOON', () => {
    renderWith(
      <Decision
        decisionState={SystemIntakeDecisionState.LCID_ISSUED}
        decidedAt="2025-09-29T00:00:00Z"
        lcid="E-12345"
        lcidIssuedAt="2025-01-01T00:00:00Z"
        lcidExpiresAt="2026-01-01T00:00:00Z"
        lcidRetiresAt="2025-12-01T00:00:00Z"
        lcidScope="scope"
        lcidCostBaseline="$1"
        lcidStatus={SystemIntakeLCIDStatus.ISSUED}
        rejectionReason={null}
        decisionNextSteps="Next"
        trbFollowUpRecommendation={null}
      />
    );

    // Planned retirement date term visible
    screen.getByText(
      i18next.t<string>(
        'governanceReviewTeam:decision.terms.plannedRetirementDate'
      )
    );

    // Expiration term should NOT be visible when RETIRING_SOON
    expect(
      screen.queryByText(
        i18next.t<string>('governanceReviewTeam:decision.terms.expirationDate')
      )
    ).toBeNull();
  });
});
