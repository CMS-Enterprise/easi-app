import React from 'react';

import { EasiFormProvider, useEasiForm } from 'components/EasiForm';

import GRBReviewFormStepWrapper from './GRBReviewFormStepWrapper';

// TODO: Update field type
type ReviewTypeField = {};

const ReviewType = () => {
  const form = useEasiForm<ReviewTypeField>();

  return (
    <EasiFormProvider<ReviewTypeField> {...form}>
      <GRBReviewFormStepWrapper>
        <p>Fields here</p>
      </GRBReviewFormStepWrapper>
    </EasiFormProvider>
  );
};

export default ReviewType;
