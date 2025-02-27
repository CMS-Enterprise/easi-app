import React from 'react';

import { EasiFormProvider, useEasiForm } from 'components/EasiForm';

import GRBReviewFormStepWrapper from './GRBReviewFormStepWrapper';

// TODO: Update fields type
type ParticipantsAndTimeframeFields = {};

const ParticipantsAndTimeframe = () => {
  const form = useEasiForm<ParticipantsAndTimeframeFields>();

  return (
    <EasiFormProvider<ParticipantsAndTimeframeFields> {...form}>
      <GRBReviewFormStepWrapper>
        <p>Fields here</p>
      </GRBReviewFormStepWrapper>
    </EasiFormProvider>
  );
};

export default ParticipantsAndTimeframe;
