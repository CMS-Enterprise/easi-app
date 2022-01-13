import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import { isIntakeStarted } from 'data/systemIntake';
import { attendGrbMeetingTag } from 'data/taskList';
import { GetSystemIntake_systemIntake as SystemIntake } from 'queries/types/GetSystemIntake';

// CTA for Task List Intake Draft
export const IntakeDraftCta = ({ intake }: { intake: SystemIntake }) => {
  const { id, status } = intake || {};
  switch (status) {
    case 'INTAKE_SUBMITTED':
      return (
        <UswdsReactLink
          data-testid="intake-view-link"
          link={`/system/${id}/view`}
        >
          View Submitted Request Form
        </UswdsReactLink>
      );
    case 'INTAKE_DRAFT':
      if (isIntakeStarted(intake)) {
        return (
          <UswdsReactLink
            className="usa-button"
            variant="unstyled"
            link={`/system/${id}/contact-details`}
          >
            Continue
          </UswdsReactLink>
        );
      }
      return (
        <UswdsReactLink
          data-testid="intake-start-btn"
          className="usa-button"
          variant="unstyled"
          link={`/system/${id || 'new'}/contact-details`}
        >
          Start
        </UswdsReactLink>
      );
    default:
      return (
        <UswdsReactLink
          data-testid="intake-view-link"
          link={`/system/${id}/view`}
        >
          View Submitted Request Form
        </UswdsReactLink>
      );
  }
};

// CTA for Task List Business Case Draft
export const BusinessCaseDraftCta = ({
  systemIntake
}: {
  systemIntake: SystemIntake;
}) => {
  const { id, status, businessCaseId } = systemIntake || {};
  const history = useHistory();
  switch (status) {
    case 'NEED_BIZ_CASE':
      return (
        <Button
          type="button"
          onClick={() => {
            history.push({
              pathname: '/business/new/general-request-info',
              state: {
                systemIntakeId: id
              }
            });
          }}
          className="usa-button"
          data-testid="start-biz-case-btn"
        >
          Start
        </Button>
      );
    case 'BIZ_CASE_DRAFT':
      return (
        <UswdsReactLink
          data-testid="continue-biz-case-btn"
          className="usa-button"
          variant="unstyled"
          link={`/business/${businessCaseId}/general-request-info`}
        >
          Continue
        </UswdsReactLink>
      );
    case 'BIZ_CASE_DRAFT_SUBMITTED':
    case 'BIZ_CASE_FINAL_NEEDED':
    case 'READY_FOR_GRB':
    case 'LCID_ISSUED':
    case 'NOT_IT_REQUEST':
    case 'NOT_APPROVED':
    case 'NO_GOVERNANCE':
    case 'WITHDRAWN':
      if (businessCaseId) {
        return (
          <UswdsReactLink
            data-testid="view-biz-case-link"
            link={`/business/${businessCaseId}/view`}
          >
            View submitted business case
          </UswdsReactLink>
        );
      }
      return <></>;
    case 'BIZ_CASE_CHANGES_NEEDED':
      return (
        <UswdsReactLink
          data-testid="update-biz-case-draft-btn"
          className="usa-button"
          variant="unstyled"
          link={`/business/${businessCaseId}/general-request-info`}
        >
          Update draft business case
        </UswdsReactLink>
      );
    case 'READY_FOR_GRT':
      return (
        <>
          <UswdsReactLink
            data-testid="prepare-for-grt-cta"
            className="display-table margin-bottom-3 usa-button"
            variant="unstyled"
            link={`/governance-task-list/${businessCaseId}/prepare-for-grt`}
          >
            Prepare for review team meeting
          </UswdsReactLink>

          <UswdsReactLink
            data-testid="view-biz-case-cta"
            link={`/business/${businessCaseId}/general-request-info`}
          >
            Update submitted draft business case
          </UswdsReactLink>
        </>
      );
    default:
      return <></>;
  }
};

// CTA for Task List GRB Meeting
export const AttendGrbMeetingCta = ({ intake }: { intake: SystemIntake }) => {
  const { id, status } = intake || {};
  if (status === 'READY_FOR_GRB') {
    return (
      <UswdsReactLink
        data-testid="prepare-for-grb-btn"
        className="usa-button"
        variant="unstyled"
        link={`/governance-task-list/${id}/prepare-for-grb`}
      >
        Prepare for the Review Board meeting
      </UswdsReactLink>
    );
  }

  if (attendGrbMeetingTag(intake) === 'COMPLETED') {
    return (
      <UswdsReactLink
        data-testid="prepare-for-grb-link"
        link={`/governance-task-list/${id}/prepare-for-grb`}
      >
        Prepare for the Review Board meeting
      </UswdsReactLink>
    );
  }

  return <></>;
};

// CTA for Task List Decision
export const DecisionCta = ({ id, status }: { id: string; status: string }) => {
  const { t } = useTranslation();
  if (['LCID_ISSUED', 'NOT_APPROVED'].includes(status)) {
    return (
      <UswdsReactLink
        data-testid="decision-cta"
        className="usa-button"
        variant="unstyled"
        link={`/governance-task-list/${id}/request-decision`}
      >
        Read decision from board
      </UswdsReactLink>
    );
  }

  if (status === 'NOT_IT_REQUEST') {
    return (
      <span data-testid="plain-text-not-it-request-decision">
        <b>Decision:&nbsp;</b>
        {t('taskList:decision.notItRequest')}
      </span>
    );
  }

  if (status === 'NO_GOVERNANCE') {
    return (
      <span data-testid="plain-text-no-governance-decision">
        <b>Decision:&nbsp;</b>
        {t('taskList:decision.noGovernanceNeeded')}
      </span>
    );
  }

  return <></>;
};
