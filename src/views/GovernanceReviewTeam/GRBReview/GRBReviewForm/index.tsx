import React from 'react';
import { useTranslation } from 'react-i18next';
import { camelCase } from 'lodash';

import StepHeader from 'components/StepHeader';

const GRBReviewForm = () => {
  const { t } = useTranslation('grbReview');

  const formSteps: Array<{ label: string; description: string }> = t(
    'setUpGrbReviewForm.steps',
    {
      returnObjects: true
    }
  );

  return (
    <div>
      <StepHeader
        step={1}
        heading={t('setUpGrbReviewForm.heading')}
        text={t('setUpGrbReviewForm.text')}
        subText={t('setUpGrbReviewForm.subText')}
        steps={formSteps.map(step => ({
          ...step,
          key: camelCase(step.label)
        }))}
      />
    </div>
  );
};

export default GRBReviewForm;
