import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import { SubmitLifecycleIdForm } from 'types/action';
import flattenErrors from 'utils/flattenErrors';
import actionSchema from 'validations/actionSchema';

const IssueLifecycleId = () => {
  const { systemId } = useParams();
  const { t } = useTranslation('action');

  const backLink = `/governance-review-team/${systemId}/actions`;

  const initialValues: SubmitLifecycleIdForm = {};

  const dispatchSave = (values: SubmitLifecycleIdForm) => {
    const payload = { systemId, ...values };
    console.log(payload);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={dispatchSave}
      validationSchema={actionSchema}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
    >
      {(formikProps: FormikProps<SubmitLifecycleIdForm>) => {
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
            <h1>{t('issueLCID.heading')}</h1>
            <h2>{t('issueLCID.subheading')}</h2>
            <p>
              Approve request and issue Lifecycle ID{' '}
              <Link to={backLink}>Change</Link>
            </p>
            <div className="tablet:grid-col-9 margin-bottom-7">
              <Form>
                <FieldGroup scrollElement="scope" error={!!flatErrors.scope}>
                  <Label htmlFor="SubmitActionForm-Scope">
                    {t('issueLCID.scopeLabel')}
                  </Label>
                  <HelpText>{t('issueLCID.scopeHelpText')}</HelpText>
                  <FieldErrorMsg>{flatErrors.scope}</FieldErrorMsg>
                  <Field
                    as={TextAreaField}
                    error={!!flatErrors.scope}
                    id="SubmitActionForm-Scope"
                    maxLength={2000}
                    name="scope"
                  />
                </FieldGroup>
                <FieldGroup
                  scrollElement="next-steps"
                  error={!!flatErrors.nextSteps}
                >
                  <Label htmlFor="SubmitActionForm-Next-Steps">
                    {t('issueLCID.nextStepsLabel')}
                  </Label>
                  <HelpText>{t('issueLCID.nextStepsHelpText')}</HelpText>
                  <FieldErrorMsg>{flatErrors.nextSteps}</FieldErrorMsg>
                  <Field
                    as={TextAreaField}
                    error={!!flatErrors.nextSteps}
                    id="SubmitActionForm-Next-Steps"
                    maxLength={2000}
                    name="next-steps"
                  />
                </FieldGroup>
                <FieldGroup
                  scrollElement="feedback"
                  error={!!flatErrors.feedback}
                >
                  <Label htmlFor="SubmitActionForm-Feedback">
                    {t('issueLCID.feedbackLabel')}
                  </Label>
                  <FieldErrorMsg>{flatErrors.feedback}</FieldErrorMsg>
                  <Field
                    as={TextAreaField}
                    error={!!flatErrors.feedback}
                    id="SubmitActionForm-Feedback"
                    maxLength={2000}
                    name="feedback"
                  />
                </FieldGroup>
                <Button
                  className="margin-top-2"
                  type="submit"
                  // disabled={isSubmitting}
                >
                  {t('issueLCID.submit')}
                </Button>
              </Form>
            </div>
          </>
        );
      }}
    </Formik>
  );
};

export default IssueLifecycleId;
