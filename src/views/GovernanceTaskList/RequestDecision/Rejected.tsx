import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Link as UswdsLink } from '@trussworks/react-uswds';

import { ImproveEasiDecisionPageSurvey } from 'components/Survey';
import { SystemIntakeForm } from 'types/systemIntake';

type RejectedProps = {
  intake: SystemIntakeForm;
};

const Rejected = ({ intake }: RejectedProps) => {
  const { t } = useTranslation('taskList');

  return (
    <>
      <h2 className="margin-top-0">{t('decision.bizCaseRejected')}</h2>
      <h3>{t('decision.reasons')}</h3>
      <p>{intake.rejectionReason}</p>
      {intake.lifecycleNextSteps && (
        <>
          <h3>{t('decision.nextSteps')}</h3>
          <p className="text-pre-wrap">{intake.lifecycleNextSteps}</p>
        </>
      )}
      <ImproveEasiDecisionPageSurvey />

      <div className="margin-top-4">
        <UswdsLink asCustom={Link} to={`/governance-task-list/${intake.id}`}>
          {t('navigation.returnToTaskList')}
        </UswdsLink>
      </div>
    </>
  );
};

export default Rejected;
