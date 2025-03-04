import React from 'react';

import { EasiFormProvider, useEasiForm } from 'components/EasiForm';
import { GRBReviewFormStepProps } from 'types/grbReview';

import GRBReviewFormStepWrapper from '../GRBReviewFormStepWrapper';

// TODO: Update fields type
type PresentationFields = {};

const Presentation = ({ grbReview }: GRBReviewFormStepProps) => {
  const form = useEasiForm<PresentationFields>();

  return (
    <EasiFormProvider<PresentationFields> {...form}>
      <GRBReviewFormStepWrapper grbReview={grbReview}>
        <p>Fields here</p>
      </GRBReviewFormStepWrapper>
    </EasiFormProvider>
  );
};

export default Presentation;
