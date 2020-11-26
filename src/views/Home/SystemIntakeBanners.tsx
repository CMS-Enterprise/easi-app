import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import ActionBanner from 'components/shared/ActionBanner';
import { useFlags } from 'contexts/flagContext';
import { SystemIntakeForm } from 'types/systemIntake';

type SystemIntakeBannersProps = {
  intakes: SystemIntakeForm[];
};

const SystemIntakeBanners = ({ intakes }: SystemIntakeBannersProps) => {
  const flags = useFlags();
  const history = useHistory();
  const { t } = useTranslation('intake');

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

  return (
    <>
      {intakes.map((intake: SystemIntakeForm) => {
        let rootPath = '';
        if (intake.requestType === 'SHUTDOWN') {
          rootPath = '/system';
        } else {
          rootPath = flags.taskListLite ? '/governance-task-list' : '/system';
        }
        const status = statusMap[intake.status];

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
