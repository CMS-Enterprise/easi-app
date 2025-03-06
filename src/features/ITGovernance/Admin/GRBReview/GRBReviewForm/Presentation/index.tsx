import React from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Fieldset, FormGroup, Grid } from '@trussworks/react-uswds';
import {
  SystemIntakeGRBReviewType,
  UpdateSystemIntakeGRBReviewPresentationMutationVariables,
  useUpdateSystemIntakeGRBReviewPresentationMutation
} from 'gql/generated/graphql';

import { EasiFormProvider, useEasiForm } from 'components/EasiForm';
import { RadioField } from 'components/RadioField';
import RequiredAsterisk from 'components/RequiredAsterisk';
import { GRBReviewFormStepProps } from 'types/grbReview';
import { fileToBase64File } from 'utils/downloadFile';

import SendPresentationReminder from '../../SendPresentationReminder';
import GRBReviewFormStepWrapper, {
  GRBReviewFormStepSubmit
} from '../GRBReviewFormStepWrapper';

type StandardPresentationFields =
  UpdateSystemIntakeGRBReviewPresentationMutationVariables;

type AsyncPresentationFields = {};

const Presentation = ({ grbReview }: GRBReviewFormStepProps) => {
  const { t } = useTranslation('grbReview');

  const standardForm = useEasiForm<StandardPresentationFields>({
    defaultValues: {
      reviewType: {
        systemIntakeID: grbReview.id,
        grbReviewType: grbReview.grbReviewType
      },
      links: {
        systemIntakeID: grbReview.id,
        presentationDeckFileData: {
          name: grbReview.grbPresentationLinks?.presentationDeckFileName || ''
        } as File
      }
    }
  });

  const asyncForm = useEasiForm<AsyncPresentationFields>();

  const [mutate] = useUpdateSystemIntakeGRBReviewPresentationMutation({
    refetchQueries: ['GetSystemIntakeGRBReview']
  });

  const {
    control,
    watch,
    formState: { errors }
  } = standardForm;

  const onSubmit: GRBReviewFormStepSubmit<
    UpdateSystemIntakeGRBReviewPresentationMutationVariables
  > = async input => {
    const newFile = input.links.presentationDeckFileData
      ? await fileToBase64File(input.links.presentationDeckFileData)
      : null;

    mutate({
      variables: {
        reviewType: {
          systemIntakeID: input.systemIntakeID,
          grbReviewType: input.reviewType.grbReviewType
        },
        links: {
          systemIntakeID: input.systemIntakeID,
          presentationDeckFileData: newFile
        }
      }
    });
  };

  // const hasRequiredFieldErrors =
  //   !!errors?.links?.presentationDeckFileData ||
  //   !grbReview.presentationDeckFileData?.name;

  return (
    <>
      {grbReview.grbReviewType === SystemIntakeGRBReviewType.STANDARD ? (
        <EasiFormProvider<StandardPresentationFields> {...standardForm}>
          <GRBReviewFormStepWrapper grbReview={grbReview} onSubmit={onSubmit}>
            <Fieldset>
              <Grid desktop={{ col: 6 }}>
                <FormGroup
                  error={!!errors.reviewType?.grbReviewType}
                  className="margin-top-5"
                >
                  <legend className="text-bold">
                    {t('setUpGrbReviewForm.reviewType.label')}{' '}
                    <RequiredAsterisk />
                  </legend>

                  <Controller
                    control={control}
                    name="reviewType.grbReviewType"
                    render={({
                      field: { ref, ...field },
                      fieldState: { error }
                    }) => (
                      <>
                        <RadioField
                          {...field}
                          id="grbReviewTypeAsync"
                          value={SystemIntakeGRBReviewType.ASYNC}
                          label={t('setUpGrbReviewForm.reviewType.async')}
                          checked={
                            field.value === SystemIntakeGRBReviewType.ASYNC
                          }
                        />

                        <RadioField
                          {...field}
                          id="grbReviewTypeStandard"
                          value={SystemIntakeGRBReviewType.STANDARD}
                          label={t('setUpGrbReviewForm.reviewType.standard')}
                          checked={
                            field.value === SystemIntakeGRBReviewType.STANDARD
                          }
                        />
                      </>
                    )}
                  />
                </FormGroup>
                <FormGroup
                  // error={hasRequiredFieldErrors}
                  className="margin-top-6"
                >
                  <Controller
                    control={control}
                    name="links.presentationDeckFileData"
                    render={({ field: { ref, ...field } }) => {
                      return (
                        <SendPresentationReminder
                          systemIntakeID={grbReview.id}
                          presentationDeckFileURL={
                            grbReview.grbPresentationLinks
                              ?.presentationDeckFileURL
                          }
                          presentationDeckFileName={
                            watch('links.presentationDeckFileData')?.name
                          }
                          canDownload={
                            !watch('links.presentationDeckFileData')?.size
                          }
                          name={field.name}
                          id={field.name}
                          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                          aria-describedby="presentationDeckHelpText"
                          className="maxw-none"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            field.onChange(e.currentTarget?.files?.[0])
                          }
                          clearFile={() => field.onChange(null)}
                        />
                      );
                    }}
                  />
                </FormGroup>
              </Grid>
            </Fieldset>
          </GRBReviewFormStepWrapper>
        </EasiFormProvider>
      ) : (
        <EasiFormProvider<AsyncPresentationFields> {...asyncForm}>
          <GRBReviewFormStepWrapper
            grbReview={grbReview}
            onSubmit={async () => null}
          >
            <p>Fields here</p>
          </GRBReviewFormStepWrapper>
        </EasiFormProvider>
      )}
    </>
  );
};

export default Presentation;
