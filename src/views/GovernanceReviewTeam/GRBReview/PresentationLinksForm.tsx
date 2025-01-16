import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { ErrorMessage } from '@hookform/error-message';
import {
  Button,
  FileInput,
  Form,
  FormGroup,
  Grid,
  Icon,
  TextInput
} from '@trussworks/react-uswds';
import { SystemIntakeGRBPresentationLinksInput } from 'gql/gen/graphql';

import { useEasiForm } from 'components/EasiForm';
import Alert from 'components/shared/Alert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import HelpText from 'components/shared/HelpText';
import IconLink from 'components/shared/IconLink';
import Label from 'components/shared/Label';
import RequiredAsterisk from 'components/shared/RequiredAsterisk';

type PresentationLinkFields = Omit<
  SystemIntakeGRBPresentationLinksInput,
  'systemIntakeID'
>;

type PresentationLinksFormProps = {
  systemIntakeID: string;
};

const PresentationLinksForm = ({
  systemIntakeID
}: PresentationLinksFormProps) => {
  const { t } = useTranslation('grbReview');

  const formType: 'add' | 'edit' = 'add';

  const {
    register,
    formState: { errors }
  } = useEasiForm<PresentationLinkFields>();

  return (
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
        to="/"
      >
        {t('presentationLinks.returnLink', { formType })}
      </IconLink>

      <Form onSubmit={() => null} className="maxw-none">
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
            id="recordingPasscode"
            aria-describedby="recordingPasscodeHelpText"
            type="text"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="presentationDeck">
            {t('presentationLinks.presentationDeckLabel')}
          </Label>
          <HelpText id="presentationDeckHelpText" className="margin-top-05">
            {t('presentationLinks.presentationDeckHelpText')}
          </HelpText>

          <ErrorMessage
            errors={errors}
            name="presentationDeck"
            as={<FieldErrorMsg />}
          />

          <FileInput
            {...register('presentationDeckFileData')}
            id="presentationDeck"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
            className="maxw-none"
          />
        </FormGroup>

        <Alert type="info" slim className="margin-top-6">
          {t('presentationLinks.uploadAlert')}
        </Alert>

        <Button type="submit" className="margin-top-205">
          {t('presentationLinks.savePresentationDetails')}
        </Button>
      </Form>

      <IconLink icon={<Icon.ArrowBack />} className="margin-top-205" to="/">
        {t('presentationLinks.returnLink', { formType })}
      </IconLink>
    </Grid>
  );
};

export default PresentationLinksForm;
