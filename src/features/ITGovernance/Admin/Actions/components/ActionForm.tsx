import React, { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ApolloError, FetchResult } from '@apollo/client';
import {
  Button,
  ButtonGroup,
  Form,
  FormGroup,
  Grid,
  ModalFooter,
  ModalHeading
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import Pager from 'features/TechnicalAssistance/Requester/RequestForm/Pager';
import {
  EmailNotificationRecipients,
  SystemIntakeContactFragment
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import Breadcrumbs from 'components/Breadcrumbs';
import { ErrorAlertMessage } from 'components/ErrorAlert';
import FieldErrorMsg from 'components/FieldErrorMsg';
import Label from 'components/Label';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import RequiredAsterisk from 'components/RequiredAsterisk';
import RichTextEditor from 'components/RichTextEditor';
import useMessage from 'hooks/useMessage';
import useSystemIntakeContacts from 'hooks/useSystemIntakeContacts';

import ActionsSummary, { ActionsSummaryProps } from './ActionsSummary';
import EmailRecipientsFields from './EmailRecipientsFields';

import './ActionForm.scss';

export interface SystemIntakeActionFields {
  additionalInfo: string;
  adminNote: string | null;
  notificationRecipients: EmailNotificationRecipients;
}

export type ActionFormProps<TFieldValues extends SystemIntakeActionFields> = {
  systemIntakeId: string;
  title: React.ReactNode;
  description?: string;
  breadcrumb?: string;
  /** Success message to display on admin actions page after submission */
  successMessage?: string;
  /** Submit function runs after field validation passes */
  onSubmit: (formData: TFieldValues) => Promise<FetchResult | void>;
  /** Optional confirmation modal title and content */
  modal?: {
    title: string;
    content: React.ReactNode;
  };
  /** Props to display the ActionsSummary component to the right of action form */
  actionsSummaryProps?: ActionsSummaryProps;
  /** Show required fields text */
  requiredFields?: boolean;
  /** Disable form submit buttons */
  disableSubmit?: boolean;
  /**
   * Prefix for field error translation keys
   *
   * Used to get correct error text if field keys are already being used in another form
   */
  errorKeyContext?: string;
  children?: React.ReactNode;
  className?: string;
  // Switch notification type to warning instead of info default
  notificationAlertWarn?: boolean;
} & Omit<JSX.IntrinsicElements['form'], 'onSubmit' | 'title'>;

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
  actionsSummaryProps,
  requiredFields = true,
  disableSubmit,
  errorKeyContext,
  children,
  className,
  notificationAlertWarn = false,
  ...formProps
}: ActionFormProps<TFieldValues>) => {
  const { t } = useTranslation('action');
  const history = useHistory();
  const { showMessageOnNextPage } = useMessage();

  const [sendEmail, setSendEmail] = useState(true);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const {
    contacts: { data: contacts }
  } = useSystemIntakeContacts(systemIntakeId);
  const { requester } = contacts || {};

  const [isLoading, setIsLoading] = useState(true);

  // Active contact for adding/verifying recipients
  const [activeContact, setActiveContact] =
    useState<SystemIntakeContactFragment | null>(null);

  const {
    control,
    setValue,
    watch,
    reset,
    handleSubmit,
    setError,
    formState: { isSubmitting, defaultValues, errors }
  } = useFormContext<SystemIntakeActionFields>();

  /** Execute `onSubmit` prop with success and error handling */
  const completeAction = (formData: TFieldValues) => {
    // Ensure blank admin notes are null instead of '' so that it doesn't get displayed in the notes list
    // eslint-disable-next-line no-param-reassign
    if (formData.adminNote === '') formData.adminNote = null;

    onSubmit(formData)
      .then(() => {
        // Display success message
        if (successMessage) {
          showMessageOnNextPage(t(successMessage), { type: 'success' });
        }

        history.push(`/it-governance/${systemIntakeId}/actions`);
      })
      .catch(e => {
        setModalIsOpen(false);

        // If mutation fails, set root server error
        if (e instanceof ApolloError) {
          setError('root.server', { message: t('error') });
        } else {
          // If error is not ApolloError, set as general form error
          setError('root.form', { message: e.message });
        }
      });
  };

  /** Handles form validation and either completes action or triggers confirmation modal (if `modal` prop is defined) */
  const submitForm = handleSubmit(formData => {
    const values = { ...formData };

    // If not sending email, set recipient values
    if (!sendEmail) {
      values.notificationRecipients = {
        regularRecipientEmails: [],
        shouldNotifyITGovernance: false,
        shouldNotifyITInvestment: false
      };
    }

    // If form validation passes, check for `modal` prop
    if (modal) {
      setModalIsOpen(true);
    } else {
      completeAction(values as TFieldValues);
    }
  });

  // Set default form values
  useEffect(() => {
    if (
      // Check that formatted contacts have been loaded before updating default values
      !!requester?.systemIntakeId &&
      isLoading
    ) {
      reset(
        {
          adminNote: '',
          additionalInfo: '',
          ...defaultValues,
          notificationRecipients: {
            shouldNotifyITGovernance: true,
            shouldNotifyITInvestment: false,
            ...defaultValues?.notificationRecipients,
            regularRecipientEmails: requester.userAccount.email
              ? [requester.userAccount.email]
              : []
          }
        },
        { keepDefaultValues: false }
      );
      setIsLoading(false);
    }
  }, [requester, defaultValues, isLoading, reset]);

  const fieldErrorKeys = Object.keys(errors).filter(key => key !== 'root');
  const hasErrors: boolean = Object.keys(errors).length > 0;

  // Scroll to error message
  useEffect(() => {
    if (hasErrors) {
      const err = document.querySelector('.action-error');
      err?.scrollIntoView();
    }
  }, [errors, hasErrors]);

  if (isLoading || !contacts) return <PageLoading />;

  const recipients = watch('notificationRecipients');
  const recipientsSelected: boolean =
    recipients.regularRecipientEmails.length > 0 ||
    recipients.shouldNotifyITGovernance ||
    recipients.shouldNotifyITInvestment;

  return (
    <div className="margin-bottom-10 padding-bottom-2">
      {breadcrumb && (
        <Breadcrumbs
          items={[
            { text: t('Home'), url: '/' },
            {
              text: t('governanceReviewTeam:governanceRequestDetails'),
              url: `/it-governance/${systemIntakeId}/intake-request`
            },
            { text: breadcrumb }
          ]}
        />
      )}

      {
        // Error message for server error
        errors?.root?.server?.message && (
          <Alert type="error" className="action-error margin-top-2">
            {errors.root.server.message}
          </Alert>
        )
      }

      {typeof title === 'string' ? (
        <PageHeading className="margin-bottom-0">{title}</PageHeading>
      ) : (
        title
      )}
      {description && (
        <p className="line-height-body-5 font-body-lg text-light margin-0">
          {description}
        </p>
      )}

      {requiredFields && (
        <p className="margin-top-1 text-base">
          <Trans
            i18nKey="action:fieldsMarkedRequired"
            components={{ asterisk: <RequiredAsterisk /> }}
          />
        </p>
      )}

      {
        /** Display field errors */
        fieldErrorKeys.length > 0 && (
          <Alert
            heading={t('technicalAssistance:errors.checkFix')}
            type="error"
            className="action-error"
            slim={false}
          >
            {fieldErrorKeys.map(fieldName => {
              const label = t(`errorLabels.${fieldName}`, {
                context: errorKeyContext
              });
              const error = errors[fieldName as keyof typeof errors]?.message;

              const message = `${label}: ${t(error || '')}`;

              return (
                <ErrorAlertMessage
                  key={fieldName}
                  errorKey={fieldName}
                  message={message}
                />
              );
            })}
          </Alert>
        )
      }
      <Grid
        row
        className={classNames('it-gov-action-form-row margin-top-6', {
          'grid-gap': !!actionsSummaryProps
        })}
      >
        <Form
          {...formProps}
          onSubmit={submitForm}
          className="maxw-none grid-col tablet:grid-col-6 margin-bottom-6 tablet:margin-bottom-0"
        >
          {children}

          {/* Notification email */}
          <h3 className="margin-bottom-0 margin-top-6">
            {t('notification.heading')}
          </h3>
          <Alert type={notificationAlertWarn ? 'warning' : 'info'} slim>
            {t('notification.alert')}
          </Alert>
          <Trans
            i18nKey="action:notification.description"
            components={{ p: <p className="line-height-body-5" /> }}
          />

          {/* Additional information */}
          <Controller
            control={control}
            name="additionalInfo"
            render={({ field, fieldState: { error } }) => (
              <FormGroup error={!!error}>
                <Label
                  id={`${field.name}-label`}
                  htmlFor={field.name}
                  className="text-normal"
                >
                  {t('notification.additionalInformation')}
                </Label>
                {!!error && <FieldErrorMsg>{t('Error')}</FieldErrorMsg>}
                <RichTextEditor
                  editableProps={{
                    id: field.name,
                    'data-testid': field.name,
                    'aria-describedby': `${field.name}-hint`,
                    'aria-labelledby': `${field.name}-label`
                  }}
                  field={{ ...field, value: field.value || '' }}
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
            control={control}
            name="adminNote"
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
                  id={`${field.name}-label`}
                  htmlFor={field.name}
                  className="text-normal margin-top-2"
                >
                  {t('adminNote.label')}
                </Label>
                {!!error && <FieldErrorMsg>{t('Error')}</FieldErrorMsg>}
                <RichTextEditor
                  editableProps={{
                    id: field.name,
                    'data-testid': field.name,
                    'aria-describedby': `${field.name}-hint`,
                    'aria-labelledby': `${field.name}-label`
                  }}
                  field={{ ...field, value: field.value || '' }}
                />
              </FormGroup>
            )}
          />

          {modal && (
            <Modal
              isOpen={modalIsOpen}
              closeModal={() => setModalIsOpen(false)}
            >
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
              disabled:
                disableSubmit ||
                isSubmitting ||
                !recipientsSelected ||
                modalIsOpen,
              outline: false,
              type: 'submit',
              onClick: () => setSendEmail(true)
            }}
            // Complete action without sending email
            next={{
              text: t('completeActionWithoutEmail'),
              outline: true,
              disabled: disableSubmit || isSubmitting || modalIsOpen,
              onClick: () => setSendEmail(false)
            }}
            taskListUrl={`/it-governance/${systemIntakeId}/actions`}
            saveExitText={t('cancelAction')}
            border={false}
            className="margin-top-6"
            submitDisabled
          />
        </Form>

        {!!actionsSummaryProps && (
          <Grid col={12} tablet={{ col: 6 }}>
            <ActionsSummary {...actionsSummaryProps} />
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default ActionForm;
