import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import { isIntakeStarted } from 'data/systemIntake';
import { SystemIntake } from 'queries/types/SystemIntake';

// CTA for Task List Intake Draft
export const IntakeDraftCta = ({ intake }: { intake: SystemIntake }) => {
  const { t } = useTranslation('taskList');
  const { id, status } = intake || {};
  switch (status) {
    case 'INTAKE_SUBMITTED':
      return (
        <UswdsReactLink
          data-testid="intake-view-link"
          to={`/system/${id}/view`}
        >
          {t('cta.viewSubmittedRequest')}
        </UswdsReactLink>
      );
    case 'INTAKE_DRAFT':
      if (isIntakeStarted(intake)) {
        return (
          <UswdsReactLink
            className="usa-button"
            variant="unstyled"
            to={`/system/${id}/contact-details`}
          >
            {t('cta.continue')}
          </UswdsReactLink>
        );
      }
      return (
        <UswdsReactLink
          data-testid="intake-start-btn"
          className="usa-button"
          variant="unstyled"
          to={`/system/${id || 'new'}/contact-details`}
        >
          {t('cta.start')}
        </UswdsReactLink>
      );
    default:
      return (
        <UswdsReactLink
          data-testid="intake-view-link"
          to={`/system/${id}/view`}
        >
          {t('cta.viewSubmittedRequest')}
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
  const { t } = useTranslation('taskList');
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
          className="usa-button margin-top-2"
          data-testid="start-biz-case-btn"
        >
          {t('cta.start')}
        </Button>
      );
    case 'BIZ_CASE_DRAFT':
      return (
        <UswdsReactLink
          data-testid="continue-biz-case-btn"
          className="usa-button margin-top-2"
          variant="unstyled"
          to={`/business/${businessCaseId}/general-request-info`}
        >
          {t('cta.continue')}
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
            className="display-block margin-top-2"
            data-testid="view-biz-case-link"
            to={`/business/${businessCaseId}/view`}
          >
            {t('cta.viewSubmittedBusinessCase')}
          </UswdsReactLink>
        );
      }
      return <></>;
    case 'BIZ_CASE_CHANGES_NEEDED':
      return (
        <UswdsReactLink
          data-testid="update-biz-case-draft-btn"
          className="usa-button margin-top-2"
          variant="unstyled"
          to={`/business/${businessCaseId}/general-request-info`}
        >
          {t('cta.updateDraftBusinessCase')}
        </UswdsReactLink>
      );
    case 'READY_FOR_GRT':
      return (
        <UswdsReactLink
          className="display-block margin-top-2"
          data-testid="view-biz-case-cta"
          to={`/business/${businessCaseId}/general-request-info`}
        >
          {t('cta.updateSubmittedBusinessCase')}
        </UswdsReactLink>
      );
    default:
      return <></>;
  }
};

// CTA for Task List GRB Meeting
export const AttendGrbMeetingCta = ({ intake }: { intake: SystemIntake }) => {
  const { t } = useTranslation('taskList');
  return (
    <UswdsReactLink
      className={`display-inline-block ${
        intake.status === 'READY_FOR_GRB' ? 'usa-button' : ''
      }`}
      target="_blank"
      variant="unstyled"
      data-testid={
        intake.status === 'READY_FOR_GRB'
          ? 'prepare-for-grb-btn'
          : 'prepare-for-grb-link'
      }
      to="/help/it-governance/prepare-for-grb"
    >
      {t('cta.prepareGRB')}
    </UswdsReactLink>
  );
};

// CTA for Task List Decision
export const DecisionCta = ({ id, status }: { id: string; status: string }) => {
  const { t } = useTranslation('taskList');
  if (['LCID_ISSUED', 'NOT_APPROVED'].includes(status)) {
    return (
      <UswdsReactLink
        data-testid="decision-cta"
        className="usa-button"
        variant="unstyled"
        to={`/governance-task-list/${id}/request-decision`}
      >
        {t('cta.readDecision')}
      </UswdsReactLink>
    );
  }

  if (status === 'NOT_IT_REQUEST') {
    return (
      <span data-testid="plain-text-not-it-request-decision">
        <b>{t('decision.decision')}&nbsp;</b>
        {t('decision.notItRequest')}
      </span>
    );
  }

  if (status === 'NO_GOVERNANCE') {
    return (
      <span data-testid="plain-text-no-governance-decision">
        <b>{t('decision.decision')}&nbsp;</b>
        {t('taskList:decision.noGovernanceNeeded')}
      </span>
    );
  }

  return <></>;
};
