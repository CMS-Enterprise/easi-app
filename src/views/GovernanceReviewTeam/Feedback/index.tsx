import React from 'react';
import { useTranslation } from 'react-i18next';

import PageHeading from 'components/PageHeading';

const Feedback = () => {
  const { t } = useTranslation('governanceReviewTeam');

  return (
    <div>
      <PageHeading className="margin-y-0">{t('feedback.title')}</PageHeading>
      <p className="font-body-md line-height-body-4 text-light margin-top-1">
        {t('feedback.description')}
      </p>
    </div>
  );
};

export default Feedback;
