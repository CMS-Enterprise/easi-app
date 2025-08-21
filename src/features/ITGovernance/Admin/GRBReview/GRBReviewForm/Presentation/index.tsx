import React from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ErrorMessage } from '@hookform/error-message';
import {
  Fieldset,
  FormGroup,
  Grid,
  Label,
  TextInput
} from '@trussworks/react-uswds';
import {
  SystemIntakeGRBReviewType,
  UpdateSystemIntakeGRBReviewAsyncPresentationMutationVariables as AsyncPresentationFields,
  useUpdateSystemIntakeGRBReviewAsyncPresentationMutation,
  useUpdateSystemIntakeGRBReviewStandardPresentationMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import DatePickerFormatted from 'components/DatePickerFormatted';
import DateTimePicker from 'components/DateTimePicker';
import { EasiFormProvider, useEasiForm } from 'components/EasiForm';
import FieldErrorMsg from 'components/FieldErrorMsg';
import FileInput from 'components/FileInput';
import HelpText from 'components/HelpText';
import { TabPanel, Tabs } from 'components/Tabs';
import { GRBReviewFormStepProps } from 'types/grbReview';
import { fileToBase64File } from 'utils/downloadFile';

import SendPresentationReminder from '../../SendPresentationReminder';
import GRBReviewFormStepWrapper, {
  GRBReviewFormStepSubmit
} from '../GRBReviewFormStepWrapper';

type StandardPresentationFields = {
  grbMeetingDate: {
    grbDate: string;
  };
  presentationDeck: {
    presentationDeckFileData: File | null;
  };
};

const Presentation = ({ grbReview }: GRBReviewFormStepProps) => {
  const { t } = useTranslation('grbReview');

  const standardForm = useEasiForm<StandardPresentationFields>({
    defaultValues: {
      grbMeetingDate: {
        grbDate: grbReview.grbDate || ''
      },
      presentationDeck: {
        presentationDeckFileData: {
          name: grbReview.grbPresentationLinks?.presentationDeckFileName || ''
        } as File
      }
    }
  });

  const asyncForm = useEasiForm<AsyncPresentationFields>({
    defaultValues: {
      asyncRecordingDate: {
        systemIntakeID: grbReview.id,
        grbReviewAsyncRecordingTime: grbReview.grbReviewAsyncRecordingTime || ''
      },
      links: {
        recordingLink: grbReview.grbPresentationLinks?.recordingLink,
        recordingPasscode: grbReview.grbPresentationLinks?.recordingPasscode,
        transcriptLink: grbReview.grbPresentationLinks?.transcriptLink,
        // Only include file name in default values
        transcriptFileData: {
          name: grbReview.grbPresentationLinks?.transcriptFileName || ''
        } as File,
        presentationDeckFileData: {
          name: grbReview.grbPresentationLinks?.presentationDeckFileName || ''
        } as File
      }
    }
  });

  const [mutateStandard] =
    useUpdateSystemIntakeGRBReviewStandardPresentationMutation({
      refetchQueries: ['GetSystemIntakeGRBReview']
    });

  const [mutateAsync] = useUpdateSystemIntakeGRBReviewAsyncPresentationMutation(
    {
      refetchQueries: ['GetSystemIntakeGRBReview']
    }
  );

  const systemIntakeID = grbReview.id;

  const {
    control,
    watch,
    formState: { errors, isSubmitted }
  } = standardForm;

  const {
    control: controlAsync,
    register,
    watch: watchAsync,
    formState: { defaultValues }
  } = asyncForm;

  const onSubmitStandard: GRBReviewFormStepSubmit<
    StandardPresentationFields
  > = async input => {
    const presentationDeckFileData =
      input?.presentationDeck?.presentationDeckFileData;
    const grbDate = input?.grbMeetingDate?.grbDate;

    // Only include newly updated file data, not default values
    // File data from default values does not have `size` field
    const newFile = presentationDeckFileData?.size
      ? await fileToBase64File(presentationDeckFileData)
      : undefined;

    return mutateStandard({
      variables: {
        grbMeetingDate: {
          systemIntakeID,
          grbDate
        },
        presentationDeck: {
          systemIntakeID,
          presentationDeckFileData:
            presentationDeckFileData === null ? null : newFile
        }
      }
    });
  };

  const onSubmitAsync: GRBReviewFormStepSubmit<
    AsyncPresentationFields
  > = async input => {
    const { links, asyncRecordingDate } = input;

    // Only include newly updated file data, not default values
    // File data from default values does not have `size` field
    const transcriptFileData = links?.transcriptFileData?.size
      ? await fileToBase64File(links.transcriptFileData)
      : undefined;

    const presentationDeckFileData = links?.presentationDeckFileData?.size
      ? await fileToBase64File(links.presentationDeckFileData)
      : undefined;

    return mutateAsync({
      variables: {
        asyncRecordingDate: {
          systemIntakeID,
          grbReviewAsyncRecordingTime:
            asyncRecordingDate?.grbReviewAsyncRecordingTime || null
        },
        links: {
          systemIntakeID,
          transcriptFileData:
            links?.transcriptFileData === null ? null : transcriptFileData,
          presentationDeckFileData:
            links?.presentationDeckFileData === null
              ? null
              : presentationDeckFileData,
          recordingLink: links?.recordingLink,
          recordingPasscode: links?.recordingPasscode,
          transcriptLink: links?.transcriptLink
        }
      }
    });
  };

  return (
    <>
      {grbReview.grbReviewType === SystemIntakeGRBReviewType.STANDARD ? (
        <EasiFormProvider<StandardPresentationFields> {...standardForm}>
          <GRBReviewFormStepWrapper
            grbReview={grbReview}
            onSubmit={onSubmitStandard}
          >
            <Grid desktop={{ col: 6 }}>
              <div className="border-top-1px border-base-lighter margin-top-3 easi-text-normal">
                <h4 className="margin-top-1 margin-bottom-05">
                  {t('presentationGRBReviewForm.heading')}
                </h4>

                <p className="margin-y-0 text-base">
                  {t('presentationGRBReviewForm.description')}
                </p>

                <Alert type="info" slim className="margin-top-105">
                  {t('presentationGRBReviewForm.alert')}
                </Alert>

                <Controller
                  name="grbMeetingDate.grbDate"
                  control={control}
                  rules={{
                    required: t<string>('presentationGRBReviewForm.required')
                  }}
                  render={({ field: { ref, ...field } }) => (
                    <FormGroup>
                      <Label
                        htmlFor={field.name}
                        className="text-normal"
                        requiredMarker
                      >
                        {t('presentationGRBReviewForm.meetingDateLabel')}
                      </Label>

                      <HelpText className="margin-top-1">
                        {t('presentationGRBReviewForm.meetingDateDescription')}
                      </HelpText>

                      <ErrorMessage
                        errors={errors}
                        name="grbMeetingDate.grbDate"
                        as={<FieldErrorMsg />}
                      />

                      <DateTimePicker id={field.name} {...field} />
                    </FormGroup>
                  )}
                />

                <Controller
                  control={control}
                  name="presentationDeck.presentationDeckFileData"
                  render={({ field: { ref, ...field } }) => {
                    return (
                      <FormGroup className="margin-top-6">
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
                          className="maxw-none margin-bottom-0"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            field.onChange(e.currentTarget?.files?.[0])
                          }
                          clearFile={() => field.onChange(null)}
                        />{' '}
                      </FormGroup>
                    );
                  }}
                />
              </div>
            </Grid>
          </GRBReviewFormStepWrapper>
        </EasiFormProvider>
      ) : (
        <EasiFormProvider<AsyncPresentationFields> {...asyncForm}>
          <GRBReviewFormStepWrapper
            grbReview={grbReview}
            onSubmit={onSubmitAsync}
            requiredFields={false}
          >
            <Grid desktop={{ col: 6 }}>
              <div className="border-top-1px border-base-lighter margin-top-3 easi-text-normal">
                <h4 className="margin-top-1 margin-bottom-05">
                  {t('presentationGRBReviewForm.asyncHeading')}
                </h4>

                <p className="margin-y-0 text-base">
                  {t('presentationGRBReviewForm.asyncDescription')}
                </p>

                <Alert type="info" slim className="margin-top-105">
                  {t('presentationGRBReviewForm.alert')}
                </Alert>

                <Controller
                  name="asyncRecordingDate.grbReviewAsyncRecordingTime"
                  control={controlAsync}
                  render={({ field: { ref, ...field } }) => (
                    <FormGroup>
                      <Label htmlFor={field.name} className="text-normal">
                        {t('presentationGRBReviewForm.asyncRecordingDateLabel')}
                      </Label>

                      <HelpText className="margin-top-1">
                        {t('presentationGRBReviewForm.meetingDateDescription')}
                      </HelpText>

                      <ErrorMessage
                        errors={errors}
                        name="asyncRecordingDate.grbReviewAsyncRecordingTime"
                        render={({ message }) =>
                          isSubmitted && (
                            <FieldErrorMsg>{message}</FieldErrorMsg>
                          )
                        }
                      />

                      <DatePickerFormatted
                        {...field}
                        id={field.name}
                        defaultValue={field.value || ''}
                        value={field.value || ''}
                        onChange={e => field.onChange(e || undefined)}
                        dateInPastWarning
                        suppressMilliseconds
                      />
                    </FormGroup>
                  )}
                />
              </div>

              <div className="border-top-1px border-base-lighter margin-top-4">
                <h4 className="margin-top-1 margin-bottom-05">
                  {t('presentationGRBReviewForm.forTheReviewers')}
                </h4>

                <p className="margin-y-0 text-base">
                  {t('presentationGRBReviewForm.reviewersDescription')}
                </p>

                <FormGroup>
                  <Label htmlFor="links.recordingLink" className="text-normal">
                    {t('presentationLinks.recordingLinkLabel')}
                  </Label>

                  <HelpText
                    id="recordingLinkHelpText"
                    className="margin-top-05"
                  >
                    {t('presentationLinks.recordingLinkHelpText')}
                  </HelpText>

                  <TextInput
                    {...register('links.recordingLink')}
                    ref={null}
                    id="recordingLink"
                    aria-describedby="recordingLinkHelpText"
                    type="text"
                  />
                </FormGroup>

                <FormGroup>
                  <Label
                    htmlFor="links.recordingPasscode"
                    className="text-normal"
                  >
                    {t('presentationLinks.recordingPasscodeLabel')}
                  </Label>

                  <HelpText
                    id="recordingPasscodeHelpText"
                    className="margin-top-05"
                  >
                    {t('presentationLinks.recordingPasscodeHelpText')}
                  </HelpText>

                  <TextInput
                    {...register('links.recordingPasscode')}
                    ref={null}
                    id="recordingPasscode"
                    aria-describedby="recordingPasscodeHelpText"
                    type="text"
                  />
                </FormGroup>

                <FormGroup>
                  <Fieldset id="transcriptFields">
                    <Label htmlFor="transcriptLink" className="text-normal">
                      {t('presentationLinks.transcript')}
                    </Label>

                    <HelpText id="transcriptHelpText" className="margin-top-05">
                      {t('presentationLinks.transcriptHelpText')}
                    </HelpText>

                    <Tabs
                      className="margin-top-105"
                      // Default to upload document tab when document has been uploaded
                      defaultActiveTab={
                        defaultValues?.links?.transcriptFileData?.name
                          ? t('presentationLinks.uploadDocument')
                          : t('presentationLinks.addLink')
                      }
                    >
                      <TabPanel
                        id="addLink"
                        tabName={t('presentationLinks.addLink')}
                        className="outline-0"
                      >
                        <TextInput
                          {...register('links.transcriptLink', {
                            shouldUnregister: true
                          })}
                          ref={null}
                          id="transcriptLink"
                          aria-describedby="transcriptHelpText"
                          type="url"
                          className="margin-top-2"
                        />
                      </TabPanel>

                      <TabPanel
                        id="addDocument"
                        tabName={t('presentationLinks.uploadDocument')}
                        className="outline-0"
                      >
                        <HelpText
                          id="transcriptFileDataHelpText"
                          className="margin-top-2"
                        >
                          {t('presentationLinks.documentUploadHelpText')}
                        </HelpText>

                        <Controller
                          control={controlAsync}
                          name="links.transcriptFileData"
                          shouldUnregister
                          render={({ field: { ref, ...field } }) => (
                            <FileInput
                              defaultFileName={
                                defaultValues?.links?.transcriptFileData?.name
                              }
                              name={field.name}
                              id={field.name}
                              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                              aria-describedby="transcriptHelpText transcriptFileDataHelpText"
                              className="maxw-none"
                              clearFile={() => field.onChange(null)}
                              onChange={e =>
                                field.onChange(
                                  e.currentTarget?.files?.[0] || null
                                )
                              }
                            />
                          )}
                        />
                      </TabPanel>
                    </Tabs>
                  </Fieldset>
                </FormGroup>

                <FormGroup className="margin-top-6">
                  <Controller
                    control={controlAsync}
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
                            watchAsync('links.presentationDeckFileData')?.name
                          }
                          canDownload={
                            !watchAsync('links.presentationDeckFileData')?.size
                          }
                          name={field.name}
                          id={field.name}
                          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                          aria-describedby="presentationDeckHelpText"
                          className="maxw-none margin-bottom-0"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            field.onChange(e.currentTarget?.files?.[0])
                          }
                          clearFile={() => field.onChange(null)}
                        />
                      );
                    }}
                  />
                </FormGroup>
              </div>
            </Grid>
          </GRBReviewFormStepWrapper>
        </EasiFormProvider>
      )}
    </>
  );
};

export default Presentation;
