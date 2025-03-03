import React from 'react';

import { EasiFormProvider, useEasiForm } from 'components/EasiForm';
import { GRBReviewFormStepProps } from 'types/grbReview';

import GRBReviewFormStepWrapper from './GRBReviewFormStepWrapper';

// TODO: Update fields type
type ParticipantsAndTimeframeFields = {};

const ParticipantsAndTimeframe = ({ grbReview }: GRBReviewFormStepProps) => {
  const form = useEasiForm<ParticipantsAndTimeframeFields>();

  return (
    <EasiFormProvider<ParticipantsAndTimeframeFields> {...form}>
      <GRBReviewFormStepWrapper grbReview={grbReview}>
        <p>Fields here</p>
      </GRBReviewFormStepWrapper>
    </EasiFormProvider>
  );
};

export default ParticipantsAndTimeframe;
