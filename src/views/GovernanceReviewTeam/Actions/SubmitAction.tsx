import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import { ApolloError, DocumentNode, useMutation } from '@apollo/client';
import { Button } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';

import PageHeading from 'components/PageHeading';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import useSystemIntakeContacts from 'hooks/useSystemIntakeContacts';
import { ActionForm } from 'types/action';
import { BasicActionInput } from 'types/graphql-global-types';
import { SystemIntakeContactProps } from 'types/systemIntake';
import flattenErrors from 'utils/flattenErrors';
import { actionSchema } from 'validations/actionSchema';

import CompleteWithoutEmailButton from './CompleteWithoutEmailButton';
import EmailRecipientsFields from './EmailRecipientsFields';

type ActionInput = {
  input: BasicActionInput;
};

type SubmitActionProps = {
  actionName: string;
  query: DocumentNode;
};

const SubmitAction = ({ actionName, query }: SubmitActionProps) => {
  const { systemId } = useParams<{ systemId: string }>();
  const { t } = useTranslation('action');
  const history = useHistory();

  // System intake contacts
  const { contacts } = useSystemIntakeContacts(systemId);
  const { requester } = contacts.data;

  /** Whether contacts have loaded for the first time */
  const [contactsLoaded, setContactsLoaded] = useState(false);

  // Active contact for adding/verifying recipients
  const [
    activeContact,
    setActiveContact
  ] = useState<SystemIntakeContactProps | null>(null);

  const [mutate] = useMutation<ActionInput>(query);

  const { pathname } = useLocation();

  const dispatchSave = (
    values: ActionForm,
    { setFieldError }: FormikHelpers<ActionForm>
  ) => {
    const { feedback, notificationRecipients, shouldSendEmail } = values;

    const variables: ActionInput = {
      input: {
        intakeId: systemId,
        feedback
      }
    };

    if (shouldSendEmail) {
      variables.input.notificationRecipients = notificationRecipients;
    }

    // GQL mutation to submit action
    mutate({
      variables
    })
      .then(({ errors }) => {
        if (!errors) {
          // If no errors, view intake request
          history.push(`/governance-review-team/${systemId}/intake-request`);
        }
      })
      // Set Formik error to display alert
      .catch((e: ApolloError) => setFieldError('systemIntake', e.message));
  };

  const initialValues: ActionForm = {
    feedback: '',
    notificationRecipients: {
      regularRecipientEmails: [requester.email].filter(e => e), // Filter out null emails
      shouldNotifyITGovernance: true,
      shouldNotifyITInvestment:
        pathname.endsWith('no-governance') ||
        pathname.endsWith('not-it-request')
    },
    shouldSendEmail: true
  };

  const backLink = `/governance-review-team/${systemId}/actions`;

  // Sets contactsLoaded to true when GetSystemIntakeContactsQuery loading state changes
  useEffect(() => {
    if (!contacts.loading) {
      setContactsLoaded(true);
    }
  }, [contacts.loading]);

  // Returns null until GetSystemIntakeContactsQuery has completed
  // Allows initial values to fully load before initializing form
  if (!contactsLoaded) return null;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={dispatchSave}
      validationSchema={actionSchema}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
      enableReinitialize
    >
      {(formikProps: FormikProps<ActionForm>) => {
        const {
          errors,
          setErrors,
          handleSubmit,
          submitForm,
          setFieldValue,
          values
        } = formikProps;
        const flatErrors = flattenErrors(errors);
        return (
          <>
            {Object.keys(errors).length > 0 && (
              <ErrorAlert
                testId="formik-validation-errors"
                classNames="margin-top-3"
                heading="Please check and fix the following"
              >
                {Object.keys(flatErrors).map(key => {
                  return (
                    <ErrorAlertMessage
                      key={`Error.${key}`}
                      errorKey={key}
                      message={flatErrors[key]}
                    />
                  );
                })}
              </ErrorAlert>
            )}
            <PageHeading
              data-testid="grt-submit-action-view"
              className="margin-top-0 margin-bottom-3"
            >
              {t('submitAction.heading')}
            </PageHeading>
            <h3 className="margin-top-3 margin-bottom-2">
              {t('submitAction.subheading')}
            </h3>
            <div className="margin-bottom-05 text-bold line-height-body-2">
              {t('extendLcid.selectedAction')}
            </div>
            <div data-testid="grtSelectedAction">
              {actionName}&nbsp;
              <Link to={backLink}>{t('submitAction.backLink')}</Link>
            </div>
            <div className="margin-bottom-7">
              <Form
                onSubmit={e => {
                  handleSubmit(e);
                  window.scrollTo(0, 0);
                }}
              >
                <EmailRecipientsFields
                  className="margin-top-3"
                  systemIntakeId={systemId}
                  activeContact={activeContact}
                  setActiveContact={setActiveContact}
                  contacts={contacts.data}
                  recipients={values.notificationRecipients}
                  setRecipients={recipients =>
                    setFieldValue('notificationRecipients', recipients)
                  }
                  error={
                    flatErrors['notificationRecipients.regularRecipientEmails']
                  }
                />
                <FieldGroup
                  scrollElement="feedback"
                  error={!!flatErrors.feedback}
                  className="margin-top-2"
                >
                  <Label
                    htmlFor="SubmitActionForm-Feedback"
                    className="line-height-body-2 text-normal"
                  >
                    {t('action:submitAction.feedbackLabel')}
                  </Label>
                  <FieldErrorMsg>{flatErrors.businessSolution}</FieldErrorMsg>
                  <Field
                    as={TextAreaField}
                    error={!!flatErrors.feedback}
                    id="SubmitActionForm-Feedback"
                    maxLength={3000}
                    name="feedback"
                  />
                </FieldGroup>
                <div>
                  <Button
                    className="margin-top-2"
                    type="submit"
                    onClick={() => {
                      setErrors({});
                      setFieldValue('shouldSendEmail', true);
                    }}
                    disabled={!!activeContact}
                  >
                    {t('submitAction.submit')}
                  </Button>
                </div>
                <div>
                  <CompleteWithoutEmailButton
                    setErrors={setErrors}
                    setFieldValue={setFieldValue}
                    submitForm={submitForm}
                    disabled={!!activeContact}
                  />
                </div>
              </Form>
            </div>
          </>
        );
      }}
    </Formik>
  );
};

export default SubmitAction;
