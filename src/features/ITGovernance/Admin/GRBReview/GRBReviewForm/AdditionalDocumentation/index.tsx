import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';
import DocumentsTable from 'features/ITGovernance/_components/DocumentsTable';
import { SystemIntakeGRBReviewType } from 'gql/generated/graphql';

import Alert from 'components/Alert';
import CollapsableLink from 'components/CollapsableLink';
import { GRBReviewFormStepProps } from 'types/grbReview';

import GRBReviewFormStepWrapper from '../GRBReviewFormStepWrapper';

const AdditionalDocumentation = ({ grbReview }: GRBReviewFormStepProps) => {
  const { t } = useTranslation('grbReview');
  const history = useHistory();

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

      {grbReview.grbReviewType === SystemIntakeGRBReviewType.STANDARD && (
        <Alert slim type="info" className="margin-top-3">
          {t('setUpGrbReviewForm.documents.standardMeetingAlert')}
        </Alert>
      )}

      <h4 className="margin-top-6 margin-bottom-1">
        {t('setUpGrbReviewForm.documents.heading')}
      </h4>

      <Button
        type="button"
        onClick={() =>
          history.push(`/it-governance/${grbReview.id}/documents/upload`, {
            uploadSource: 'grbReviewForm'
          })
        }
      >
        {t('setUpGrbReviewForm.documents.addDocument')}
      </Button>

      <DocumentsTable
        systemIntakeId={grbReview.id}
        documents={grbReview.documents}
        className="margin-top-4"
      />
    </GRBReviewFormStepWrapper>
  );
};

export default AdditionalDocumentation;
