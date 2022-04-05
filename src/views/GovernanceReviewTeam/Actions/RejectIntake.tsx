import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Button, Link as UswdsLink } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import PageHeading from 'components/PageHeading';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import RejectIntakeQuery from 'queries/RejectIntakeQuery';
import {
  RejectIntake as RejectIntakeType,
  RejectIntakeVariables
} from 'queries/types/RejectIntake';
import { RejectIntakeForm } from 'types/action';
import flattenErrors from 'utils/flattenErrors';
import { rejectIntakeSchema } from 'validations/actionSchema';

import CompleteWithoutEmailButton from './CompleteWithoutEmailButton';
import EmailRecipientsFields from './EmailRecipientsFields';

const RejectIntake = () => {
  const { systemId } = useParams<{ systemId: string }>();
  const history = useHistory();
  const { t } = useTranslation('action');
  const [shouldSendEmail, setShouldSendEmail] = useState<boolean>(true);

  const [mutate, mutationResult] = useMutation<
    RejectIntakeType,
    RejectIntakeVariables
  >(RejectIntakeQuery, {
    errorPolicy: 'all'
  });

  const backLink = `/governance-review-team/${systemId}/actions`;

  const initialValues: RejectIntakeForm = {
    feedback: '',
    nextSteps: '',
    reason: ''
  };

  const onSubmit = (values: RejectIntakeForm) => {
    const { feedback, nextSteps, reason } = values;

    const input = {
      feedback,
      intakeId: systemId,
      nextSteps,
      reason,
      shouldSendEmail
    };

    mutate({
      variables: { input }
    }).then(response => {
      if (!response.errors) {
        history.push(`/governance-review-team/${systemId}/notes`);
      }
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={rejectIntakeSchema}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
    >
      {(formikProps: FormikProps<RejectIntakeForm>) => {
        const {
          errors,
          setErrors,
          handleSubmit,
          submitForm,
          setFieldValue
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
            {mutationResult.error && (
              <ErrorAlert heading="Error issuing lifecycle id">
                <ErrorAlertMessage
                  message={mutationResult.error.message}
                  errorKey="systemIntake"
                />
              </ErrorAlert>
            )}
            <PageHeading data-testid="not-approved">
              {t('rejectIntake.heading')}
            </PageHeading>
            <h3>{t('rejectIntake.subheading')}</h3>
            <p>
              {t('rejectIntake.actionDescription')}{' '}
              <Link to={backLink}>{t('rejectIntake.backLink')}</Link>
            </p>
            <div className="margin-bottom-7">
              <Form
                onSubmit={e => {
                  handleSubmit(e);
                  window.scrollTo(0, 0);
                }}
              >
                <FieldGroup scrollElement="reason" error={!!flatErrors.reason}>
                  <Label
                    htmlFor="RejectIntakeForm-Reason"
                    className="line-height-body-2"
                  >
                    {t('rejectIntake.reasonLabel')}
                  </Label>
                  <HelpText className="margin-top-05 line-height-body-5 text-base">
                    {t('rejectIntake.reasonHelpText')}
                  </HelpText>
                  <FieldErrorMsg>{flatErrors.reason}</FieldErrorMsg>
                  <Field
                    as={TextAreaField}
                    error={!!flatErrors.reason}
                    id="RejectIntakeForm-Reason"
                    maxLength={3000}
                    name="reason"
                  />
                </FieldGroup>
                <FieldGroup
                  scrollElement="nextSteps"
                  error={!!flatErrors.nextSteps}
                  className="margin-top-4"
                >
                  <Label
                    htmlFor="RejectIntakeForm-NextSteps"
                    className="line-height-body-2"
                  >
                    {t('rejectIntake.nextStepsLabel')}
                  </Label>
                  <HelpText className="margin-top-05 line-height-body-5 text-base">
                    {t('rejectIntake.nextStepsHelpText')}
                  </HelpText>
                  <FieldErrorMsg>{flatErrors.nextSteps}</FieldErrorMsg>
                  <Field
                    as={TextAreaField}
                    error={!!flatErrors.nextSteps}
                    id="RejectIntakeForm-NextSteps"
                    maxLength={3000}
                    name="nextSteps"
                  />
                </FieldGroup>
                <FieldGroup
                  scrollElement="feedback"
                  error={!!flatErrors.feedback}
                  className="margin-top-5"
                >
                  <EmailRecipientsFields />
                  <Label
                    htmlFor="RejectIntakeForm-Feedback"
                    className="margin-top-0 line-height-body-2 text-normal"
                  >
                    {t('rejectIntake.feedbackLabel')}
                  </Label>
                  <HelpText
                    id="RejectIntakeForm-SubmitHelp"
                    className="margin-top-05 line-height-body-5 text-base"
                  >
                    {t('rejectIntake.submitHelp')}
                  </HelpText>
                  <FieldErrorMsg>{flatErrors.feedback}</FieldErrorMsg>
                  <Field
                    as={TextAreaField}
                    error={!!flatErrors.feedback}
                    id="RejectIntakeForm-Feedback"
                    maxLength={2000}
                    name="feedback"
                    aria-describedby="RejectIntakeForm-SubmitHelp"
                  />
                </FieldGroup>
                <div>
                  <Button
                    className="margin-top-2"
                    type="submit"
                    onClick={() => {
                      setErrors({});
                      setShouldSendEmail(true);
                      setFieldValue('skipEmail', false);
                    }}
                  >
                    {t('rejectIntake.submit')}
                  </Button>
                </div>
                <div className="margin-bottom-2">
                  <CompleteWithoutEmailButton
                    onClick={() => {
                      setErrors({});
                      setShouldSendEmail(false);
                      setFieldValue('skipEmail', true);
                      setTimeout(submitForm);
                    }}
                  />
                </div>
              </Form>
              <UswdsLink
                href="https://www.surveymonkey.com/r/DF3Q9L2"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open EASi survey in a new tab"
              >
                {t('general:feedback.whatYouThink')}
              </UswdsLink>
            </div>
          </>
        );
      }}
    </Formik>
  );
};

export default RejectIntake;
