import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Grid } from '@trussworks/react-uswds';

import { EasiFormProvider, useEasiForm } from 'components/EasiForm';
import RequiredAsterisk from 'components/RequiredAsterisk';
import { GRBReviewFormStepProps } from 'types/grbReview';

import GRBReviewFormStepWrapper from '../GRBReviewFormStepWrapper';

// TODO: Update fields type
type ParticipantsFields = {};

const Participants = ({ grbReview }: GRBReviewFormStepProps) => {
  const form = useEasiForm<ParticipantsFields>();
  const { t } = useTranslation('grbReview');

  const history = useHistory();
  const { pathname } = useLocation();

  return (
    <EasiFormProvider<ParticipantsFields> {...form}>
      <GRBReviewFormStepWrapper
        grbReview={grbReview}
        onSubmit={async () => null}
      >
        <Grid col={6}>
          <div className="margin-top-5 border-top-1px border-base-light padding-top-1">
            <p className="text-bold margin-y-0">
              {t('setUpGrbReviewForm.step4.grbReviewers.heading')}
              <RequiredAsterisk />
            </p>
            <p className="margin-y-0 text-base-dark">
              {t('setUpGrbReviewForm.step4.grbReviewers.description')}
            </p>
            <Button
              type="button"
              onClick={() => history.push(`${pathname}/add`)}
              outline={grbReview.grbReviewers.length > 0}
            >
              {t(
                grbReview.grbReviewers.length > 0
                  ? 'addAnotherGrbReviewer'
                  : 'addGrbReviewer'
              )}
            </Button>
          </div>
        </Grid>
      </GRBReviewFormStepWrapper>
    </EasiFormProvider>
  );
};

export default Participants;
