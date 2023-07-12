import React from 'react';
import { useTranslation } from 'react-i18next';
import { kebabCase } from 'lodash';

import UswdsReactLink from 'components/LinkWrapper';
import Alert from 'components/shared/Alert';
import TaskListItem, { TaskListDescription } from 'components/TaskList';
import { ITGovIntakeFormStatus } from 'types/graphql-global-types';
import { ItGovTaskSystemIntake } from 'types/itGov';

const GovTaskIntakeForm = ({
  itGovTaskStatuses,
  governanceRequestFeedbacks,
  submittedAt,
  updatedAt
}: ItGovTaskSystemIntake) => {
  const stepKey = 'intakeForm';
  const { t } = useTranslation('itGov');

  const statusButtonText = new Map<ITGovIntakeFormStatus, string>([
    [ITGovIntakeFormStatus.READY, 'start'],
    [ITGovIntakeFormStatus.IN_PROGRESS, 'continue'],
    [ITGovIntakeFormStatus.EDITS_REQUESTED, 'editForm']
  ]);

  const hasFeedback = governanceRequestFeedbacks.length > 0;

  return (
    <TaskListItem
      heading={t(`taskList.step.${stepKey}.title`)}
      status={itGovTaskStatuses.intakeFormStatus}
      testId={kebabCase(t(`taskList.step.${stepKey}.title`))}
      completedIso={submittedAt}
      lastUpdatedIso={updatedAt}
    >
      <TaskListDescription>
        <p>{t(`taskList.step.${stepKey}.description`)}</p>

        {/* Warning about edits requested */}
        {itGovTaskStatuses.intakeFormStatus ===
          ITGovIntakeFormStatus.EDITS_REQUESTED && (
          <Alert slim type="warning">
            {t(`taskList.step.${stepKey}.editsRequestedWarning`)}
          </Alert>
        )}

        {/* Button to the intake form */}
        {statusButtonText.has(itGovTaskStatuses.intakeFormStatus) && (
          <div className="margin-top-2">
            <UswdsReactLink variant="unstyled" className="usa-button" to="./">
              {t(
                `button.${statusButtonText.get(
                  itGovTaskStatuses.intakeFormStatus
                )}`
              )}
            </UswdsReactLink>
          </div>
        )}

        {/* Link to the submitted request form */}
        {itGovTaskStatuses.intakeFormStatus ===
          ITGovIntakeFormStatus.COMPLETED &&
          submittedAt && (
            <div className="margin-top-2">
              <UswdsReactLink to="./">
                {t(`taskList.step.${stepKey}.viewSubmittedRequestForm`)}
              </UswdsReactLink>
            </div>
          )}

        {/* Link to view feedback */}
        {hasFeedback && (
          <div className="margin-top-2">
            <UswdsReactLink to="./">{t(`button.viewFeedback`)}</UswdsReactLink>
          </div>
        )}
      </TaskListDescription>
    </TaskListItem>
  );
};

export default GovTaskIntakeForm;
