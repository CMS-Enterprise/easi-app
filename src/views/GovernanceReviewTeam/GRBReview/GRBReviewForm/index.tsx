import React from 'react';
import { useTranslation } from 'react-i18next';

import StepHeader from 'components/StepHeader';

const GRBReviewForm = () => {
  const { t } = useTranslation('grbReview');
  return (
    <div>
      <StepHeader
        step={1}
        heading={t('setUpGrbReviewForm.heading')}
        steps={[
          {
            key: 'reviewType',
            label: 'Review type',
            description:
              'Select the type of GRB review required for this project.'
          }
        ]}
      />
    </div>
  );
};

export default GRBReviewForm;
