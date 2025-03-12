import React from 'react';

import { EasiFormProvider, useEasiForm } from 'components/EasiForm';
import { GRBReviewFormStepProps } from 'types/grbReview';

import GRBReviewFormStepWrapper, {
  GRBReviewFormStepSubmit
} from '../GRBReviewFormStepWrapper';

// TODO: Update fields type
type ParticipantsFields = {};

const Participants = ({ grbReview }: GRBReviewFormStepProps) => {
  const form = useEasiForm<ParticipantsFields>();

  return (
    <EasiFormProvider<ParticipantsFields> {...form}>
      <GRBReviewFormStepWrapper
        grbReview={grbReview}
        // TODO: Update onSubmit to return mutation
        onSubmit={(async () => null) as unknown as GRBReviewFormStepSubmit}
      >
        <p>Fields here</p>
      </GRBReviewFormStepWrapper>
    </EasiFormProvider>
  );
};

export default Participants;
