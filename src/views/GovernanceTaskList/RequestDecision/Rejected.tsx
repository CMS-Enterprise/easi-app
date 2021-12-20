import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Link as UswdsLink } from '@trussworks/react-uswds';

import { GetSystemIntake_systemIntake as SystemIntake } from 'queries/types/GetSystemIntake';

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
        <UswdsLink
          className="usa-button margin-bottom-2"
          variant="unstyled"
          asCustom={Link}
          to={`/governance-task-list/${id}`}
        >
          {t('navigation.returnToTaskList')}
        </UswdsLink>
      </div>

      <h3>{t('general:feedback.improvement')}</h3>
      <UswdsLink
        href="https://www.surveymonkey.com/r/JNYSMZP"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open EASi survey in a new tab"
      >
        {t('general:feedback.whatYouThink')}
      </UswdsLink>
    </>
  );
};

export default Rejected;
