import React from 'react';
import { useTranslation } from 'react-i18next';
import { kebabCase } from 'lodash';

import UswdsReactLink from 'components/LinkWrapper';
import Alert from 'components/shared/Alert';
import TaskListItem, { TaskListDescription } from 'components/TaskList';
// import { IT_GOV_EMAIL } from 'constants/externalUrls';
import { ITGovFinalBusinessCaseStatus } from 'types/graphql-global-types';
import { ItGovTaskSystemIntakeWithMockData } from 'types/itGov';
import { TaskListItemDateInfo } from 'types/taskList';

const GovTaskBizCaseFinal = ({
  itGovTaskStatuses: { bizCaseFinalStatus },
  bizCaseFinalPctComplete,
  bizCaseFinalSubmittedAt,
  bizCaseFinalUpdatedAt,
  governanceRequestFeedbacks
}: ItGovTaskSystemIntakeWithMockData) => {
  const stepKey = 'bizCaseFinal';
  const { t } = useTranslation('itGov');

  const statusButtonText = new Map<ITGovFinalBusinessCaseStatus, string>([
    [ITGovFinalBusinessCaseStatus.READY, 'start'],
    [ITGovFinalBusinessCaseStatus.IN_PROGRESS, 'continue'],
    [ITGovFinalBusinessCaseStatus.EDITS_REQUESTED, 'editForm']
  ]);

  let dateInfo: TaskListItemDateInfo;

  // Updated date
  if (
    (bizCaseFinalStatus === ITGovFinalBusinessCaseStatus.IN_PROGRESS ||
      bizCaseFinalStatus === ITGovFinalBusinessCaseStatus.EDITS_REQUESTED) &&
    bizCaseFinalUpdatedAt
  )
    dateInfo = {
      label: 'lastUpdated',
      value: bizCaseFinalUpdatedAt
    };

  // Submitted date
  if (
    !dateInfo &&
    bizCaseFinalStatus === ITGovFinalBusinessCaseStatus.DONE &&
    bizCaseFinalSubmittedAt
  )
    dateInfo = {
      label: 'submitted',
      value: bizCaseFinalSubmittedAt
    };

  const hasFeedback = governanceRequestFeedbacks.length > 0;

  return (
    <TaskListItem
      heading={t(`taskList.step.${stepKey}.title`)}
      status={bizCaseFinalStatus}
      statusPercentComplete={
        bizCaseFinalStatus === ITGovFinalBusinessCaseStatus.IN_PROGRESS &&
        bizCaseFinalPctComplete
      }
      statusDateInfo={dateInfo}
      testId={kebabCase(t(`taskList.step.${stepKey}.title`))}
    >
      <TaskListDescription>
        <p>{t(`taskList.step.${stepKey}.description`)}</p>

        {/* Final biz case submitted & waiting for feedback */}
        {bizCaseFinalStatus === ITGovFinalBusinessCaseStatus.DONE && (
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

        {statusButtonText.has(bizCaseFinalStatus) && (
          <div className="margin-top-2">
            <UswdsReactLink variant="unstyled" className="usa-button" to="./">
              {t(`button.${statusButtonText.get(bizCaseFinalStatus)}`)}
            </UswdsReactLink>
          </div>
        )}

        {/* Link to view feedback */}
        {hasFeedback && (
          <div className="margin-top-2">
            <UswdsReactLink to="./">{t(`button.viewFeedback`)}</UswdsReactLink>
          </div>
        )}

        {/* Link to view submitted final biz case */}
        {bizCaseFinalStatus === ITGovFinalBusinessCaseStatus.DONE && (
          <div className="margin-top-2">
            <UswdsReactLink to="./">
              {t(`taskList.step.${stepKey}.viewSubmittedFinalBusinessCase`)}
            </UswdsReactLink>
          </div>
        )}
      </TaskListDescription>
    </TaskListItem>
  );
};

export default GovTaskBizCaseFinal;
