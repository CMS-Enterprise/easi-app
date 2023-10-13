import React from 'react';
import { useTranslation } from 'react-i18next';

import UswdsReactLink from 'components/LinkWrapper';
import { SystemIntake } from 'queries/types/SystemIntake';

type RejectedProps = {
  intake: SystemIntake;
};

const Rejected = ({ intake }: RejectedProps) => {
  const { id, rejectionReason, decisionNextSteps } = intake;
  const { t } = useTranslation('taskList');

  return (
    <>
      <h2 className="margin-top-0" data-testid="grt-rejected">
        {t('decision.bizCaseRejected')}
      </h2>
      <h3>{t('decision.reasons')}</h3>
      <p>{rejectionReason}</p>
      {decisionNextSteps && (
        <>
          <h3>{t('decision.nextSteps')}</h3>
          <p className="text-pre-wrap">{decisionNextSteps}</p>
        </>
      )}

      <div className="margin-top-4">
        <UswdsReactLink
          className="usa-button margin-bottom-2"
          variant="unstyled"
          to={`/governance-task-list/${id}`}
        >
          {t('navigation.returnToTaskList')}
        </UswdsReactLink>
      </div>
    </>
  );
};

export default Rejected;
