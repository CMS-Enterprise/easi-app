import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { Form, FormGroup, Grid, GridContainer } from '@trussworks/react-uswds';

import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import { systemIntake } from 'data/mock/systemIntake';
import useSystemIntakeContacts from 'hooks/useSystemIntakeContacts';
import { EmailNotificationRecipients } from 'types/graphql-global-types';
import { SystemIntakeContactProps } from 'types/systemIntake';
import Pager from 'views/TechnicalAssistance/RequestForm/Pager';

import EmailRecipientsFields from '../ActionsV1/EmailRecipientsFields';

interface SystemIntakeActionFields {
  feedback: string;
  note: string;
  recipients: EmailNotificationRecipients;
}

const initialValues: SystemIntakeActionFields = {
  feedback: '',
  note: '',
  recipients: {
    shouldNotifyITGovernance: false,
    shouldNotifyITInvestment: false,
    regularRecipientEmails: []
  }
};

const RequestEdits = ({ systemIntakeId }: { systemIntakeId: string }) => {
  const { t } = useTranslation('action');

  // System intake contacts
  const {
    contacts: { data: contacts, loading }
  } = useSystemIntakeContacts(systemIntakeId);

  // Active contact for adding/verifying recipients
  const [
    activeContact,
    setActiveContact
  ] = useState<SystemIntakeContactProps | null>(null);

  const {
    control,
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { defaultValues }
  } = useForm<SystemIntakeActionFields>({
    defaultValues: initialValues
  });

  const recipients = watch('recipients');

  /** Submit form */
  const submit = handleSubmit(formData => null);

  // Reset default values when contacts load
  useEffect(() => {
    if (
      !loading &&
      defaultValues?.recipients?.regularRecipientEmails?.length === 0
    ) {
      reset(
        {
          ...initialValues,
          recipients: {
            regularRecipientEmails: [contacts.requester.email],
            shouldNotifyITGovernance: true,
            shouldNotifyITInvestment: false
          }
        },
        { keepDefaultValues: false }
      );
    }
  }, [contacts, loading, defaultValues, reset]);

  // If contacts are still loading, return null
  if (loading) return null;

  const recipientsSelected: boolean =
    recipients.regularRecipientEmails.length > 0 ||
    recipients.shouldNotifyITGovernance ||
    recipients.shouldNotifyITInvestment;

  return (
    <GridContainer className="margin-bottom-10 padding-bottom-2">
      <PageHeading className="margin-bottom-0">
        {t('requestEdits.title')}
      </PageHeading>
      <p className="line-height-body-5 font-body-lg text-light margin-0">
        {t('requestEdits.description')}
      </p>

      <p className="margin-top-1 text-base">
        <Trans
          i18nKey="technicalAssistance:actionRequestEdits.fieldsMarkedRequired"
          components={{ red: <span className="text-red" /> }}
        />
      </p>

      {/* Form fields */}
      <Grid className="tablet:grid-col-6">
        {/* Notification email */}
        <h3 className="margin-top-6 margin-bottom-0">
          {t('notification.heading')}
        </h3>
        <Alert type="info" slim>
          {t('notification.alert')}
        </Alert>
        <Trans
          i18nKey="action:notification.description"
          components={{ p: <p className="line-height-body-5" /> }}
        />

        <Form onSubmit={submit} className="maxw-none">
          {/* Additional information */}
          <Controller
            name="feedback"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormGroup error={!!error}>
                <Label htmlFor={field.name} className="text-normal">
                  {t('notification.additionalInformation')}
                </Label>
                {!!error && <FieldErrorMsg>{t('Error')}</FieldErrorMsg>}
                <TextAreaField
                  {...field}
                  ref={null}
                  id={field.name}
                  size="sm"
                  characterCounter={false}
                />
              </FormGroup>
            )}
          />

          {/* Notification recipients */}
          <EmailRecipientsFields
            className="margin-top-6"
            systemIntakeId={systemIntakeId}
            activeContact={activeContact}
            setActiveContact={setActiveContact}
            contacts={contacts}
            recipients={recipients}
            setRecipients={values => setValue('recipients', values)}
            error=""
          />

          {/* Admin note */}
          <Controller
            name="note"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormGroup
                error={!!error}
                className="bg-base-lightest padding-2 margin-top-6"
              >
                <h3 className="margin-y-0">{t('adminNote.title')}</h3>
                <p className="line-height-body-5 margin-y-1">
                  {t('adminNote.description')}
                </p>
                <Label
                  htmlFor={field.name}
                  className="text-normal margin-top-2"
                >
                  {t('adminNote.label')}
                </Label>
                {!!error && <FieldErrorMsg>{t('Error')}</FieldErrorMsg>}
                <TextAreaField
                  {...field}
                  ref={null}
                  id={field.name}
                  size="sm"
                  characterCounter={false}
                />
              </FormGroup>
            )}
          />

          <Pager
            // Complete action
            back={{
              text: t('completeAction'),
              disabled: !recipientsSelected,
              outline: false
            }}
            // Complete action without sending email
            next={{
              text: t('completeActionWithoutEmail'),
              outline: true,
              // Reset email recipients to prevent sending email
              onClick: () =>
                setValue('recipients', {
                  regularRecipientEmails: [],
                  shouldNotifyITGovernance: false,
                  shouldNotifyITInvestment: false
                })
            }}
            taskListUrl={`/governance-review-team/${systemIntake}/intake-request`}
            saveExitText={t('cancelAction')}
            border={false}
            className="margin-top-6"
            submitDisabled
          />
        </Form>
      </Grid>
    </GridContainer>
  );
};

export default RequestEdits;
