import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import { Button, Link as UswdsLink } from '@trussworks/react-uswds';

import { isIntakeStarted } from 'data/systemIntake';
import { attendGrbMeetingTag } from 'data/taskList';
import { SystemIntakeForm } from 'types/systemIntake';

// CTA for Task List Intake Draft
export const IntakeDraftCta = ({ intake }: { intake: SystemIntakeForm }) => {
  switch (intake.status) {
    case 'INTAKE_SUBMITTED':
      return (
        <UswdsLink
          data-testid="intake-view-link"
          asCustom={Link}
          to={`/system/${intake.id}/view`}
        >
          View Submitted Request Form
        </UswdsLink>
      );
    case 'INTAKE_DRAFT':
      if (isIntakeStarted(intake)) {
        return (
          <UswdsLink
            className="usa-button"
            variant="unstyled"
            asCustom={Link}
            to={`/system/${intake.id}/contact-details`}
          >
            Continue
          </UswdsLink>
        );
      }
      return (
        <UswdsLink
          data-testid="intake-start-btn"
          className="usa-button"
          variant="unstyled"
          asCustom={Link}
          to={`/system/${intake.id || 'new'}/contact-details`}
        >
          Start
        </UswdsLink>
      );
    default:
      return (
        <UswdsLink
          data-testid="intake-view-link"
          asCustom={Link}
          to={`/system/${intake.id}/view`}
        >
          View Submitted Request Form
        </UswdsLink>
      );
  }
};

// CTA for Task List Business Case Draft
export const BusinessCaseDraftCta = ({
  systemIntake
}: {
  systemIntake: SystemIntakeForm;
}) => {
  const history = useHistory();
  switch (systemIntake.status) {
    case 'NEED_BIZ_CASE':
      return (
        <Button
          type="button"
          onClick={() => {
            history.push({
              pathname: '/business/new/general-request-info',
              state: {
                systemIntakeId: systemIntake.id
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
        <UswdsLink
          data-testid="continue-biz-case-btn"
          className="usa-button"
          variant="unstyled"
          asCustom={Link}
          to={`/business/${systemIntake.businessCaseId}/general-request-info`}
        >
          Continue
        </UswdsLink>
      );
    case 'BIZ_CASE_DRAFT_SUBMITTED':
    case 'BIZ_CASE_FINAL_NEEDED':
    case 'READY_FOR_GRB':
    case 'LCID_ISSUED':
    case 'NOT_IT_REQUEST':
    case 'NOT_APPROVED':
    case 'NO_GOVERNANCE':
    case 'WITHDRAWN':
      if (systemIntake.businessCaseId) {
        return (
          <UswdsLink
            data-testid="view-biz-case-link"
            asCustom={Link}
            to={`/business/${systemIntake.businessCaseId}/view`}
          >
            View submitted business case
          </UswdsLink>
        );
      }
      return <></>;
    case 'BIZ_CASE_CHANGES_NEEDED':
      return (
        <UswdsLink
          data-testid="update-biz-case-draft-btn"
          className="usa-button"
          variant="unstyled"
          asCustom={Link}
          to={`/business/${systemIntake.businessCaseId}/general-request-info`}
        >
          Update draft business case
        </UswdsLink>
      );
    case 'READY_FOR_GRT':
      return (
        <>
          <UswdsLink
            data-testid="prepare-for-grt-cta"
            className="display-table margin-bottom-3 usa-button"
            variant="unstyled"
            asCustom={Link}
            to={`/governance-task-list/${systemIntake.businessCaseId}/prepare-for-grt`}
          >
            Prepare for review team meeting
          </UswdsLink>

          <UswdsLink
            data-testid="view-biz-case-cta"
            asCustom={Link}
            to={`/business/${systemIntake.businessCaseId}/general-request-info`}
          >
            Update submitted draft business case
          </UswdsLink>
        </>
      );
    default:
      return <></>;
  }
};

// CTA for Task List GRB Meeting
export const AttendGrbMeetingCta = ({
  intake
}: {
  intake: SystemIntakeForm;
}) => {
  if (intake.status === 'READY_FOR_GRB') {
    return (
      <UswdsLink
        data-testid="prepare-for-grb-btn"
        className="usa-button"
        variant="unstyled"
        asCustom={Link}
        to={`/governance-task-list/${intake.id}/prepare-for-grb`}
      >
        Prepare for the Review Board meeting
      </UswdsLink>
    );
  }

  if (attendGrbMeetingTag(intake) === 'COMPLETED') {
    return (
      <UswdsLink
        data-testid="prepare-for-grb-link"
        asCustom={Link}
        to={`/governance-task-list/${intake.id}/prepare-for-grb`}
      >
        Prepare for the Review Board meeting
      </UswdsLink>
    );
  }

  return <></>;
};

// CTA for Task List Decision
export const DecisionCta = ({ intake }: { intake: SystemIntakeForm }) => {
  const { t } = useTranslation();
  if (['LCID_ISSUED', 'NOT_APPROVED'].includes(intake.status)) {
    return (
      <UswdsLink
        data-testid="decision-cta"
        className="usa-button"
        variant="unstyled"
        asCustom={Link}
        to={`/governance-task-list/${intake.id}/request-decision`}
      >
        Read decision from board
      </UswdsLink>
    );
  }

  if (intake.status === 'NOT_IT_REQUEST') {
    return (
      <span>
        <b>Decision: </b>
        {t('taskList:decision.notItRequest')}
      </span>
    );
  }

  if (intake.status === 'NO_GOVERNANCE') {
    return (
      <span>
        <b>Decision: </b>
        {t('taskList:decision.noGovernanceNeeded')}
      </span>
    );
  }

  return <></>;
};
