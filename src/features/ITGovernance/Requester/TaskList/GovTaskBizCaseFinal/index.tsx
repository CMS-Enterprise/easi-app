import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, Link } from '@trussworks/react-uswds';
import {
  GetGovernanceTaskListQuery,
  GovernanceRequestFeedbackTargetForm,
  ITGovFinalBusinessCaseStatus
} from 'gql/generated/graphql';
import { kebabCase } from 'lodash';

import Alert from 'components/Alert';
import UswdsReactLink from 'components/LinkWrapper';
import TaskListItem, { TaskListDescription } from 'components/TaskList';
import { IT_GOV_EMAIL } from 'constants/externalUrls';
import { SystemIntakeState } from 'types/graphql-global-types';

const GovTaskBizCaseFinal = ({
  id,
  itGovTaskStatuses: { bizCaseFinalStatus },
  governanceRequestFeedbacks,
  businessCase,
  state
}: NonNullable<GetGovernanceTaskListQuery['systemIntake']>) => {
  const stepKey = 'bizCaseFinal';
  const { t } = useTranslation('itGov');

  const history = useHistory();

  const statusButtonText = new Map<ITGovFinalBusinessCaseStatus, string>([
    [ITGovFinalBusinessCaseStatus.READY, 'start'],
    [ITGovFinalBusinessCaseStatus.IN_PROGRESS, 'continue'],
    [ITGovFinalBusinessCaseStatus.EDITS_REQUESTED, 'editForm']
  ]);

  const hasFeedback = useMemo(
    () =>
      !!governanceRequestFeedbacks.find(
        ({ targetForm }) =>
          targetForm === GovernanceRequestFeedbackTargetForm.FINAL_BUSINESS_CASE
      ),
    [governanceRequestFeedbacks]
  );

  return (
    <TaskListItem
      heading={t(`taskList.step.${stepKey}.title`)}
      status={bizCaseFinalStatus}
      state={state}
      testId={kebabCase(t(`taskList.step.${stepKey}.title`))}
    >
      <TaskListDescription>
        <p>{t(`taskList.step.${stepKey}.description`)}</p>

        {/* Final biz case submitted & waiting for feedback */}
        {bizCaseFinalStatus === ITGovFinalBusinessCaseStatus.SUBMITTED && (
          <Alert slim type="info">
            {t(`taskList.step.${stepKey}.submittedInfo`)}
          </Alert>
        )}

        {bizCaseFinalStatus ===
          ITGovFinalBusinessCaseStatus.EDITS_REQUESTED && (
          <Alert slim type="warning">
            {t(`taskList.step.${stepKey}.editsRequestedWarning`)}
          </Alert>
        )}

        {/* No feedback info */}
        {bizCaseFinalStatus === ITGovFinalBusinessCaseStatus.DONE &&
          !hasFeedback && (
            <Alert slim type="info">
              <Trans
                i18nKey={`itGov:taskList.step.${stepKey}.noFeedbackInfo`}
                components={{
                  a: <Link href={`mailto:${IT_GOV_EMAIL}`}> </Link>,
                  email: IT_GOV_EMAIL
                }}
              />
            </Alert>
          )}

        {statusButtonText.has(bizCaseFinalStatus) && (
          <div className="margin-top-2">
            <Button
              type="button"
              disabled={state === SystemIntakeState.CLOSED}
              onClick={() => {
                history.push({
                  pathname: `/business/${
                    businessCase?.id || 'new'
                  }/general-request-info`,
                  state: {
                    systemIntakeId: id
                  }
                });
              }}
            >
              {t(`button.${statusButtonText.get(bizCaseFinalStatus)}`)}
            </Button>
          </div>
        )}

        {/* Link to view feedback */}
        {hasFeedback && (
          <div className="margin-top-2">
            <UswdsReactLink to={`/governance-task-list/${id}/feedback`}>
              {t('button.viewRequestedEdits')}
            </UswdsReactLink>
          </div>
        )}

        {/* Link to view submitted final biz case */}
        {(bizCaseFinalStatus === ITGovFinalBusinessCaseStatus.SUBMITTED ||
          bizCaseFinalStatus === ITGovFinalBusinessCaseStatus.DONE) && (
          <div className="margin-top-2">
            <UswdsReactLink to={`/business/${businessCase?.id}/view`}>
              {t(`taskList.step.${stepKey}.viewSubmittedFinalBusinessCase`)}
            </UswdsReactLink>
          </div>
        )}
      </TaskListDescription>
    </TaskListItem>
  );
};

export default GovTaskBizCaseFinal;
