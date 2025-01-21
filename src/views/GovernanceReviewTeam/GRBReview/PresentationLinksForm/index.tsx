import React from 'react';
import { Controller } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ErrorMessage } from '@hookform/error-message';
import {
  Button,
  Fieldset,
  FileInput,
  Form,
  FormGroup,
  Grid,
  Icon,
  TextInput
} from '@trussworks/react-uswds';
import {
  SystemIntakeGRBPresentationLinksInput,
  useSetSystemIntakeGRBPresentationLinksMutation
} from 'gql/gen/graphql';

import { useEasiForm } from 'components/EasiForm';
import Alert from 'components/shared/Alert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import HelpText from 'components/shared/HelpText';
import IconLink from 'components/shared/IconLink';
import Label from 'components/shared/Label';
import RequiredAsterisk from 'components/shared/RequiredAsterisk';
import { TabPanel, Tabs } from 'components/Tabs';
import useMessage from 'hooks/useMessage';

import './index.scss';

type PresentationLinkFields = Omit<
  SystemIntakeGRBPresentationLinksInput,
  'systemIntakeID'
>;

type PresentationLinksFormProps = {
  systemIntakeID: string;
};

/**
 * Form to add or edit GRB review presentation links
 */
const PresentationLinksForm = ({
  systemIntakeID
}: PresentationLinksFormProps) => {
  const { t } = useTranslation('grbReview');
  const { showMessage, showMessageOnNextPage } = useMessage();
  const history = useHistory();

  const [setPresentationLinks] =
    useSetSystemIntakeGRBPresentationLinksMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useEasiForm<PresentationLinkFields>();

  const formType: 'add' | 'edit' = 'add';

  const grbReviewPath = `/it-governance/${systemIntakeID}/grb-review`;

  /** Submit form to set GRB review presentation links */
  const submit = handleSubmit(values =>
    setPresentationLinks({
      variables: {
        input: {
          systemIntakeID,
          ...values
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
      })
  );

  return (
    <>
      <Grid col={6} className="margin-top-7 margin-bottom-10 padding-bottom-3">
        <h1 className="margin-bottom-1">
          {t('presentationLinks.heading', { context: formType })}
        </h1>
        <p className="font-body-md line-height-body-4 text-light margin-top-05 margin-bottom-105">
          {t('presentationLinks.description', { context: formType })}
        </p>

        <p className="margin-top-1 text-base">
          <Trans
            i18nKey="action:fieldsMarkedRequired"
            components={{ asterisk: <RequiredAsterisk /> }}
          />
        </p>

        <IconLink
          icon={<Icon.ArrowBack />}
          className="margin-top-3 margin-bottom-5"
          to={grbReviewPath}
        >
          {t('presentationLinks.returnLink', { formType })}
        </IconLink>

        <Form onSubmit={submit} className="maxw-none">
          <FormGroup>
            <Label htmlFor="recordingLink" required>
              {t('presentationLinks.recordingLinkLabel')}
            </Label>
            <HelpText id="recordingLinkHelpText" className="margin-top-05">
              {t('presentationLinks.recordingLinkHelpText')}
            </HelpText>

            <ErrorMessage
              errors={errors}
              name="recordingLink"
              as={<FieldErrorMsg />}
            />

            <TextInput
              {...register('recordingLink')}
              ref={null}
              id="recordingLink"
              aria-describedby="recordingLinkHelpText"
              type="text"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="recordingPasscode">
              {t('presentationLinks.recordingPasscodeLabel')}
            </Label>
            <HelpText id="recordingPasscodeHelpText" className="margin-top-05">
              {t('presentationLinks.recordingPasscodeHelpText')}
            </HelpText>

            <ErrorMessage
              errors={errors}
              name="recordingPasscode"
              as={<FieldErrorMsg />}
            />

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

              <Tabs className="margin-top-105">
                <TabPanel
                  id="addLink"
                  tabName={t('presentationLinks.addLink')}
                  className="outline-0"
                >
                  <ErrorMessage
                    errors={errors}
                    name="transcriptLink"
                    as={<FieldErrorMsg />}
                  />

                  <TextInput
                    {...register('transcriptLink')}
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

                  <ErrorMessage
                    errors={errors}
                    name="transcriptFileData"
                    as={<FieldErrorMsg />}
                  />

                  <Controller
                    control={control}
                    name="transcriptFileData"
                    render={({ field: { ref, ...field } }) => (
                      <FileInput
                        name={field.name}
                        id={field.name}
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                        aria-describedby="transcriptHelpText transcriptFileDataHelpText"
                        className="maxw-none"
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

          <FormGroup>
            <Label htmlFor="presentationDeckFileData">
              {t('presentationLinks.presentationDeckLabel')}
            </Label>
            <HelpText id="presentationDeckHelpText" className="margin-top-05">
              {t('presentationLinks.documentUploadHelpText')}
            </HelpText>

            <ErrorMessage
              errors={errors}
              name="presentationDeckFileData"
              as={<FieldErrorMsg />}
            />

            <Controller
              control={control}
              name="presentationDeckFileData"
              render={({ field: { ref, ...field } }) => (
                <FileInput
                  name={field.name}
                  id={field.name}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                  aria-describedby="presentationDeckHelpText"
                  className="maxw-none"
                  onChange={e => field.onChange(e.currentTarget?.files?.[0])}
                />
              )}
            />
          </FormGroup>

          <Alert type="info" slim className="margin-top-6">
            {t('presentationLinks.uploadAlert')}
          </Alert>

          <Button type="submit" className="margin-top-205">
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
