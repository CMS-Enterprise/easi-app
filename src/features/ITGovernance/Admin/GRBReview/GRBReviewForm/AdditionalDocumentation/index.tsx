import React from 'react';
import { useTranslation } from 'react-i18next';
import DocumentsTable from 'features/ITGovernance/Requester/SystemIntake/Documents/DocumentsTable';

import CollapsableLink from 'components/CollapsableLink';
import UswdsReactLink from 'components/LinkWrapper';
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

      <h4 className="margin-top-6 margin-bottom-1">
        {t('setUpGrbReviewForm.documents.heading')}
      </h4>

      <UswdsReactLink
        to={`/it-governance/${grbReview.id}/documents/upload`}
        className="usa-button"
      >
        {t('setUpGrbReviewForm.documents.addDocument')}
      </UswdsReactLink>

      <DocumentsTable
        systemIntakeId={grbReview.id}
        documents={grbReview.documents}
        className="margin-top-4"
      />
    </GRBReviewFormStepWrapper>
  );
};

export default AdditionalDocumentation;
