import React from 'react';
import { useTranslation } from 'react-i18next';

import PageHeading from 'components/PageHeading';

const GRBReview = () => {
  const { t } = useTranslation('grbReview');
  return (
    <div>
      <PageHeading className="margin-y-0">{t('title')}</PageHeading>
      <p className="font-body-md line-height-body-4 text-light margin-top-05 margin-bottom-4">
        {t('description')}
      </p>
    </div>
  );
};

export default GRBReview;
