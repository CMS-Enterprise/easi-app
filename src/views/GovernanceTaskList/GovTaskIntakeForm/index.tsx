import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { kebabCase } from 'lodash';

import UswdsReactLink from 'components/LinkWrapper';
import Alert from 'components/shared/Alert';
import TaskListItem, { TaskListDescription } from 'components/TaskList';
import {
  GovernanceRequestFeedbackTargetForm,
  ITGovIntakeFormStatus
} from 'types/graphql-global-types';
import { ItGovTaskSystemIntakeWithMockData } from 'types/itGov';
import { TaskListItemDateInfo } from 'types/taskList';

const GovTaskIntakeForm = ({
  id,
  itGovTaskStatuses,
  intakeFormPctComplete,
  governanceRequestFeedbacks,
  submittedAt,
  updatedAt
}: ItGovTaskSystemIntakeWithMockData) => {
  const stepKey = 'intakeForm';
  const { t } = useTranslation('itGov');

  const statusButtonText = new Map<ITGovIntakeFormStatus, string>([
    [ITGovIntakeFormStatus.READY, 'start'],
    [ITGovIntakeFormStatus.IN_PROGRESS, 'continue'],
    [ITGovIntakeFormStatus.EDITS_REQUESTED, 'editForm']
  ]);

  let dateInfo: TaskListItemDateInfo;

  // Updated date
  if (
    itGovTaskStatuses.intakeFormStatus ===
      ITGovIntakeFormStatus.EDITS_REQUESTED &&
    updatedAt
  )
    dateInfo = {
      label: 'lastUpdated',
      value: updatedAt
    };

  // Submitted date
  if (
    !dateInfo &&
    itGovTaskStatuses.intakeFormStatus === ITGovIntakeFormStatus.COMPLETED &&
    submittedAt
  )
    dateInfo = {
      label: 'submitted',
      value: submittedAt
    };

  const hasFeedback = useMemo(
    () =>
      !!governanceRequestFeedbacks.find(
        ({ targetForm }) =>
          targetForm === GovernanceRequestFeedbackTargetForm.INTAKE_REQUEST
      ),
    [governanceRequestFeedbacks]
  );

  return (
    <TaskListItem
      heading={t(`taskList.step.${stepKey}.title`)}
      status={itGovTaskStatuses.intakeFormStatus}
      statusPercentComplete={
        itGovTaskStatuses.intakeFormStatus ===
          ITGovIntakeFormStatus.IN_PROGRESS && intakeFormPctComplete
      }
      statusDateInfo={dateInfo}
      testId={kebabCase(t(`taskList.step.${stepKey}.title`))}
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
            <UswdsReactLink
              variant="unstyled"
              className="usa-button"
              to={`/system/${id}/contact-details`}
            >
              {t(
                `button.${statusButtonText.get(
                  itGovTaskStatuses.intakeFormStatus
                )}`
              )}
            </UswdsReactLink>
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

        {/* Link to the submitted request form */}
        {itGovTaskStatuses.intakeFormStatus ===
          ITGovIntakeFormStatus.COMPLETED &&
          submittedAt && (
            <div className="margin-top-2">
              <UswdsReactLink to={`/system/${id}/view`}>
                {t(`taskList.step.${stepKey}.viewSubmittedRequestForm`)}
              </UswdsReactLink>
            </div>
          )}
      </TaskListDescription>
    </TaskListItem>
  );
};

export default GovTaskIntakeForm;
