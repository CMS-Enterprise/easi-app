import React from 'react';
import { useTranslation } from 'react-i18next';
import { camelCase } from 'lodash';

import Breadcrumbs from 'components/shared/Breadcrumbs';
import StepHeader from 'components/StepHeader';

type GRBReviewFormProps = {
  id: string;
};

const GRBReviewForm = ({ id }: GRBReviewFormProps) => {
  const { t } = useTranslation('grbReview');

  const grbReviewPath = `/it-governance/${id}/grb-review`;

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
        breadcrumbBar={
          <Breadcrumbs
            items={[
              { text: t('header:home'), url: '/' },
              {
                text: t('governanceReviewTeam:itGovernanceRequestDetails'),
                url: grbReviewPath
              },
              { text: t('setUpGrbReviewForm.heading') }
            ]}
          />
        }
      />
    </div>
  );
};

export default GRBReviewForm;
