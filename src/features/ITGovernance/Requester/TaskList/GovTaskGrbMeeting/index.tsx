import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { kebabCase } from 'lodash';

import Alert from 'components/Alert';
import UswdsReactLink from 'components/LinkWrapper';
import TaskListItem, { TaskListDescription } from 'components/TaskList';
import { ITGovGRBStatus } from 'types/graphql-global-types';
import { ItGovTaskSystemIntakeWithMockData } from 'types/itGov';
import { formatDateUtc } from 'utils/date';

const GovTaskGrbMeeting = ({
  itGovTaskStatuses: { grbMeetingStatus },
  state,
  grbDate
}: ItGovTaskSystemIntakeWithMockData) => {
  const stepKey = 'grbMeeting';
  const { t } = useTranslation('itGov');

  return (
    <TaskListItem
      heading={t(`taskList.step.${stepKey}.title`)}
      status={grbMeetingStatus}
      state={state}
      testId={kebabCase(t(`taskList.step.${stepKey}.title`))}
    >
      <TaskListDescription>
        <p>{t(`taskList.step.${stepKey}.description`)}</p>

        {grbMeetingStatus !== ITGovGRBStatus.CANT_START &&
          grbMeetingStatus !== ITGovGRBStatus.NOT_NEEDED && (
            <>
              <p>
                <Trans
                  i18nKey={`itGov:taskList.step.${stepKey}.reviewType`}
                  components={{
                    strong: <strong />
                  }}
                  values={{ type: 'TO_BE_CHANGED' }}
                />
              </p>
              <Alert slim type="info">
                {t(`taskList.step.${stepKey}.alertType.${grbMeetingStatus}`)}
              </Alert>
            </>
          )}

        <div className="margin-top-2">
          <UswdsReactLink
            variant="unstyled"
            className="usa-button"
            to="/help/it-governance/prepare-for-grb"
            target="_blank"
          >
            {t(`taskList.step.${stepKey}.presentationUploadButton`)}
          </UswdsReactLink>
        </div>

        <div className="margin-top-2 display-flex">
          <UswdsReactLink
            to="/help/it-governance/prepare-for-grb"
            target="_blank"
            className="margin-right-2 padding-right-2 border-right-1px border-base-lighter"
          >
            {t(`taskList.step.${stepKey}.button`)}
          </UswdsReactLink>
          <UswdsReactLink
            to="/help/it-governance/prepare-for-grb"
            target="_blank"
          >
            {t(`taskList.step.${stepKey}.learnMore`)}
          </UswdsReactLink>
        </div>
      </TaskListDescription>
    </TaskListItem>
  );
};

export default GovTaskGrbMeeting;
