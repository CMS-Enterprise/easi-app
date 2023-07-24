import React, { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { Form, FormGroup, GridContainer } from '@trussworks/react-uswds';

import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import useSystemIntakeContacts from 'hooks/useSystemIntakeContacts';
import { EmailNotificationRecipients } from 'types/graphql-global-types';
import { SystemIntakeContactProps } from 'types/systemIntake';
import EmailRecipientsFields from 'views/GovernanceReviewTeam/ActionsV1/EmailRecipientsFields';
import Breadcrumbs from 'views/TechnicalAssistance/Breadcrumbs';
import Pager from 'views/TechnicalAssistance/RequestForm/Pager';

export interface SystemIntakeActionFields {
  feedback: string;
  note: string;
  recipients: EmailNotificationRecipients;
}

type FormProps = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
  large?: boolean;
  search?: boolean;
} & JSX.IntrinsicElements['form'];

export type ActionFormProps = {
  /** Action title */
  title: string;
  /** Action description */
  description: string;
  /** Text for current page breadcrumb */
  breadcrumb: string;
  children?: React.ReactNode;
} & FormProps;

/** Includes props set from useActionForm hook */
type ActionFormWrapperProps = {
  systemIntakeId: string;
} & ActionFormProps;

/**
 * Wrapper for TRB action forms
 */
const ActionForm = ({
  systemIntakeId,
  title,
  description,
  children,
  breadcrumb,
  ...formProps
}: ActionFormWrapperProps) => {
  const { t } = useTranslation('action');

  const {
    contacts: { data: contacts }
  } = useSystemIntakeContacts(systemIntakeId);
  const { requester } = contacts;

  // Set form loading state
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
    formState: { isSubmitting, errors, defaultValues }
  } = useFormContext<SystemIntakeActionFields>();

  // Auto scroll to errors
  useEffect(() => {
    if (errors) {
      const err = document.querySelector('.trb-basic-fields-error');
      err?.scrollIntoView();
    }
  }, [errors]);

  // Set default form values
  useEffect(() => {
    if (!!requester.euaUserId && isLoading) {
      reset(
        {
          ...defaultValues,
          recipients: {
            shouldNotifyITGovernance: true,
            ...defaultValues?.recipients,
            regularRecipientEmails: requester.email ? [requester.email] : []
          }
        },
        { keepDefaultValues: false }
      );
      setIsLoading(false);
    }
  }, [requester, defaultValues, isLoading, reset]);

  // If form is loading, return null
  if (isLoading) return null;

  const recipients = watch('recipients');
  const recipientsSelected: boolean =
    recipients.regularRecipientEmails.length > 0 ||
    recipients.shouldNotifyITGovernance ||
    recipients.shouldNotifyITInvestment;

  return (
    <GridContainer className="margin-bottom-10 padding-bottom-2">
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

      <PageHeading className="margin-bottom-0">{title}</PageHeading>
      <p className="line-height-body-5 font-body-lg text-light margin-0">
        {description}
      </p>

      <p className="margin-top-1 text-base">
        <Trans
          i18nKey="technicalAssistance:actionRequestEdits.fieldsMarkedRequired"
          components={{ red: <span className="text-red" /> }}
        />
      </p>

      <Form
        onSubmit={formProps.onSubmit}
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
          name="feedback"
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
              setValue('recipients', {
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
    </GridContainer>
  );
};

export default ActionForm;
