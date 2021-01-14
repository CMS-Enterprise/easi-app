import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button, Link as UswdsLink } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import { RadioField } from 'components/shared/RadioField';
import TextAreaField from 'components/shared/TextAreaField';
import TextField from 'components/shared/TextField';
import { SubmitLifecycleIdForm } from 'types/action';
import { issueLifecycleIdForSystemIntake } from 'types/routines';
import flattenErrors from 'utils/flattenErrors';
import { lifecycleIdSchema } from 'validations/actionSchema';

const IssueLifecycleId = () => {
  const { systemId } = useParams<{ systemId: string }>();
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation('action');

  const backLink = `/governance-review-team/${systemId}/actions`;

  // TODO: Fix Text Field so we don't have to set initial empty values
  const initialValues: SubmitLifecycleIdForm = {
    lifecycleId: '',
    expirationDateDay: '',
    expirationDateMonth: '',
    expirationDateYear: ''
  };

  const onSubmit = (values: SubmitLifecycleIdForm) => {
    const {
      feedback,
      expirationDateMonth,
      expirationDateDay,
      expirationDateYear,
      nextSteps,
      scope,
      lifecycleId
    } = values;
    const lcidPayload = {
      lcidExpiresAt: `${expirationDateYear}-${expirationDateMonth}-${expirationDateDay}`,
      lcidNextSteps: nextSteps,
      lcidScope: scope,
      lcid: lifecycleId,
      feedback
    };
    const payload = { id: systemId, lcidPayload };
    dispatch(issueLifecycleIdForSystemIntake(payload));

    history.push(`/governance-review-team/${systemId}/intake-request`);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={lifecycleIdSchema}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
    >
      {(formikProps: FormikProps<SubmitLifecycleIdForm>) => {
        const { errors, setFieldValue, values } = formikProps;
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
                <FieldGroup
                  scrollElement="newLifecycleId"
                  error={!!flatErrors.newLifecycleId}
                >
                  <fieldset className="usa-fieldset margin-top-4">
                    <legend className="usa-label margin-bottom-1">
                      {t('issueLCID.lcid.label')}
                    </legend>
                    <HelpText className="margin-bottom-1">
                      {t('issueLCID.lcid.helpText')}
                    </HelpText>
                    <FieldErrorMsg>{flatErrors.newLifecycleId}</FieldErrorMsg>
                    <Field
                      as={RadioField}
                      checked={values.newLifecycleId === true}
                      id="IssueLifecycleIdForm-NewLifecycleIdYes"
                      name="newLifecycleId"
                      label={t('issueLCID.lcid.new')}
                      onChange={() => {
                        setFieldValue('newLifecycleId', true);
                        setFieldValue('lifecycleId', '');
                      }}
                      value
                    />
                    <Field
                      as={RadioField}
                      checked={values.newLifecycleId === false}
                      id="IssueLifecycleIdForm-NewLifecycleIdNo"
                      name="newLifecycleId"
                      label={t('issueLCID.lcid.existing')}
                      onChange={() => {
                        setFieldValue('newLifecycleId', false);
                      }}
                      value={false}
                    />
                    {values.newLifecycleId === false && (
                      <div className="width-card-lg margin-top-neg-2 margin-left-3 margin-bottom-1">
                        <FieldGroup
                          scrollElement="lifecycleId"
                          error={!!flatErrors.lifecycleId}
                        >
                          <Label htmlFor="IssueLifecycleIdForm-LifecycleId">
                            {t('issueLCID.lcid.label')}
                          </Label>
                          <FieldErrorMsg>
                            {flatErrors.lifecycleId}
                          </FieldErrorMsg>
                          <Field
                            as={TextField}
                            error={!!flatErrors.lifecycleId}
                            id="IssueLifecycleIdForm-LifecycleId"
                            maxLength={7}
                            name="lifecycleId"
                          />
                        </FieldGroup>
                      </div>
                    )}
                  </fieldset>
                </FieldGroup>
                <FieldGroup>
                  <fieldset className="usa-fieldset margin-top-4">
                    <legend className="usa-label margin-bottom-1">
                      {t('issueLCID.expirationDate.label')}
                    </legend>
                    <HelpText className="margin-bottom-1">
                      {t('issueLCID.expirationDate.helpText')}
                    </HelpText>
                    <div
                      className="usa-memorable-date"
                      style={{ marginTop: '-2rem' }}
                    >
                      <div className="usa-form-group usa-form-group--month">
                        <Label htmlFor="IssueLifecycleIdForm-ExpirationDateMonth">
                          {t('issueLCID.expirationDate.month')}
                        </Label>
                        <FieldErrorMsg>
                          {flatErrors.expirationDateMonth}
                        </FieldErrorMsg>
                        <Field
                          as={TextField}
                          error={!!flatErrors.expirationDateMonth}
                          id="IssueLifecycleIdForm-ExpirationDateMonth"
                          maxLength={2}
                          name="expirationDateMonth"
                        />
                      </div>
                      <div className="usa-form-group usa-form-group--day">
                        <Label htmlFor="IssueLifecycleIdForm-ExpirationDateDay">
                          {t('issueLCID.expirationDate.day')}
                        </Label>
                        <FieldErrorMsg>
                          {flatErrors.expirationDateDay}
                        </FieldErrorMsg>
                        <Field
                          as={TextField}
                          error={!!flatErrors.expirationDateDay}
                          id="IssueLifecycleIdForm-ExpirationDateDay"
                          maxLength={2}
                          name="expirationDateDay"
                        />
                      </div>
                      <div className="usa-form-group usa-form-group--year">
                        <Label htmlFor="IssueLifecycleIdForm-ExpirationDateYear">
                          {t('issueLCID.expirationDate.year')}
                        </Label>
                        <FieldErrorMsg>
                          {flatErrors.expirationDateYear}
                        </FieldErrorMsg>
                        <Field
                          as={TextField}
                          error={!!flatErrors.expirationDateYear}
                          id="IssueLifecycleIdForm-ExpirationDateYear"
                          maxLength={4}
                          name="expirationDateYear"
                        />
                      </div>
                    </div>
                  </fieldset>
                </FieldGroup>
                <FieldGroup scrollElement="scope" error={!!flatErrors.scope}>
                  <Label htmlFor="IssueLifecycleIdForm-Scope">
                    {t('issueLCID.scopeLabel')}
                  </Label>
                  <HelpText>{t('issueLCID.scopeHelpText')}</HelpText>
                  <FieldErrorMsg>{flatErrors.scope}</FieldErrorMsg>
                  <Field
                    as={TextAreaField}
                    error={!!flatErrors.scope}
                    id="IssueLifecycleIdForm-Scope"
                    maxLength={2000}
                    name="scope"
                  />
                </FieldGroup>
                <FieldGroup
                  scrollElement="nextSteps"
                  error={!!flatErrors.nextSteps}
                >
                  <Label htmlFor="IssueLifecycleIdForm-NextSteps">
                    {t('issueLCID.nextStepsLabel')}
                  </Label>
                  <HelpText>{t('issueLCID.nextStepsHelpText')}</HelpText>
                  <FieldErrorMsg>{flatErrors.nextSteps}</FieldErrorMsg>
                  <Field
                    as={TextAreaField}
                    error={!!flatErrors.nextSteps}
                    id="IssueLifecycleIdForm-NextSteps"
                    maxLength={2000}
                    name="nextSteps"
                  />
                </FieldGroup>
                <FieldGroup
                  scrollElement="feedback"
                  error={!!flatErrors.feedback}
                >
                  <Label htmlFor="IssueLifecycleIdForm-Feedback">
                    {t('issueLCID.feedbackLabel')}
                  </Label>
                  <HelpText id="IssueLifecycleIdForm-SubmitHelp">
                    {t('issueLCID.submitHelp')}
                  </HelpText>
                  <FieldErrorMsg>{flatErrors.feedback}</FieldErrorMsg>
                  <Field
                    as={TextAreaField}
                    error={!!flatErrors.feedback}
                    id="IssueLifecycleIdForm-Feedback"
                    maxLength={2000}
                    name="feedback"
                    aria-describedby="IssueLifecycleIdForm-SubmitHelp"
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

export default IssueLifecycleId;
