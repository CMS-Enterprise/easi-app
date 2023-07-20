import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { FormGroup, Grid, GridContainer } from '@trussworks/react-uswds';

import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import useSystemIntakeContacts from 'hooks/useSystemIntakeContacts';
import { EmailNotificationRecipients } from 'types/graphql-global-types';
import { SystemIntakeContactProps } from 'types/systemIntake';

import EmailRecipientsFields from '../ActionsV1/EmailRecipientsFields';

interface SytemIntakeActionFields {
  feedback: string;
  note: string;
  recipients?: EmailNotificationRecipients;
}

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

  const form = useForm<SytemIntakeActionFields>();
  const {
    control,
    reset,
    watch,
    setValue,
    formState: { defaultValues }
  } = form;

  const recipients = watch('recipients');

  // Set default values when contacts load
  useEffect(() => {
    if (!loading && !defaultValues) {
      reset(
        {
          recipients: {
            regularRecipientEmails: [contacts.requester.email],
            shouldNotifyITGovernance: true,
            shouldNotifyITInvestment: false
          },
          note: '',
          feedback: ''
        },
        { keepDefaultValues: false }
      );
    }
  }, [contacts, loading, defaultValues, reset]);

  // If loading or recipients have not been set, return null
  if (loading || !recipients) return null;

  return (
    <GridContainer className="margin-bottom-10">
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
      <Grid col={6}>
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
          className="margin-top-3"
          systemIntakeId={systemIntakeId}
          activeContact={activeContact}
          setActiveContact={setActiveContact}
          contacts={contacts}
          recipients={recipients}
          setRecipients={values => setValue('recipients', values)}
          error=""
        />
      </Grid>
    </GridContainer>
  );
};

export default RequestEdits;
