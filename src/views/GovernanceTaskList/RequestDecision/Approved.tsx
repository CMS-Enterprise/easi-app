import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Alert, Link as UswdsLink } from '@trussworks/react-uswds';
import { DateTime } from 'luxon';

import { SystemIntakeForm } from 'types/systemIntake';

type ApprovedProps = {
  intake: SystemIntakeForm;
};

const Approved = ({ intake }: ApprovedProps) => {
  const { t } = useTranslation('taskList');
  return (
    <>
      <div className="easi-governance-decision__info">
        <h2 className="margin-top-0">{t('decision.bizCaseApproved')}</h2>
        <dl>
          <dt>{t('decision.lcid')}</dt>
          <dd className="margin-left-0 font-body-xl text-bold">
            {intake.lcid}
          </dd>
        </dl>
        <h3>{t('decision.lcidScope')}</h3>
        <p className="text-pre-wrap">{intake.lcidScope}</p>
        {intake.lcidExpiration && (
          <p className="text-bold">
            {t('decision.lcidExpiration', {
              date: intake.lcidExpiration.toLocaleString(DateTime.DATE_FULL)
            })}
          </p>
        )}
      </div>

      {intake.decisionNextSteps && (
        <>
          <h3>{t('decision.nextSteps')}</h3>
          <Alert type="info">{t('decision.completeNextSteps')}</Alert>

          <p className="text-pre-wrap">{intake.decisionNextSteps}</p>
        </>
      )}
      <h3>{t('general:feedback.improvement')}</h3>
      <UswdsLink
        href="https://www.surveymonkey.com/r/JNYSMZP"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open EASi survey in a new tab"
      >
        {t('general:feedback.whatYouThink')}
      </UswdsLink>

      <div className="margin-top-4">
        <UswdsLink asCustom={Link} to={`/governance-task-list/${intake.id}`}>
          {t('navigation.returnToTaskList')}
        </UswdsLink>
      </div>
    </>
  );
};

export default Approved;
