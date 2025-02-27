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
  InputMaybe,
  SystemIntakeGRBPresentationLinksInput,
  useSetSystemIntakeGRBPresentationLinksMutation
} from 'gql/generated/graphql';
import { SystemIntakeGRBPresentationLinks } from 'gql/legacyGQL/types/SystemIntakeGRBPresentationLinks';

import Alert from 'components/Alert';
import { useEasiForm } from 'components/EasiForm';
import FileInput from 'components/FileInput';
import HelpText from 'components/HelpText';
import IconLink from 'components/IconLink';
import Label from 'components/Label';
import { TabPanel, Tabs } from 'components/Tabs';
import useMessage from 'hooks/useMessage';
import { fileToBase64File } from 'utils/downloadFile';
import { SetGRBPresentationLinksSchema } from 'validations/grbReviewSchema';

import './index.scss';

type PresentationLinkFields = Omit<
  SystemIntakeGRBPresentationLinksInput,
  'systemIntakeID'
>;

type PresentationLinksFormProps = {
  id: string;
  // Pass presentation link to form if editing
  grbPresentationLinks?: SystemIntakeGRBPresentationLinks | null;
};

/**
 * Form to add or edit GRB review presentation links
 */
const PresentationLinksForm = ({
  id,
  grbPresentationLinks
}: PresentationLinksFormProps) => {
  const { t } = useTranslation('grbReview');
  const { showMessage, showMessageOnNextPage } = useMessage();
  const history = useHistory();

  const [setPresentationLinks] = useSetSystemIntakeGRBPresentationLinksMutation(
    { refetchQueries: ['GetSystemIntake'] }
  );

  const formType = grbPresentationLinks ? 'edit' : 'add';

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isDirty }
  } = useEasiForm<PresentationLinkFields>({
    resolver: yupResolver(SetGRBPresentationLinksSchema),
    context: { formType },
    defaultValues: {
      recordingLink: grbPresentationLinks?.recordingLink,
      recordingPasscode: grbPresentationLinks?.recordingPasscode,
      transcriptLink: grbPresentationLinks?.transcriptLink,

      // Set file data to `undefined` if file name exists
      // Used by form to determine when existing data should be cleared vs retained
      transcriptFileData: grbPresentationLinks?.transcriptFileName
        ? undefined
        : null,
      presentationDeckFileData: grbPresentationLinks?.presentationDeckFileName
        ? undefined
        : null
    }
  });

  const grbReviewPath = `/it-governance/${id}/grb-review`;

  /**
   * Formats file data only if file is not explicitly set to null or undefined
   *
   * Returns `null` to clear file data or `undefined` to retain existing data
   * */
  const formatFileData = async (file: InputMaybe<File> | undefined) => {
    // If file data exists, return formatted version
    if (file) return fileToBase64File(file);

    // Return null or undefined file value
    return file;
  };

  /** Submit form to set GRB review presentation links */
  const submit = handleSubmit(async values => {
    const transcriptFileData = await formatFileData(values?.transcriptFileData);

    const presentationDeckFileData = await formatFileData(
      values?.presentationDeckFileData
    );

    setPresentationLinks({
      variables: {
        input: {
          systemIntakeID: id,
          ...values,
          transcriptFileData,
          presentationDeckFileData
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
  });

  return (
    <>
      {
        // Error alert if both `recordingLink` and `presentationDeckFileData` fields are blank
        !!errors?.recordingLink && !!errors?.presentationDeckFileData && (
          <Alert type="error" slim className="margin-top-2">
            {t('presentationLinks.emptyFormError')}
          </Alert>
        )
      }

      <Grid
        tablet={{ col: 6 }}
        className="margin-top-7 margin-bottom-10 padding-bottom-3"
      >
        <h1 className="margin-bottom-1">
          {t('presentationLinks.heading', { context: formType })}
        </h1>
        <p className="font-body-md line-height-body-4 text-light margin-top-05 margin-bottom-105">
          {t('presentationLinks.description', { context: formType })}
        </p>

        <IconLink
          icon={<Icon.ArrowBack />}
          className="margin-top-3 margin-bottom-5"
          to={grbReviewPath}
        >
          {t('presentationLinks.returnLink', { formType })}
        </IconLink>

        <Form onSubmit={submit} className="maxw-none">
          <FormGroup error={!!errors?.recordingLink}>
            <Label htmlFor="recordingLink">
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
              type="url"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="recordingPasscode">
              {t('presentationLinks.recordingPasscodeLabel')}
            </Label>
            <HelpText id="recordingPasscodeHelpText" className="margin-top-05">
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
              <legend className="text-bold">
                {t('presentationLinks.transcript')}
              </legend>
              <HelpText id="transcriptHelpText" className="margin-top-05">
                {t('presentationLinks.transcriptHelpText')}
              </HelpText>

              <Tabs
                className="margin-top-105"
                // Default to upload document tab when document has been uploaded
                defaultActiveTab={
                  grbPresentationLinks?.transcriptFileName
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
                    {...register('transcriptLink', { shouldUnregister: true })}
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
                          grbPresentationLinks?.transcriptFileName
                        }
                        name={field.name}
                        id={field.name}
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                        aria-describedby="transcriptHelpText transcriptFileDataHelpText"
                        className="maxw-none"
                        onChange={field.onChange}
                      />
                    )}
                  />
                </TabPanel>
              </Tabs>
            </Fieldset>
          </FormGroup>

          <FormGroup error={!!errors?.presentationDeckFileData}>
            <Label htmlFor="presentationDeckFileData">
              {t('presentationLinks.presentationDeckLabel')}
            </Label>
            <HelpText id="presentationDeckHelpText" className="margin-top-05">
              {t('presentationLinks.documentUploadHelpText')}
            </HelpText>

            <Controller
              control={control}
              name="presentationDeckFileData"
              render={({ field: { ref, ...field } }) => {
                return (
                  <FileInput
                    defaultFileName={
                      grbPresentationLinks?.presentationDeckFileName
                    }
                    name={field.name}
                    id={field.name}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                    aria-describedby="presentationDeckHelpText"
                    className="maxw-none"
                    onChange={field.onChange}
                  />
                );
              }}
            />
          </FormGroup>

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
          icon={<Icon.ArrowBack />}
          className="margin-top-205"
          to={grbReviewPath}
        >
          {t('presentationLinks.returnLink', { formType })}
        </IconLink>
      </Grid>
    </>
  );
};

export default PresentationLinksForm;
