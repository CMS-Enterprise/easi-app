import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import ActionBanner from 'components/shared/ActionBanner';
import { AppState } from 'reducers/rootReducer';
import { fetchSystemIntakes } from 'types/routines';
import { SystemIntakeForm } from 'types/systemIntake';

const SystemIntakeBanners = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation('intake');
  const intakes = useSelector(
    (state: AppState) => state.systemIntakes.systemIntakes
  );
  const statusMap: { [key: string]: { title: string; description: string } } = {
    INTAKE_DRAFT: {
      title: t('banner.title.intakeIncomplete'),
      description: t('banner.description.intakeIncomplete')
    },
    INTAKE_SUBMITTED: {
      title: t('banner.title.pendingResponse'),
      description: t('banner.description.intakeSubmitted')
    },
    NEED_BIZ_CASE: {
      title: t('banner.title.startBizCase'),
      description: t('banner.description.checkNextStep')
    },
    BIZ_CASE_DRAFT: {
      title: t('banner.title.bizCaseIncomplete'),
      description: t('banner.description.bizCaseIncomplete')
    },
    BIZ_CASE_DRAFT_SUBMITTED: {
      title: t('banner.title.pendingResponse'),
      description: t('banner.description.bizCaseSubmitted')
    },
    BIZ_CASE_CHANGES_NEEDED: {
      title: t('banner.title.responseRecevied'),
      description: t('banner.description.checkNextStep')
    },
    BIZ_CASE_FINAL_NEEDED: {
      title: t('banner.title.responseRecevied'),
      description: t('banner.description.checkNextStep')
    },
    BIZ_CASE_FINAL_SUBMITTED: {
      title: t('banner.title.pendingResponse'),
      description: t('banner.description.bizCaseSubmitted')
    },
    READY_FOR_GRT: {
      title: t('banner.title.prepareGrt'),
      description: t('banner.description.checkNextStep')
    },
    READY_FOR_GRB: {
      title: t('banner.title.prepareGrb'),
      description: t('banner.description.checkNextStep')
    },
    LCID_ISSUED: {
      title: t('banner.title.decisionReceived'),
      description: t('banner.description.checkNextStep')
    },
    WITHDRAWN: {
      title: t('banner.title.requestWithdrawn'),
      description: ''
    },
    NOT_IT_REQUEST: {
      title: t('banner.title.responseRecevied'),
      description: t('banner.description.checkNextStep')
    },
    NOT_APPROVED: {
      title: t('banner.title.decisionReceived'),
      description: t('banner.description.checkNextStep')
    },
    NO_GOVERNANCE: {
      title: t('banner.title.responseRecevied'),
      description: t('banner.description.checkNextStep')
    },
    SHUTDOWN_IN_PROGRESS: {
      title: t('banner.title.decommissioning'),
      description: t('banner.description.decommissioning')
    },
    SHUTDOWN_COMPLETE: {
      title: t('banner.title.responseRecevied'),
      description: t('banner.description.checkNextStep')
    }
  };

  useEffect(() => {
    dispatch(fetchSystemIntakes());
  }, [dispatch]);

  return (
    <>
      {intakes.map((intake: SystemIntakeForm) => {
        const status = statusMap[intake.status];
        const rootPath = '/governance-task-list';

        if (intake.requestType === 'SHUTDOWN') {
          // Current implementation a banner doesn't appear for completed shutdown
          // because the entire flow is handled via email. Nothing to display.
          if (
            ['SHUTDOWN_COMPLETE', 'NO_GOVERNANCE', 'NOT_IT_REQUEST'].includes(
              intake.status
            )
          ) {
            return <React.Fragment key={intake.id} />;
          }

          return (
            <ActionBanner
              key={intake.id}
              title={
                intake.requestName
                  ? `${intake.requestName}: ${status.title}`
                  : status.title
              }
              helpfulText={status.description}
              onClick={() => {
                const link = [
                  'INTAKE_SUBMITTED',
                  'SHUTDOWN_IN_PROGRESS'
                ].includes(intake.status)
                  ? `/system/${intake.id}/view`
                  : `/system/${intake.id}`;
                history.push(link);
              }}
              label={
                ['INTAKE_SUBMITTED', 'SHUTDOWN_IN_PROGRESS'].includes(
                  intake.status
                )
                  ? 'View submitted intake request'
                  : 'Go to intake request'
              }
              requestType={intake.requestType}
              data-intakeid={intake.id}
            />
          );
        }

        return (
          <ActionBanner
            key={intake.id}
            title={
              intake.requestName
                ? `${intake.requestName}: ${status.title}`
                : status.title
            }
            helpfulText={status.description}
            onClick={() => {
              history.push(`${rootPath}/${intake.id}`);
            }}
            label="Go to Task List"
            requestType={intake.requestType}
            data-intakeid={intake.id}
          />
        );
      })}
    </>
  );
};

export default SystemIntakeBanners;
