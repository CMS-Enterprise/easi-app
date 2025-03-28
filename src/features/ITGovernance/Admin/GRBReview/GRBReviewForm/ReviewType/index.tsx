import React from 'react';
import { Controller } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Fieldset,
  FormGroup,
  Radio,
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading
} from '@trussworks/react-uswds';
import {
  SystemIntakeGRBReviewFragment,
  SystemIntakeGRBReviewType,
  useUpdateSystemIntakeGRBReviewTypeMutation
} from 'gql/generated/graphql';

import { EasiFormProvider, useEasiForm } from 'components/EasiForm';
import RequiredAsterisk from 'components/RequiredAsterisk';
import { GrbReviewTypeSchema } from 'validations/grbReviewSchema';

import GRBReviewFormStepWrapper, {
  GRBReviewFormStepSubmit
} from '../GRBReviewFormStepWrapper';

import './index.scss';

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
    resolver: yupResolver(GrbReviewTypeSchema),
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
        <FormGroup error={!!errors.grbReviewType}>
          <Fieldset>
            <legend className="text-bold">
              {t('setUpGrbReviewForm.reviewType.label')} <RequiredAsterisk />
            </legend>

            <Controller
              control={control}
              name="grbReviewType"
              render={({ field: { ref, ...field } }) => (
                <>
                  <Radio
                    {...field}
                    inputRef={ref}
                    id="grbReviewTypeAsync"
                    value={SystemIntakeGRBReviewType.ASYNC}
                    label={t('setUpGrbReviewForm.reviewType.async')}
                    checked={field.value === SystemIntakeGRBReviewType.ASYNC}
                  />

                  <Radio
                    {...field}
                    inputRef={ref}
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

        <div className="review-type-sidebar">
          <SummaryBox>
            <SummaryBoxHeading headingLevel="h3">
              {t('setUpGrbReviewForm.reviewType.summaryHeading')}
            </SummaryBoxHeading>
            <SummaryBoxContent>
              <ul className="padding-left-3 margin-bottom-0 font-body-sm line-height-body-5">
                <li>
                  <Trans
                    i18nKey="grbReview:setUpGrbReviewForm.reviewType.asyncSummary"
                    components={{ span: <span className="text-bold" /> }}
                  />
                </li>
                <li>
                  <Trans
                    i18nKey="grbReview:setUpGrbReviewForm.reviewType.standardSummary"
                    components={{ span: <span className="text-bold" /> }}
                  />
                </li>
              </ul>
            </SummaryBoxContent>
          </SummaryBox>
        </div>
      </GRBReviewFormStepWrapper>
    </EasiFormProvider>
  );
};

export default ReviewType;
