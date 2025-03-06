import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Grid } from '@trussworks/react-uswds';
import {
  SystemIntakeGRBReviewerFragment,
  useGetSystemIntakeQuery
} from 'gql/generated/graphql';

import { EasiFormProvider, useEasiForm } from 'components/EasiForm';
import RequiredAsterisk from 'components/RequiredAsterisk';
import { GRBReviewFormStepProps } from 'types/grbReview';

import ParticipantsTable from '../../ParticipantsTable/ParticipantsTable';
import GRBReviewFormStepWrapper from '../GRBReviewFormStepWrapper';

// TODO: Update fields type
type ParticipantsFields = {};

const Participants = ({ grbReview }: GRBReviewFormStepProps) => {
  const form = useEasiForm<ParticipantsFields>();
  const { t } = useTranslation('grbReview');

  const history = useHistory();
  const { pathname } = useLocation();
  const { data } = useGetSystemIntakeQuery({
    variables: {
      id: grbReview.id
    }
  });

  const [reviewerToRemove, setReviewerToRemove] =
    useState<SystemIntakeGRBReviewerFragment | null>(null);

  if (!data) {
    return null;
  }

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
              onClick={() =>
                history.push(`${pathname.replace('participants', 'add')}`)
              }
              outline={grbReview.grbReviewers.length > 0}
            >
              {t(
                grbReview.grbReviewers.length > 0
                  ? 'addAnotherGrbReviewer'
                  : 'addGrbReviewer'
              )}
            </Button>
          </div>
          <ParticipantsTable
            {...data.systemIntake}
            grbReviewers={grbReview.grbReviewers}
            setReviewerToRemove={setReviewerToRemove}
          />

          <div className="margin-top-5 border-top-1px border-base-light padding-top-1">
            <p className="text-bold margin-y-0">
              {t('setUpGrbReviewForm.step4.timeframe.heading')}
            </p>
            <p className="margin-top-0 margin-bottom-3 text-base-dark">
              {t('setUpGrbReviewForm.step4.timeframe.description')}
            </p>
            <p className="margin-top-0 margin-bottom-1">
              {t('setUpGrbReviewForm.step4.selectReviewEndDate.heading')}
              <RequiredAsterisk />
            </p>
            <p className="margin-y-0 text-base-dark">
              {t('setUpGrbReviewForm.step4.selectReviewEndDate.description')}
            </p>
          </div>
        </Grid>
      </GRBReviewFormStepWrapper>
    </EasiFormProvider>
  );
};

export default Participants;
