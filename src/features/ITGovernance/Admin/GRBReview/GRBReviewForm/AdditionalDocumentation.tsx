import React from 'react';

import { EasiFormProvider, useEasiForm } from 'components/EasiForm';
import { GRBReviewFormStepProps } from 'types/grbReview';

import GRBReviewFormStepWrapper from './GRBReviewFormStepWrapper';

// TODO: Update fields type
type AdditionalDocumentationFields = {};

const AdditionalDocumentation = ({ grbReview }: GRBReviewFormStepProps) => {
  const form = useEasiForm<AdditionalDocumentationFields>();

  return (
    <EasiFormProvider<AdditionalDocumentationFields> {...form}>
      <GRBReviewFormStepWrapper grbReview={grbReview}>
        <p>Fields here</p>
      </GRBReviewFormStepWrapper>
    </EasiFormProvider>
  );
};

export default AdditionalDocumentation;
