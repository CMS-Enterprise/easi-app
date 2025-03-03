import React from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Fieldset, FormGroup } from '@trussworks/react-uswds';
import {
  SystemIntakeGRBReviewFragment,
  SystemIntakeGRBReviewType,
  useUpdateSystemIntakeGRBReviewTypeMutation
} from 'gql/generated/graphql';

import { EasiFormProvider, useEasiForm } from 'components/EasiForm';
import { RadioField } from 'components/RadioField';
import RequiredAsterisk from 'components/RequiredAsterisk';

import GRBReviewFormStepWrapper, {
  GRBReviewFormStepSubmit
} from './GRBReviewFormStepWrapper';

type ReviewTypeFields = {
  grbReviewType: SystemIntakeGRBReviewType;
};

type ReviewTypeProps = {
  grbReview: SystemIntakeGRBReviewFragment;
};

const ReviewType = ({ grbReview }: ReviewTypeProps) => {
  const { t } = useTranslation('grbReview');

  const [mutate] = useUpdateSystemIntakeGRBReviewTypeMutation();

  const form = useEasiForm<ReviewTypeFields>({
    defaultValues: {
      grbReviewType: grbReview.grbReviewType
    }
  });

  const {
    control,
    formState: { errors }
  } = form;

  const onSubmit: GRBReviewFormStepSubmit<ReviewTypeFields> = async input =>
    mutate({ variables: { input } });

  return (
    <EasiFormProvider<ReviewTypeFields> {...form}>
      <GRBReviewFormStepWrapper<ReviewTypeFields>
        onSubmit={onSubmit}
        grbReview={grbReview}
      >
        <FormGroup error={!!errors.grbReviewType} className="margin-top-5">
          <Fieldset>
            <legend className="text-bold">
              {t('setUpGrbReviewForm.reviewType.label')} <RequiredAsterisk />
            </legend>

            <Controller
              control={control}
              name="grbReviewType"
              render={({ field: { ref, ...field }, fieldState: { error } }) => (
                <>
                  <RadioField
                    {...field}
                    id="grbReviewTypeAsync"
                    value={SystemIntakeGRBReviewType.ASYNC}
                    label={t('setUpGrbReviewForm.reviewType.async')}
                    checked={field.value === SystemIntakeGRBReviewType.ASYNC}
                  />

                  <RadioField
                    {...field}
                    id="grbReviewTypeStandard"
                    value={SystemIntakeGRBReviewType.STANDARD}
                    label={t('setUpGrbReviewForm.reviewType.standard')}
                    checked={field.value === SystemIntakeGRBReviewType.STANDARD}
                  />
                </>
              )}
            />
          </Fieldset>
        </FormGroup>
      </GRBReviewFormStepWrapper>
    </EasiFormProvider>
  );
};

export default ReviewType;
