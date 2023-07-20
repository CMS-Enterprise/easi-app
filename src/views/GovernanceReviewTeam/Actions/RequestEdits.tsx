import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { Grid, GridContainer } from '@trussworks/react-uswds';

import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import useSystemIntakeContacts from 'hooks/useSystemIntakeContacts';
import { EmailNotificationRecipients } from 'types/graphql-global-types';

interface SytemIntakeActionFields {
  recipients?: EmailNotificationRecipients;
  feedback?: string;
  note?: string;
}

const RequestEdits = ({ systemIntakeId }: { systemIntakeId: string }) => {
  const { t } = useTranslation('action');

  // System intake contacts
  const {
    contacts: { data: contacts, loading }
  } = useSystemIntakeContacts(systemIntakeId);

  const form = useForm<SytemIntakeActionFields>();
  const {
    reset,
    watch,
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
      </Grid>
    </GridContainer>
  );
};

export default RequestEdits;
