import React from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Fieldset, FormGroup, Grid } from '@trussworks/react-uswds';
import {
  SystemIntakeGRBReviewerFragment,
  SystemIntakeGRBReviewFragment,
  SystemIntakeGRBReviewType,
  useUpdateSystemIntakeGRBReviewFormInputTimeframeAsyncMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import DatePickerFormatted from 'components/DatePickerFormatted';
import { EasiFormProvider, useEasiForm } from 'components/EasiForm';
import FieldErrorMsg from 'components/FieldErrorMsg';
import RequiredAsterisk from 'components/RequiredAsterisk';
import { GRBReviewFormStepProps } from 'types/grbReview';
import { SetGRBParticipantsAsyncSchema } from 'validations/grbReviewSchema';

import ParticipantsTable from '../../ParticipantsSection/_components/ParticipantsTable';
import GRBReviewFormStepWrapper, {
  GRBReviewFormStepSubmit
} from '../GRBReviewFormStepWrapper';

type ParticipantsFields = {
  grbReviewers: SystemIntakeGRBReviewerFragment[];
  grbReviewAsyncEndDate: SystemIntakeGRBReviewFragment['grbReviewAsyncEndDate'];
};

const Participants = ({ grbReview }: GRBReviewFormStepProps) => {
  const { t } = useTranslation('grbReview');

  const history = useHistory();
  const { pathname } = useLocation();

  const reviewType: SystemIntakeGRBReviewType = grbReview.grbReviewType;

  const [mutate] =
    useUpdateSystemIntakeGRBReviewFormInputTimeframeAsyncMutation();

  const form = useEasiForm<ParticipantsFields>({
    resolver:
      reviewType === SystemIntakeGRBReviewType.ASYNC
        ? yupResolver(SetGRBParticipantsAsyncSchema)
        : undefined,
    defaultValues: {
      grbReviewers: grbReview.grbReviewers,
      grbReviewAsyncEndDate: grbReview.grbReviewAsyncEndDate || ''
    },
    values: {
      grbReviewers: grbReview.grbReviewers,
      grbReviewAsyncEndDate: grbReview.grbReviewAsyncEndDate || ''
    }
  });
  const {
    control,
    formState: { errors }
  } = form;

  const onSubmit: GRBReviewFormStepSubmit<ParticipantsFields> = async input => {
    return mutate({
      variables: {
        input: {
          systemIntakeID: grbReview.id,
          grbReviewAsyncEndDate: input.grbReviewAsyncEndDate ?? ''
        }
      }
    });
  };

  return (
    <EasiFormProvider<ParticipantsFields> {...form}>
      <GRBReviewFormStepWrapper<ParticipantsFields>
        grbReview={grbReview}
        onSubmit={onSubmit}
        requiredFields={reviewType === SystemIntakeGRBReviewType.ASYNC}
      >
        <Alert type="info" slim>
          {t('setUpGrbReviewForm.participants.standardAlert')}
        </Alert>
        <FormGroup error={!!errors.grbReviewers} className="margin-top-0">
          <Grid col={12} tablet={{ col: 6 }}>
            <div className="margin-top-5 border-top-1px border-base-light padding-top-1">
              <p className="text-bold margin-y-0">
                {t('setUpGrbReviewForm.participants.grbReviewers.heading')}
                {reviewType === SystemIntakeGRBReviewType.ASYNC && (
                  <RequiredAsterisk />
                )}
              </p>
              {!!errors.grbReviewers && (
                <FieldErrorMsg>{errors.grbReviewers.message}</FieldErrorMsg>
              )}
              <p className="margin-y-0 text-base-dark line-height-sans-4">
                {t('setUpGrbReviewForm.participants.grbReviewers.description')}
              </p>
              <Button
                type="button"
                onClick={() =>
                  history.push({
                    pathname: `${pathname.replace('participants', 'add')}`,
                    search: 'from-grb-setup'
                  })
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
          </Grid>
          <Grid col={12} tablet={{ col: 10 }}>
            <ParticipantsTable grbReviewers={grbReview.grbReviewers} />
          </Grid>
        </FormGroup>
        {reviewType === SystemIntakeGRBReviewType.ASYNC && (
          <Grid col={12} tablet={{ col: 6 }}>
            <div className="margin-top-5 border-top-1px border-base-light padding-top-1">
              <p className="text-bold margin-y-0">
                {t('setUpGrbReviewForm.participants.timeframe.heading')}
              </p>
              <p className="margin-top-0 margin-bottom-3 text-base-dark">
                {t('setUpGrbReviewForm.participants.timeframe.description')}
              </p>

              <Controller
                control={control}
                name="grbReviewAsyncEndDate"
                render={({
                  field: { ref, ...field },
                  fieldState: { error }
                }) => (
                  <>
                    <FormGroup
                      error={!!errors.grbReviewAsyncEndDate}
                      className="margin-top-0"
                    >
                      <Fieldset>
                        <p className="margin-top-0 margin-bottom-1">
                          {t(
                            'setUpGrbReviewForm.participants.selectReviewEndDate.heading'
                          )}
                          <RequiredAsterisk />
                        </p>
                        {!!error && (
                          <FieldErrorMsg>
                            {t('setUpGrbReviewForm.invalidDate')}
                          </FieldErrorMsg>
                        )}
                        <p className="margin-y-0 text-base-dark line-height-sans-4">
                          {t(
                            'setUpGrbReviewForm.participants.selectReviewEndDate.description'
                          )}
                        </p>

                        <DatePickerFormatted
                          id="grbReviewAsyncEndDate"
                          {...field}
                          dateInPastWarning
                          value={field.value ?? ''}
                          onChange={date => {
                            if (date !== field.value) {
                              field.onChange(date || ''); // Only update when there's a change
                            }
                          }}
                        />
                      </Fieldset>
                    </FormGroup>
                  </>
                )}
              />
            </div>
          </Grid>
        )}
      </GRBReviewFormStepWrapper>
    </EasiFormProvider>
  );
};

export default Participants;
