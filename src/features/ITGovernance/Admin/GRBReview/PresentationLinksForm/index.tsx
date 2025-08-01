import React from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Fieldset,
  Form,
  FormGroup,
  Grid,
  Icon,
  TextInput
} from '@trussworks/react-uswds';
import {
  SystemIntakeGRBPresentationLinksFragment,
  SystemIntakeGRBPresentationLinksInput,
  SystemIntakeGRBReviewType,
  useUpdateSystemIntakeGRBReviewAsyncPresentationMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import DatePickerFormatted from 'components/DatePickerFormatted';
import { useEasiForm } from 'components/EasiForm';
import FileInput from 'components/FileInput';
import HelpText from 'components/HelpText';
import IconLink from 'components/IconLink';
import Label from 'components/Label';
import MainContent from 'components/MainContent';
import { TabPanel, Tabs } from 'components/Tabs';
import useMessage from 'hooks/useMessage';
import { fileToBase64File } from 'utils/downloadFile';
import { SetGRBPresentationLinksSchema } from 'validations/grbReviewSchema';

import SendPresentationReminder from '../SendPresentationReminder';

import './index.scss';

type PresentationLinkFields = Omit<
  SystemIntakeGRBPresentationLinksInput,
  'systemIntakeID'
> & {
  grbReviewAsyncRecordingTime?: string | null;
};

type PresentationLinksFormProps = {
  id: string;
  grbReviewType: SystemIntakeGRBReviewType;
  grbPresentationLinks?: SystemIntakeGRBPresentationLinksFragment | null;
  grbReviewAsyncRecordingTime?: string | null;
};

/**
 * Form to add or edit GRB review presentation links
 */
const PresentationLinksForm = ({
  id,
  grbReviewType,
  grbPresentationLinks,
  grbReviewAsyncRecordingTime
}: PresentationLinksFormProps) => {
  const { t } = useTranslation('grbReview');
  const { showMessage, showMessageOnNextPage, Message } = useMessage();
  const history = useHistory();

  const [setPresentationLinks] =
    useUpdateSystemIntakeGRBReviewAsyncPresentationMutation({
      refetchQueries: ['GetSystemIntakeGRBReview']
    });

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid, isDirty, defaultValues }
  } = useEasiForm<PresentationLinkFields>({
    resolver: yupResolver(SetGRBPresentationLinksSchema),
    defaultValues: {
      grbReviewAsyncRecordingTime:
        grbReviewType === SystemIntakeGRBReviewType.ASYNC
          ? grbReviewAsyncRecordingTime
          : null,
      recordingLink: grbPresentationLinks?.recordingLink,
      recordingPasscode: grbPresentationLinks?.recordingPasscode,
      transcriptLink: grbPresentationLinks?.transcriptLink,
      // Only include file name in default values
      transcriptFileData: {
        name: grbPresentationLinks?.transcriptFileName || ''
      } as File,
      presentationDeckFileData: {
        name: grbPresentationLinks?.presentationDeckFileName || ''
      } as File
    }
  });

  const formType: 'add' | 'edit' = grbPresentationLinks ? 'edit' : 'add';

  const grbReviewPath = `/it-governance/${id}/grb-review`;

  /**
   * Returns true if both recordingLink and presentationDeckFileData fields have errors
   */
  const hasRequiredFieldErrors =
    !!errors?.recordingLink &&
    (!!errors?.presentationDeckFileData ||
      !defaultValues?.presentationDeckFileData?.name);

  /** Submit form to set GRB review presentation links */
  const submit = handleSubmit(
    async ({ grbReviewAsyncRecordingTime: recordingTime, ...links }) => {
      // Only include newly updated file data, not default values
      // File data from default values does not have `size` field
      const transcriptFileData = links.transcriptFileData?.size
        ? await fileToBase64File(links.transcriptFileData)
        : undefined;

      const presentationDeckFileData = links.presentationDeckFileData?.size
        ? await fileToBase64File(links.presentationDeckFileData)
        : undefined;

      setPresentationLinks({
        variables: {
          asyncRecordingDate: {
            systemIntakeID: id,
            grbReviewAsyncRecordingTime: recordingTime
          },
          links: {
            systemIntakeID: id,
            ...links,
            transcriptFileData:
              links.transcriptFileData === null ? null : transcriptFileData,
            presentationDeckFileData:
              links.presentationDeckFileData === null
                ? null
                : presentationDeckFileData
          }
        }
      })
        .then(() => {
          showMessageOnNextPage(t(`presentationLinks.success`), {
            type: 'success'
          });

          history.push(grbReviewPath);
        })
        .catch(() => {
          showMessage(t(`presentationLinks.error`), { type: 'error' });

          // Scroll to error
          const err = document.querySelector('.usa-alert');
          err?.scrollIntoView();
        });
    }
  );

  return (
    <MainContent className="grid-container">
      <Message className="margin-top-2" />

      {hasRequiredFieldErrors && (
        <Alert type="error" slim className="margin-top-2">
          {t('presentationLinks.emptyFormError')}
        </Alert>
      )}

      <Grid className="margin-top-7 margin-bottom-10 padding-bottom-3">
        <h1 className="margin-bottom-1">
          {t('presentationLinks.heading', { context: formType })}
        </h1>
        <p className="font-body-md line-height-body-4 text-light margin-top-05 margin-bottom-105">
          {t('presentationLinks.description', { context: formType })}
        </p>

        <IconLink
          icon={<Icon.ArrowBack aria-hidden />}
          className="margin-top-3 margin-bottom-5"
          to={grbReviewPath}
        >
          {t('presentationLinks.returnLink', { formType })}
        </IconLink>

        <Form onSubmit={submit} className="maxw-none tablet:grid-col-6">
          {grbReviewType === SystemIntakeGRBReviewType.ASYNC && (
            <section className="border-top-1px border-base-lighter margin-top-3">
              <h4 className="margin-top-1 margin-bottom-05">
                {t('presentationGRBReviewForm.asyncHeading')}
              </h4>

              <p className="margin-y-0 text-base">
                {t('presentationGRBReviewForm.asyncDescription')}
              </p>

              <Alert type="info" slim className="margin-top-105">
                {t('presentationGRBReviewForm.alert')}
              </Alert>

              <FormGroup>
                <Label
                  htmlFor="grbReviewAsyncRecordingTime"
                  className="text-normal"
                >
                  {t('presentationGRBReviewForm.asyncRecordingDateLabel')}
                </Label>

                <HelpText
                  className="margin-top-05"
                  id="grbReviewAsyncRecordingTimeHelpText"
                >
                  {t('presentationGRBReviewForm.meetingDateDescription')}
                </HelpText>

                <Controller
                  name="grbReviewAsyncRecordingTime"
                  control={control}
                  shouldUnregister
                  render={({ field: { ref, ...field } }) => (
                    <DatePickerFormatted
                      {...field}
                      id={field.name}
                      aria-describedby="grbReviewAsyncRecordingTimeHelpText"
                      value={field.value || ''}
                      dateInPastWarning
                      suppressMilliseconds
                    />
                  )}
                />
              </FormGroup>
            </section>
          )}

          <section className="border-top-1px border-base-lighter margin-top-4">
            <h4 className="margin-top-1 margin-bottom-05">
              {t('presentationGRBReviewForm.forTheReviewers')}
            </h4>

            <p className="margin-y-0 text-base">
              {t('presentationGRBReviewForm.reviewersDescription')}
            </p>

            <FormGroup error={hasRequiredFieldErrors}>
              <Label htmlFor="recordingLink" className="text-normal">
                {t('presentationLinks.recordingLinkLabel')}
              </Label>
              <HelpText id="recordingLinkHelpText" className="margin-top-05">
                {t('presentationLinks.recordingLinkHelpText')}
              </HelpText>

              <TextInput
                {...register('recordingLink')}
                ref={null}
                id="recordingLink"
                aria-describedby="recordingLinkHelpText"
                type="text"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="recordingPasscode" className="text-normal">
                {t('presentationLinks.recordingPasscodeLabel')}
              </Label>
              <HelpText
                id="recordingPasscodeHelpText"
                className="margin-top-05"
              >
                {t('presentationLinks.recordingPasscodeHelpText')}
              </HelpText>

              <TextInput
                {...register('recordingPasscode')}
                ref={null}
                id="recordingPasscode"
                aria-describedby="recordingPasscodeHelpText"
                type="text"
              />
            </FormGroup>

            <FormGroup>
              <Fieldset id="transcriptFields">
                <legend>{t('presentationLinks.transcript')}</legend>
                <HelpText id="transcriptHelpText" className="margin-top-05">
                  {t('presentationLinks.transcriptHelpText')}
                </HelpText>

                <Tabs
                  className="margin-top-105"
                  // Default to upload document tab when document has been uploaded
                  defaultActiveTab={
                    defaultValues?.transcriptFileData?.name
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
                      {...register('transcriptLink', {
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
                      control={control}
                      name="transcriptFileData"
                      shouldUnregister
                      render={({ field: { ref, ...field } }) => (
                        <FileInput
                          defaultFileName={
                            defaultValues?.transcriptFileData?.name
                          }
                          name={field.name}
                          id={field.name}
                          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                          aria-describedby="transcriptHelpText transcriptFileDataHelpText"
                          className="maxw-none"
                          clearFile={() => field.onChange(null)}
                          onChange={e =>
                            field.onChange(e.currentTarget?.files?.[0])
                          }
                        />
                      )}
                    />
                  </TabPanel>
                </Tabs>
              </Fieldset>
            </FormGroup>

            <FormGroup error={hasRequiredFieldErrors} className="margin-top-6">
              <Controller
                control={control}
                name="presentationDeckFileData"
                render={({ field: { ref, ...field } }) => {
                  return (
                    <SendPresentationReminder
                      systemIntakeID={id}
                      presentationDeckFileURL={
                        grbPresentationLinks?.presentationDeckFileURL
                      }
                      presentationDeckFileName={
                        watch('presentationDeckFileData')?.name
                      }
                      canDownload={!watch('presentationDeckFileData')?.size}
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
          </section>

          <Alert type="info" slim className="margin-top-6">
            {t('presentationLinks.uploadAlert')}
          </Alert>

          <Button
            type="submit"
            className="margin-top-205"
            disabled={!isValid || !isDirty}
          >
            {t('presentationLinks.savePresentationDetails')}
          </Button>
        </Form>

        <IconLink
          icon={<Icon.ArrowBack aria-hidden />}
          className="margin-top-205"
          to={grbReviewPath}
        >
          {t('presentationLinks.returnLink', { formType })}
        </IconLink>
      </Grid>
    </MainContent>
  );
};

export default PresentationLinksForm;
