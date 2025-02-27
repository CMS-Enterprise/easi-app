import React from 'react';

import { EasiFormProvider, useEasiForm } from 'components/EasiForm';

import GRBReviewFormStepWrapper from './GRBReviewFormStepWrapper';

// TODO: Update fields type
type AdditionalDocumentationFields = {};

const AdditionalDocumentation = () => {
  const form = useEasiForm<AdditionalDocumentationFields>();

  return (
    <EasiFormProvider<AdditionalDocumentationFields> {...form}>
      <GRBReviewFormStepWrapper>
        <p>Fields here</p>
      </GRBReviewFormStepWrapper>
    </EasiFormProvider>
  );
};

export default AdditionalDocumentation;
