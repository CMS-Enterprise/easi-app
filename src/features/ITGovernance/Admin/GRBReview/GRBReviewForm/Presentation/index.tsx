import React from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Fieldset, FormGroup, Grid, Label } from '@trussworks/react-uswds';
import { actionDateInPast } from 'features/ITGovernance/Admin/Actions/ManageLcid/RetireLcid';
import {
  SystemIntakeGRBReviewType,
  UpdateSystemIntakeGRBReviewStandardPresentationMutationVariables,
  useUpdateSystemIntakeGRBReviewStandardPresentationMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import DatePickerFormatted from 'components/DatePickerFormatted';
import { EasiFormProvider, useEasiForm } from 'components/EasiForm';
import FieldErrorMsg from 'components/FieldErrorMsg';
import HelpText from 'components/HelpText';
import { RadioField } from 'components/RadioField';
import RequiredAsterisk from 'components/RequiredAsterisk';
import { GRBReviewFormStepProps } from 'types/grbReview';
import { fileToBase64File } from 'utils/downloadFile';

import SendPresentationReminder from '../../SendPresentationReminder';
import GRBReviewFormStepWrapper, {
  GRBReviewFormStepSubmit
} from '../GRBReviewFormStepWrapper';

type StandardPresentationFields =
  UpdateSystemIntakeGRBReviewStandardPresentationMutationVariables;

type AsyncPresentationFields = {};

const Presentation = ({ grbReview }: GRBReviewFormStepProps) => {
  const { t } = useTranslation('grbReview');

  const standardForm = useEasiForm<StandardPresentationFields>({
    defaultValues: {
      grbMeetingDate: {
        systemIntakeID: grbReview.id,
        grbDate: grbReview.grbDate || ''
      },
      presentationDeck: {
        systemIntakeID: grbReview.id,
        presentationDeckFileData: {
          name: grbReview.grbPresentationLinks?.presentationDeckFileName || ''
        } as File
      }
    }
  });

  const asyncForm = useEasiForm<AsyncPresentationFields>();

  const [mutate] = useUpdateSystemIntakeGRBReviewStandardPresentationMutation({
    refetchQueries: ['GetSystemIntakeGRBReview']
  });

  const {
    control,
    watch,
    formState: { errors }
  } = standardForm;

  const onSubmit: GRBReviewFormStepSubmit<
    UpdateSystemIntakeGRBReviewStandardPresentationMutationVariables
  > = async input => {
    const newFile = input.presentationDeck.presentationDeckFileData
      ? await fileToBase64File(input.presentationDeck.presentationDeckFileData)
      : null;

    mutate({
      variables: {
        grbMeetingDate: {
          systemIntakeID: input.systemIntakeID,
          grbDate: input.grbMeetingDate.grbDate
        },
        presentationDeck: {
          systemIntakeID: input.systemIntakeID,
          presentationDeckFileData: newFile
        }
      }
    });
  };

  // const hasRequiredFieldErrors =
  //   !!errors?.links?.presentationDeckFileData ||
  //   !grbReview.presentationDeckFileData?.name;

  console.log(watch('grbMeetingDate.grbDate'));

  return (
    <>
      {grbReview.grbReviewType === SystemIntakeGRBReviewType.STANDARD ? (
        <EasiFormProvider<StandardPresentationFields> {...standardForm}>
          <GRBReviewFormStepWrapper grbReview={grbReview} onSubmit={onSubmit}>
            <Fieldset>
              <Grid desktop={{ col: 6 }}>
                <FormGroup
                  error={!!errors.grbMeetingDate?.grbDate}
                  className="margin-top-5"
                >
                  <Controller
                    name="grbMeetingDate.grbDate"
                    control={control}
                    render={({
                      field: { ref, ...field },
                      fieldState: { error }
                    }) => (
                      <FormGroup error={!!error}>
                        <Label
                          htmlFor={field.name}
                          className="text-normal"
                          requiredMarker
                        >
                          {t('presentationGRBReviewForm.meetingDate')}
                        </Label>

                        <HelpText className="margin-top-1">
                          {t(
                            'presentationGRBReviewForm.meetingDateDescription'
                          )}
                        </HelpText>

                        {!!error?.message && (
                          <FieldErrorMsg>{t(error.message)}</FieldErrorMsg>
                        )}

                        <DatePickerFormatted
                          {...field}
                          id={field.name}
                          defaultValue={field.value}
                          onChange={e => field.onChange(e || undefined)}
                        />
                        {
                          // If past date is selected, show alert
                          actionDateInPast(field.value || null) && (
                            <Alert type="warning" slim>
                              {t('pastDateAlert')}
                            </Alert>
                          )
                        }
                      </FormGroup>
                    )}
                  />
                </FormGroup>
                <FormGroup
                  // error={hasRequiredFieldErrors}
                  className="margin-top-6"
                >
                  <Controller
                    control={control}
                    name="presentationDeck.presentationDeckFileData"
                    render={({ field: { ref, ...field } }) => {
                      return (
                        <SendPresentationReminder
                          systemIntakeID={grbReview.id}
                          presentationDeckFileURL={
                            grbReview.grbPresentationLinks
                              ?.presentationDeckFileURL
                          }
                          presentationDeckFileName={
                            watch('presentationDeck.presentationDeckFileData')
                              ?.name
                          }
                          canDownload={
                            !watch('presentationDeck.presentationDeckFileData')
                              ?.size
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
      )}
    </>
  );
};

export default Presentation;
