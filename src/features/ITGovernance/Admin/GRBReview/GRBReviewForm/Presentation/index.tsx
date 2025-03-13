import React from 'react';
import { Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DatePicker, FormGroup, Label } from '@trussworks/react-uswds';

import { EasiFormProvider, useEasiForm } from 'components/EasiForm';
import { GRBReviewFormStepProps } from 'types/grbReview';
import { GrbPresentationSchema } from 'validations/grbReviewSchema';

import GRBReviewFormStepWrapper, {
  GRBReviewFormStepSubmit
} from '../GRBReviewFormStepWrapper';

type PresentationFields = {
  grbDate: string;
};

const Presentation = ({ grbReview }: GRBReviewFormStepProps) => {
  const form = useEasiForm<PresentationFields>({
    resolver: yupResolver(GrbPresentationSchema),
    defaultValues: {
      grbDate: grbReview.grbDate || ''
    }
  });

  const { control } = form;

  return (
    <EasiFormProvider<PresentationFields> {...form}>
      <GRBReviewFormStepWrapper<PresentationFields>
        grbReview={grbReview}
        // TODO: Update onSubmit to return mutation
        onSubmit={(async () => null) as unknown as GRBReviewFormStepSubmit}
      >
        <Controller
          name="grbDate"
          control={control}
          render={({ field: { ref, ...field }, fieldState: { error } }) => (
            <FormGroup error={!!error}>
              <Label
                htmlFor={field.name}
                className="text-normal"
                requiredMarker
              >
                GRB Date
              </Label>

              <DatePicker
                {...field}
                id={field.name}
                defaultValue={field.value}
              />
            </FormGroup>
          )}
        />
      </GRBReviewFormStepWrapper>
    </EasiFormProvider>
  );
};

export default Presentation;
