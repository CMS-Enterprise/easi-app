import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button, Link as UswdsLink } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import PageHeading from 'components/PageHeading';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import { RejectIntakeForm } from 'types/action';
import { rejectSystemIntake } from 'types/routines';
import flattenErrors from 'utils/flattenErrors';
import { rejectIntakeSchema } from 'validations/actionSchema';

const RejectIntake = () => {
  const { systemId } = useParams<{ systemId: string }>();
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation('action');

  const backLink = `/governance-review-team/${systemId}/actions`;

  const initialValues: RejectIntakeForm = {
    feedback: '',
    nextSteps: '',
    reason: ''
  };

  const onSubmit = (values: RejectIntakeForm) => {
    const { feedback, nextSteps, reason } = values;
    const rejectPayload = {
      rejectionNextSteps: nextSteps,
      rejectionReason: reason,
      feedback
    };
    const payload = { id: systemId, rejectPayload };
    dispatch(rejectSystemIntake(payload));

    history.push(`/governance-review-team/${systemId}/intake-request`);
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
        const { errors } = formikProps;
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
            <PageHeading>{t('rejectIntake.heading')}</PageHeading>
            <h2>{t('rejectIntake.subheading')}</h2>
            <p>
              {t('rejectIntake.actionDescription')}{' '}
              <Link to={backLink}>{t('rejectIntake.backLink')}</Link>
            </p>
            <div className="tablet:grid-col-9 margin-bottom-7">
              <Form>
                <FieldGroup scrollElement="reason" error={!!flatErrors.reason}>
                  <Label htmlFor="RejectIntakeForm-Reason">
                    {t('rejectIntake.reasonLabel')}
                  </Label>
                  <HelpText>{t('rejectIntake.reasonHelpText')}</HelpText>
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
                >
                  <Label htmlFor="RejectIntakeForm-NextSteps">
                    {t('rejectIntake.nextStepsLabel')}
                  </Label>
                  <HelpText>{t('rejectIntake.nextStepsHelpText')}</HelpText>
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
                >
                  <Label htmlFor="RejectIntakeForm-Feedback">
                    {t('rejectIntake.feedbackLabel')}
                  </Label>
                  <HelpText id="RejectIntakeForm-SubmitHelp">
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
                <Button className="margin-top-2" type="submit">
                  {t('rejectIntake.submit')}
                </Button>
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
