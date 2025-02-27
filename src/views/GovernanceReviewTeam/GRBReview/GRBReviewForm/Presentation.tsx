import React from 'react';

import { EasiFormProvider, useEasiForm } from 'components/EasiForm';

import GRBReviewFormStepWrapper from './GRBReviewFormStepWrapper';

// TODO: Update fields type
type PresentationFields = {};

const Presentation = () => {
  const form = useEasiForm<PresentationFields>();

  return (
    <EasiFormProvider<PresentationFields> {...form}>
      <GRBReviewFormStepWrapper>
        <p>Fields here</p>
      </GRBReviewFormStepWrapper>
    </EasiFormProvider>
  );
};

export default Presentation;
