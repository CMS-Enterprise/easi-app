import React, { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  Button,
  ButtonGroup,
  Form,
  FormGroup,
  ModalFooter,
  ModalHeading
} from '@trussworks/react-uswds';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import Label from 'components/shared/Label';
import RequiredAsterisk from 'components/shared/RequiredAsterisk';
import TextAreaField from 'components/shared/TextAreaField';
import useMessage from 'hooks/useMessage';
import useSystemIntakeContacts from 'hooks/useSystemIntakeContacts';
import { EmailNotificationRecipients } from 'types/graphql-global-types';
import { SystemIntakeContactProps } from 'types/systemIntake';
import Breadcrumbs from 'views/TechnicalAssistance/Breadcrumbs';
import Pager from 'views/TechnicalAssistance/RequestForm/Pager';

import EmailRecipientsFields from './EmailRecipientsFields';

// TODO: update fields to match schema when backend work is completed
export interface SystemIntakeActionFields {
  additionalInfo: string;
  adminNotes: string;
  notificationRecipients: EmailNotificationRecipients;
}

export type ActionFormProps<TFieldValues extends SystemIntakeActionFields> = {
  systemIntakeId: string;
  title: string;
  description: string;
  breadcrumb: string;
  /** Success message to display on admin actions page after submission */
  successMessage: string;
  /** Submit function runs after field validation passes */
  onSubmit: (formData: TFieldValues) => Promise<void>;
  /** Optional confirmation modal title and content */
  modal?: {
    title: string;
    content: React.ReactNode;
  };
  children?: React.ReactNode;
  className?: string;
} & Omit<JSX.IntrinsicElements['form'], 'onSubmit'>;

/**
 * Form wrapper for IT Gov admin actions
 *
 * Displays breadcrumbs, action title, description, common fields, and pager buttons
 *
 * Common fields: additional information, notification recipients, and admin note
 *
 * Note: component cannot be used outside of React Hook Form's `FormProvider` component
 */
const ActionForm = <TFieldValues extends SystemIntakeActionFields>({
  systemIntakeId,
  title,
  description,
  breadcrumb,
  successMessage,
  onSubmit,
  modal,
  children,
  className,
  ...formProps
}: ActionFormProps<TFieldValues>) => {
  const { t } = useTranslation('action');
  const history = useHistory();
  const { showMessageOnNextPage } = useMessage();

  const [modalIsOpen, setModalIsOpen] = useState(false);

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
    handleSubmit,
    setError,
    formState: { isSubmitting, defaultValues, errors }
  } = useFormContext<SystemIntakeActionFields>();

  /** Execute `onSubmit` prop with success and error handling */
  const completeAction = (formData: TFieldValues) =>
    onSubmit(formData)
      .then(() => {
        // Display success message
        showMessageOnNextPage(t(successMessage), { type: 'success' });
        history.push(`/governance-review-team/${systemIntakeId}/actions`);
      })
      .catch(() => {
        setModalIsOpen(false);
        setError('root', { message: t('error') });
      });

  /** Handles form validation and either completes action or triggers confirmation modal (if `modal` prop is defined) */
  const submitForm = handleSubmit(formData => {
    // If form validation passes, check for `modal` prop
    if (modal) {
      setModalIsOpen(true);
    } else {
      completeAction(formData as TFieldValues);
    }
  });

  // Set default form values
  useEffect(() => {
    if (!!requester.euaUserId && isLoading) {
      reset(
        {
          adminNotes: '',
          additionalInfo: '',
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

      {
        // Error message for server error
        errors?.root?.message && (
          <Alert type="error" className="action-error">
            {errors.root.message}
          </Alert>
        )
      }

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
        onSubmit={submitForm}
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
          name="additionalInfo"
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
          error={errors.notificationRecipients?.message || ''}
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

        {modal && (
          <Modal isOpen={modalIsOpen} closeModal={() => setModalIsOpen(false)}>
            <ModalHeading>{t(modal.title)}</ModalHeading>
            {modal.content}
            <ModalFooter>
              <ButtonGroup>
                <Button
                  type="button"
                  onClick={() => completeAction(watch() as TFieldValues)}
                  className="margin-right-1"
                >
                  {t('completeAction')}
                </Button>
                <Button
                  type="button"
                  onClick={() => setModalIsOpen(false)}
                  unstyled
                >
                  Go back
                </Button>
              </ButtonGroup>
            </ModalFooter>
          </Modal>
        )}

        <Pager
          // Complete action
          back={{
            text: t('completeAction'),
            disabled: isSubmitting || !recipientsSelected || modalIsOpen,
            outline: false,
            type: 'submit'
          }}
          // Complete action without sending email
          next={{
            text: t('completeActionWithoutEmail'),
            outline: true,
            disabled: isSubmitting || modalIsOpen,
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
