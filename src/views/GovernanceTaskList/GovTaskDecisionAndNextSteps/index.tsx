import React from 'react';
import { useTranslation } from 'react-i18next';
import { kebabCase } from 'lodash';

import UswdsReactLink from 'components/LinkWrapper';
import TaskListItem, { TaskListDescription } from 'components/TaskList';
import { ITGovDecisionStatus } from 'types/graphql-global-types';
import { ItGovTaskSystemIntakeWithMockData } from 'types/itGov';

const GovTaskDecisionAndNextSteps = ({
  id,
  itGovTaskStatuses: { decisionAndNextStepsStatus },
  decisionAndNextStepsSubmittedAt
}: ItGovTaskSystemIntakeWithMockData) => {
  const stepKey = 'decisionAndNextSteps';
  const { t } = useTranslation('itGov');

  return (
    <TaskListItem
      heading={t(`taskList.step.${stepKey}.title`)}
      status={decisionAndNextStepsStatus}
      statusDateInfo={
        decisionAndNextStepsStatus === ITGovDecisionStatus.COMPLETED &&
        decisionAndNextStepsSubmittedAt
          ? {
              label: 'completed',
              value: decisionAndNextStepsSubmittedAt
            }
          : undefined
      }
      testId={kebabCase(t(`taskList.step.${stepKey}.title`))}
    >
      <TaskListDescription>
        <p>{t(`taskList.step.${stepKey}.description`)}</p>

        {/* Button read the decision */}
        {decisionAndNextStepsStatus === ITGovDecisionStatus.COMPLETED && (
          <div className="margin-top-2">
            <UswdsReactLink
              variant="unstyled"
              className="usa-button"
              to={`/governance-task-list/${id}/request-decision`}
            >
              {t(`taskList.step.${stepKey}.button`)}
            </UswdsReactLink>
          </div>
        )}
      </TaskListDescription>
    </TaskListItem>
  );
};

export default GovTaskDecisionAndNextSteps;
