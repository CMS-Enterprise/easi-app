import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';

import ActionBanner from 'components/shared/ActionBanner';
import { useFlags } from 'contexts/flagContext';
import { AppState } from 'reducers/rootReducer';
import { fetchSystemIntakes } from 'types/routines';
import { SystemIntakeForm } from 'types/systemIntake';

const SystemIntakeBanners = () => {
  const flags = useFlags();
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation('intake');
  const { authState } = useOktaAuth();
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
    }
  };

  useEffect(() => {
    if (authState.isAuthenticated) {
      dispatch(fetchSystemIntakes());
    }
  }, [dispatch, authState.isAuthenticated]);

  return (
    <>
      {intakes.map((intake: SystemIntakeForm) => {
        const status = statusMap[intake.status];
        const rootPath = flags.taskListLite
          ? '/governance-task-list'
          : '/system';

        if (intake.requestType === 'SHUTDOWN') {
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
                const link =
                  intake.status === 'INTAKE_SUBMITTED'
                    ? `/system/${intake.id}/view`
                    : `/system/${intake.id}`;
                history.push(link);
              }}
              label={
                intake.status === 'INTAKE_SUBMITTED'
                  ? 'View submitted intake request'
                  : 'Go to intake request'
              }
              requestType={intake.requestType}
              data-intakeid={intake.id}
              buttonUnstyled={intake.status === 'INTAKE_SUBMITTED'}
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
