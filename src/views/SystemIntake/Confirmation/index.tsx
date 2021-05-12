import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

import PageHeading from 'components/PageHeading';
import { ImproveEasiSurvey } from 'components/Survey';

const Confirmation = () => {
  const { systemId } = useParams<{ systemId: string }>();
  const { t } = useTranslation('intake');

  return (
    <div className="grid-container margin-bottom-7">
      <div>
        <PageHeading>{t('submission.confirmation.heading')}</PageHeading>
        <h2 className="margin-bottom-8 text-normal">
          {t('submission.confirmation.subheading', {
            referenceId: systemId
          })}
        </h2>
        <ImproveEasiSurvey />
        <div>
          <Link to={`/governance-task-list/${systemId}`}>
            <i className="fa fa-angle-left margin-x-05" aria-hidden />
            {t('submission.confirmation.taskListCta')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
