import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';

const GRBReview = () => {
  const { t } = useTranslation('grbReview');
  return (
    <div>
      <PageHeading className="margin-y-0">{t('title')}</PageHeading>
      <p className="font-body-md line-height-body-4 text-light margin-top-05 margin-bottom-4">
        {t('description')}
      </p>

      {/* Feature in progress alert */}
      <Alert type="info" heading={t('featureInProgress')}>
        <Trans
          i18nKey="grbReview:featureInProgressText"
          components={{
            a: (
              <Link to="/help/send-feedback" target="_blank">
                feedback form
              </Link>
            )
          }}
        />
      </Alert>
    </div>
  );
};

export default GRBReview;
