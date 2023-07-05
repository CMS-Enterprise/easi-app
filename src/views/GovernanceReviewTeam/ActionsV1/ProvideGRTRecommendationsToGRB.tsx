import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { ApolloError, useMutation } from '@apollo/client';
import { Button } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';

import PageHeading from 'components/PageHeading';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import useSystemIntakeContacts from 'hooks/useSystemIntakeContacts';
import MarkReadyForGRBQuery from 'queries/MarkReadyForGRBQuery';
import {
  AddGRTFeedback,
  AddGRTFeedbackVariables
} from 'queries/types/AddGRTFeedback';
import { ProvideGRTFeedbackForm } from 'types/action';
import { SystemIntakeContactProps } from 'types/systemIntake';
import flattenErrors from 'utils/flattenErrors';
import { provideGRTFeedbackSchema } from 'validations/actionSchema';

import CompleteWithoutEmailButton from './CompleteWithoutEmailButton';
import EmailRecipientsFields from './EmailRecipientsFields';

const ProvideGRTRecommendationsToGRB = () => {
  const { systemId } = useParams<{ systemId: string }>();
  const history = useHistory();
  const { t } = useTranslation('action');
  const [mutate] = useMutation<AddGRTFeedback, AddGRTFeedbackVariables>(
    MarkReadyForGRBQuery
  );

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

  const backLink = `/governance-review-team/${systemId}/actions`;

  const initialValues: ProvideGRTFeedbackForm = {
    grtFeedback: '',
    emailBody: '',
    notificationRecipients: {
      regularRecipientEmails: [requester.email].filter(e => e), // Filter out null emails
      shouldNotifyITGovernance: true,
      shouldNotifyITInvestment: false
    },
    shouldSendEmail: true
  };

  const onSubmit = (
    values: ProvideGRTFeedbackForm,
    { setFieldError }: FormikHelpers<ProvideGRTFeedbackForm>
  ) => {
    const {
      grtFeedback,
      emailBody,
      notificationRecipients,
      shouldSendEmail
    } = values;

    const variables: AddGRTFeedbackVariables = {
      input: {
        emailBody,
        feedback: grtFeedback,
        intakeID: systemId
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
          // If no errors, view intake action notes
          history.push(`/governance-review-team/${systemId}/notes`);
        }
      })
      // Set Formik error to display alert
      .catch((e: ApolloError) => setFieldError('systemIntake', e.message));
  };

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
      onSubmit={onSubmit}
      validationSchema={provideGRTFeedbackSchema}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
      enableReinitialize
    >
      {(formikProps: FormikProps<ProvideGRTFeedbackForm>) => {
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
                testId="system-intake-errors"
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
              data-testid="ready-for-grb"
              className="margin-top-0 margin-bottom-3"
            >
              {t('submitAction.heading')}
            </PageHeading>
            <h3 className="margin-top-3 margin-bottom-2">
              {t('submitAction.subheading')}
            </h3>
            <p data-testid="grtSelectedAction">
              {t('actions.readyForGrb')} &nbsp;
              <Link to={backLink}>{t('submitAction.backLink')}</Link>
            </p>
            <div className="tablet:grid-col-9 margin-bottom-7">
              <Form
                onSubmit={e => {
                  handleSubmit(e);
                  window.scrollTo(0, 0);
                }}
              >
                <FieldGroup
                  scrollElement="grtFeedback"
                  error={!!flatErrors.grtFeedback}
                >
                  <Label
                    htmlFor="ProvideGRTFeedbackForm-GRTFeedback"
                    className="line-height-body-2"
                  >
                    {t('grbRecommendations.recommendationLabel')}
                  </Label>
                  <HelpText className="margin-top-05 line-height-body-5 text-base">
                    {t('grbRecommendations.recommendationHelpText')}
                  </HelpText>
                  <FieldErrorMsg>{flatErrors.grtFeedback}</FieldErrorMsg>
                  <Field
                    as={TextAreaField}
                    error={!!flatErrors.grtFeedback}
                    id="ProvideGRTFeedbackForm-GRTFeedback"
                    maxLength={3000}
                    name="grtFeedback"
                  />
                </FieldGroup>
                <FieldGroup
                  scrollElement="emailBody"
                  error={!!flatErrors.emailBody}
                  className="margin-top-5"
                >
                  <EmailRecipientsFields
                    systemIntakeId={systemId}
                    activeContact={activeContact}
                    setActiveContact={setActiveContact}
                    contacts={contacts.data}
                    recipients={values.notificationRecipients}
                    setRecipients={recipients =>
                      setFieldValue('notificationRecipients', recipients)
                    }
                    error={
                      flatErrors[
                        'notificationRecipients.regularRecipientEmails'
                      ]
                    }
                  />
                  <Label
                    htmlFor="ProvideGRTFeedbackForm-EmailBody"
                    className="margin-top-0 line-height-body-2 text-normal"
                  >
                    {t('submitAction.feedbackLabel')}
                  </Label>
                  <FieldErrorMsg>{flatErrors.emailBody}</FieldErrorMsg>
                  <Field
                    as={TextAreaField}
                    error={!!flatErrors.emailBody}
                    id="ProvideGRTFeedbackForm-EmailBody"
                    maxLength={2000}
                    name="emailBody"
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

export default ProvideGRTRecommendationsToGRB;
