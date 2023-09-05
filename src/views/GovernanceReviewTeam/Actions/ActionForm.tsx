import React, { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { Form, FormGroup } from '@trussworks/react-uswds';

import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import Label from 'components/shared/Label';
import RequiredAsterisk from 'components/shared/RequiredAsterisk';
import TextAreaField from 'components/shared/TextAreaField';
import useSystemIntakeContacts from 'hooks/useSystemIntakeContacts';
import { EmailNotificationRecipients } from 'types/graphql-global-types';
import { SystemIntakeContactProps } from 'types/systemIntake';
import Breadcrumbs from 'views/TechnicalAssistance/Breadcrumbs';
import Pager from 'views/TechnicalAssistance/RequestForm/Pager';

import EmailRecipientsFields from './EmailRecipientsFields';

// TODO: update fields to match schema when backend work is completed
export interface SystemIntakeActionFields {
  additionalNotes: string;
  adminNotes: string;
  notificationRecipients: EmailNotificationRecipients;
}

type ActionFormProps = {
  systemIntakeId: string;
  title: string;
  description: string;
  breadcrumb: string;
  children?: React.ReactNode;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
} & JSX.IntrinsicElements['form'];

/**
 * Form wrapper for IT Gov admin actions
 *
 * Displays breadcrumbs, action title, description, common fields, and pager buttons
 *
 * Common fields: additional information, notification recipients, and admin note
 *
 */
const ActionForm = ({
  systemIntakeId,
  title,
  description,
  children,
  breadcrumb,
  onSubmit,
  className,
  ...formProps
}: ActionFormProps) => {
  const { t } = useTranslation('action');

  const {
    contacts: { data: contacts }
  } = useSystemIntakeContacts(systemIntakeId);
  const { requester } = contacts;

  const [isLoading, setIsLoading] = useState(true);

  // Active contact for adding/verifying recipients
  const [
    activeContact,
    setActiveContact
  ] = useState<SystemIntakeContactProps | null>(null);

  const {
    setValue,
    watch,
    reset,
    formState: { isSubmitting, defaultValues, errors }
  } = useFormContext<SystemIntakeActionFields>();

  // Set default form values
  useEffect(() => {
    if (!!requester.euaUserId && isLoading) {
      reset(
        {
          adminNotes: '',
          additionalNotes: '',
          ...defaultValues,
          notificationRecipients: {
            shouldNotifyITGovernance: true,
            ...defaultValues?.notificationRecipients,
            regularRecipientEmails: requester.email ? [requester.email] : []
          }
        },
        { keepDefaultValues: false }
      );
      setIsLoading(false);
    }
  }, [requester, defaultValues, isLoading, reset]);

  const hasErrors: boolean = Object.keys(errors).length > 0;

  // Scroll to error message
  useEffect(() => {
    if (hasErrors) {
      const err = document.querySelector('.action-error');
      err?.scrollIntoView();
    }
  }, [errors, hasErrors]);

  if (isLoading) return null;

  const recipients = watch('notificationRecipients');
  const recipientsSelected: boolean =
    recipients.regularRecipientEmails.length > 0 ||
    recipients.shouldNotifyITGovernance ||
    recipients.shouldNotifyITInvestment;

  return (
    <div className="margin-bottom-10 padding-bottom-2">
      <Breadcrumbs
        items={[
          { text: t('Home'), url: '/' },
          {
            text: t('breadcrumb', { systemIntakeId }),
            url: `/governance-review-team/${systemIntakeId}/intake-request`
          },
          { text: breadcrumb }
        ]}
      />

      {errors?.root && (
        <Alert type="error" className="action-error">
          {errors.root.message || t('error')}
        </Alert>
      )}

      <PageHeading className="margin-bottom-0">{title}</PageHeading>
      <p className="line-height-body-5 font-body-lg text-light margin-0">
        {description}
      </p>

      <p className="margin-top-1 text-base">
        <Trans
          i18nKey="action:fieldsMarkedRequired"
          components={{ asterisk: <RequiredAsterisk /> }}
        />
      </p>

      <Form
        {...formProps}
        onSubmit={onSubmit}
        className="maxw-none margin-top-6 tablet:grid-col-6"
      >
        {children}

        {/* Notification email */}
        <h3 className=" margin-bottom-0">{t('notification.heading')}</h3>
        <Alert type="info" slim>
          {t('notification.alert')}
        </Alert>
        <Trans
          i18nKey="action:notification.description"
          components={{ p: <p className="line-height-body-5" /> }}
        />

        {/* Additional information */}
        <Controller
          name="additionalNotes"
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
          setRecipients={values => setValue('notificationRecipients', values)}
          error=""
        />

        {/* Admin note */}
        <Controller
          name="adminNotes"
          render={({ field, fieldState: { error } }) => (
            <FormGroup
              error={!!error}
              className="bg-base-lightest padding-2 margin-top-6"
            >
              <h3 className="margin-y-0">{t('adminNote.title')}</h3>
              <p className="line-height-body-5 margin-y-1">
                {t('adminNote.description')}
              </p>
              <Label htmlFor={field.name} className="text-normal margin-top-2">
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
            disabled: isSubmitting || !recipientsSelected,
            outline: false
          }}
          // Complete action without sending email
          next={{
            text: t('completeActionWithoutEmail'),
            outline: true,
            disabled: isSubmitting,
            // Reset email recipients to prevent sending email
            onClick: () =>
              setValue('notificationRecipients', {
                regularRecipientEmails: [],
                shouldNotifyITGovernance: false,
                shouldNotifyITInvestment: false
              })
          }}
          taskListUrl={`/governance-review-team/${systemIntakeId}/intake-request`}
          saveExitText={t('cancelAction')}
          border={false}
          className="margin-top-6"
          submitDisabled
        />
      </Form>
    </div>
  );
};

export default ActionForm;
