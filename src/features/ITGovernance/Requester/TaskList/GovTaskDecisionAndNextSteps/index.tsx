import React from 'react';
import { useTranslation } from 'react-i18next';
import { kebabCase } from 'lodash';

import UswdsReactLink from 'components/LinkWrapper';
import TaskListItem, { TaskListDescription } from 'components/TaskList';
import {
  ITGovDecisionStatus,
  SystemIntakeDecisionState
} from 'types/graphql-global-types';
import { ItGovTaskSystemIntakeWithMockData } from 'types/itGov';

const GovTaskDecisionAndNextSteps = ({
  id,
  itGovTaskStatuses: { decisionAndNextStepsStatus },
  state,
  decisionState,
  decisionAndNextStepsSubmittedAt
}: ItGovTaskSystemIntakeWithMockData) => {
  const stepKey = 'decisionAndNextSteps';
  const { t } = useTranslation('itGov');

  const linkClass =
    decisionAndNextStepsStatus === ITGovDecisionStatus.COMPLETED
      ? 'usa-button'
      : 'usa-link';

  const linkTextKey =
    decisionAndNextStepsStatus === ITGovDecisionStatus.COMPLETED
      ? 'button'
      : 'viewPreviousDecision';

  return (
    <TaskListItem
      heading={t(`taskList.step.${stepKey}.title`)}
      status={decisionAndNextStepsStatus}
      state={state}
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
      id="decision"
    >
      <TaskListDescription>
        <p>{t(`taskList.step.${stepKey}.description`)}</p>

        {/* Button read the decision */}
        {decisionState !== SystemIntakeDecisionState.NO_DECISION && (
          <div className="margin-top-2">
            <UswdsReactLink
              variant="unstyled"
              className={linkClass}
              to={`/governance-task-list/${id}/request-decision`}
            >
              {t(`taskList.step.${stepKey}.${linkTextKey}`)}
            </UswdsReactLink>
          </div>
        )}
      </TaskListDescription>
    </TaskListItem>
  );
};

export default GovTaskDecisionAndNextSteps;
