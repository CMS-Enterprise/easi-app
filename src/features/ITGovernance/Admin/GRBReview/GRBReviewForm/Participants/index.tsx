import React from 'react';

import { EasiFormProvider, useEasiForm } from 'components/EasiForm';
import { GRBReviewFormStepProps } from 'types/grbReview';

import GRBReviewFormStepWrapper from '../GRBReviewFormStepWrapper';

// TODO: Update fields type
type ParticipantsFields = {};

const Participants = ({ grbReview }: GRBReviewFormStepProps) => {
  const form = useEasiForm<ParticipantsFields>();

  return (
    <EasiFormProvider<ParticipantsFields> {...form}>
      <GRBReviewFormStepWrapper
        grbReview={grbReview}
        onSubmit={async () => null}
      >
        <p>Fields here</p>
      </GRBReviewFormStepWrapper>
    </EasiFormProvider>
  );
};

export default Participants;
