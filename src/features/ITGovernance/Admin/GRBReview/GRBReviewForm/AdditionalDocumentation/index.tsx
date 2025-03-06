import React from 'react';
import { useTranslation } from 'react-i18next';

import CollapsableLink from 'components/CollapsableLink';
import { GRBReviewFormStepProps } from 'types/grbReview';

import GRBReviewFormStepWrapper from '../GRBReviewFormStepWrapper';

const AdditionalDocumentation = ({ grbReview }: GRBReviewFormStepProps) => {
  const { t } = useTranslation('grbReview');
  return (
    <GRBReviewFormStepWrapper grbReview={grbReview} requiredFields={false}>
      <CollapsableLink
        id="documentsList"
        className="margin-top-3 padding-y-0"
        label={t('setUpGrbReviewForm.documents.collapsableText.label')}
      >
        <p className="line-height-body-5 margin-y-0 tablet:grid-col-9">
          {t('setUpGrbReviewForm.documents.collapsableText.description')}
        </p>

        <ul className="line-height-body-5 margin-y-0">
          {t<string[]>('setUpGrbReviewForm.documents.collapsableText.list', {
            returnObjects: true
          }).map(item => (
            <li key={item} className="margin-top-05">
              {item}
            </li>
          ))}
        </ul>
      </CollapsableLink>
    </GRBReviewFormStepWrapper>
  );
};

export default AdditionalDocumentation;
