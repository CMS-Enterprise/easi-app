import React from 'react';
import { useTranslation } from 'react-i18next';
import { GridContainer, IconWarning, Link } from '@trussworks/react-uswds';

const FeedbackBanner = () => {
  const { t } = useTranslation('intake');
  return (
    <div className="bg-error-lighter padding-y-2">
      <GridContainer>
        <p className="margin-top-0 margin-bottom-2 display-flex line-height-body-5">
          <IconWarning className="text-error-dark margin-right-1" size={3} />
          {t('feedback')}
        </p>
        <Link href="/" className="usa-button usa-button--outline">
          {t('viewFeedback')}
        </Link>
      </GridContainer>
    </div>
  );
};

export default FeedbackBanner;
