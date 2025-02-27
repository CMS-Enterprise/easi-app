import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  GetGovernanceTaskListQuery,
  ITGovDecisionStatus,
  SystemIntakeDecisionState
} from 'gql/generated/graphql';
import { kebabCase } from 'lodash';

import UswdsReactLink from 'components/LinkWrapper';
import TaskListItem, { TaskListDescription } from 'components/TaskList';

const GovTaskDecisionAndNextSteps = ({
  id,
  itGovTaskStatuses: { decisionAndNextStepsStatus },
  state,
  decisionState
}: NonNullable<GetGovernanceTaskListQuery['systemIntake']>) => {
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
