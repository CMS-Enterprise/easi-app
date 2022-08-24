import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Button } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';
import { DateTime } from 'luxon';

import MandatoryFieldsAlert from 'components/MandatoryFieldsAlert';
import PageHeading from 'components/PageHeading';
import {
  DateInputDay,
  DateInputMonth,
  DateInputYear
} from 'components/shared/DateInput';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import { RadioField } from 'components/shared/RadioField';
import TextAreaField from 'components/shared/TextAreaField';
import TextField from 'components/shared/TextField';
import IssueLifecycleIdQuery from 'queries/IssueLifecycleIdQuery';
import {
  IssueLifecycleId as IssueLifecycleIdType,
  IssueLifecycleIdVariables
} from 'queries/types/IssueLifecycleId';
import { SubmitLifecycleIdForm } from 'types/action';
import { SystemIntakeContactProps } from 'types/systemIntake';
import flattenErrors from 'utils/flattenErrors';
import { lifecycleIdSchema } from 'validations/actionSchema';

import CompleteWithoutEmailButton from './CompleteWithoutEmailButton';
import EmailRecipientsFields from './EmailRecipientsFields';

const RADIX = 10;

const IssueLifecycleId = () => {
  const { systemId } = useParams<{ systemId: string }>();
  const history = useHistory();
  const { t } = useTranslation('action');
  const [shouldSendEmail, setShouldSendEmail] = useState<boolean>(true);

  const [mutate, mutationResult] = useMutation<
    IssueLifecycleIdType,
    IssueLifecycleIdVariables
  >(IssueLifecycleIdQuery, {
    errorPolicy: 'all'
  });

  const [
    activeContact,
    setActiveContact
  ] = useState<SystemIntakeContactProps | null>(null);

  const backLink = `/governance-review-team/${systemId}/actions`;

  // TODO: Fix Text Field so we don't have to set initial empty values
  const initialValues: SubmitLifecycleIdForm = {
    lifecycleId: '',
    expirationDateDay: '',
    expirationDateMonth: '',
    expirationDateYear: '',
    newLifecycleId: undefined,
    feedback: ''
  };

  const onSubmit = (values: SubmitLifecycleIdForm) => {
    const {
      feedback,
      expirationDateMonth = '',
      expirationDateDay = '',
      expirationDateYear = '',
      nextSteps,
      scope,
      costBaseline,
      lifecycleId
    } = values;
    const expiresAt = DateTime.utc(
      parseInt(expirationDateYear, RADIX),
      parseInt(expirationDateMonth, RADIX),
      parseInt(expirationDateDay, RADIX)
    );
    const input = {
      intakeId: systemId,
      expiresAt: expiresAt.toISO(),
      nextSteps,
      scope: scope ?? '',
      costBaseline,
      lcid: lifecycleId,
      feedback,
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
      validationSchema={lifecycleIdSchema}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
    >
      {(formikProps: FormikProps<SubmitLifecycleIdForm>) => {
        const {
          errors,
          setFieldValue,
          values,
          handleSubmit,
          submitForm
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
            <PageHeading
              data-testid="issue-lcid"
              className="margin-top-0 margin-bottom-3"
            >
              {t('issueLCID.heading')}
            </PageHeading>
            <h3>{t('issueLCID.subheading')}</h3>
            <p>
              Approve request and issue Lifecycle ID{' '}
              <Link to={backLink}>Change</Link>
            </p>
            <h3 className="margin-top-3 margin-bottom-2">
              {t('issueLCID.lifecycleId')}
            </h3>
            <MandatoryFieldsAlert textClassName="font-body-md" />
            <div className="margin-bottom-7">
              <Form
                onSubmit={e => {
                  handleSubmit(e);
                  window.scrollTo(0, 0);
                }}
              >
                <FieldGroup
                  scrollElement="newLifecycleId"
                  error={!!flatErrors.newLifecycleId}
                  className="margin-top-4"
                >
                  <fieldset className="usa-fieldset">
                    <legend className="usa-label line-height-body-2 font-heading-sm">
                      {t('issueLCID.lcid.label')}
                    </legend>
                    <HelpText className="margin-top-05 line-height-body-5 text-base">
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
                      <FieldGroup
                        scrollElement="lifecycleId"
                        error={!!flatErrors.lifecycleId}
                        className="margin-top-4"
                      >
                        <Label
                          htmlFor="IssueLifecycleIdForm-LifecycleId"
                          className="line-height-body-2"
                        >
                          {t('issueLCID.lcid.label')}
                        </Label>
                        <HelpText
                          id="IssueLifecycleIdForm-LifecycleIdHelp"
                          className="margin-top-05 line-height-body-5 text-base"
                        >
                          For example A123456 or 123456
                        </HelpText>
                        <FieldErrorMsg>{flatErrors.lifecycleId}</FieldErrorMsg>
                        <Field
                          as={TextField}
                          className="width-card-lg"
                          error={!!flatErrors.lifecycleId}
                          id="IssueLifecycleIdForm-LifecycleId"
                          aria-describedby="IssueLifecycleIdForm-LifecycleIdHelp"
                          maxLength={7}
                          name="lifecycleId"
                        />
                      </FieldGroup>
                    )}
                  </fieldset>
                </FieldGroup>
                <FieldGroup className="margin-top-4">
                  <fieldset className="usa-fieldset">
                    <legend className="usa-label line-height-body-2 font-heading-sm">
                      {t('issueLCID.expirationDate.label')}
                    </legend>
                    <HelpText className="margin-top-05 line-height-body-5 text-base">
                      {t('issueLCID.expirationDate.helpText')}
                    </HelpText>
                    <FieldErrorMsg>{flatErrors.validDate}</FieldErrorMsg>
                    <FieldErrorMsg>
                      {flatErrors.expirationDateMonth}
                    </FieldErrorMsg>
                    <FieldErrorMsg>
                      {flatErrors.expirationDateDay}
                    </FieldErrorMsg>
                    <FieldErrorMsg>
                      {flatErrors.expirationDateYear}
                    </FieldErrorMsg>
                    <div className="usa-memorable-date">
                      <div className="usa-form-group usa-form-group--month margin-top-105 margin-right-1 width-7">
                        <Label
                          htmlFor="IssueLifecycleIdForm-ExpirationDateMonth"
                          className="line-height-body-3 text-normal"
                        >
                          {t('issueLCID.expirationDate.month')}
                        </Label>
                        <Field
                          as={DateInputMonth}
                          error={
                            !!flatErrors.expirationDateMonth ||
                            !!flatErrors.validDate
                          }
                          id="IssueLifecycleIdForm-ExpirationDateMonth"
                          name="expirationDateMonth"
                          className="margin-top-1"
                        />
                      </div>
                      <div className="usa-form-group usa-form-group--day margin-top-105 margin-right-1 width-7">
                        <Label
                          htmlFor="IssueLifecycleIdForm-ExpirationDateDay"
                          className="line-height-body-3 text-normal"
                        >
                          {t('issueLCID.expirationDate.day')}
                        </Label>
                        <Field
                          as={DateInputDay}
                          error={
                            !!flatErrors.expirationDateDay ||
                            !!flatErrors.validDate
                          }
                          id="IssueLifecycleIdForm-ExpirationDateDay"
                          name="expirationDateDay"
                          className="margin-top-1"
                        />
                      </div>
                      <div className="usa-form-group usa-form-group--year margin-top-105 margin-right-1 width-10">
                        <Label
                          htmlFor="IssueLifecycleIdForm-ExpirationDateYear"
                          className="line-height-body-3 text-normal"
                        >
                          {t('issueLCID.expirationDate.year')}
                        </Label>
                        <Field
                          as={DateInputYear}
                          error={!!flatErrors.expirationDateYear}
                          id="IssueLifecycleIdForm-ExpirationDateYear"
                          name="expirationDateYear"
                          className="margin-top-1"
                        />
                      </div>
                    </div>
                  </fieldset>
                </FieldGroup>
                <FieldGroup
                  scrollElement="scope"
                  error={!!flatErrors.scope}
                  className="margin-top-4"
                >
                  <Label
                    htmlFor="IssueLifecycleIdForm-Scope"
                    className="line-height-body-2"
                  >
                    {t('issueLCID.scopeLabel')}
                  </Label>
                  <HelpText className="margin-top-05 line-height-body-5 text-base">
                    {t('issueLCID.scopeHelpText')}
                  </HelpText>
                  <FieldErrorMsg>{flatErrors.scope}</FieldErrorMsg>
                  <Field
                    as={TextAreaField}
                    error={!!flatErrors.scope}
                    id="IssueLifecycleIdForm-Scope"
                    maxLength={3000}
                    name="scope"
                  />
                </FieldGroup>
                <FieldGroup
                  scrollElement="nextSteps"
                  error={!!flatErrors.nextSteps}
                  className="margin-top-4"
                >
                  <Label
                    htmlFor="IssueLifecycleIdForm-NextSteps"
                    className="line-height-body-2"
                  >
                    {t('issueLCID.nextStepsLabel')}
                  </Label>
                  <HelpText className="margin-top-05 line-height-body-5 text-base">
                    {t('issueLCID.nextStepsHelpText')}
                  </HelpText>
                  <FieldErrorMsg>{flatErrors.nextSteps}</FieldErrorMsg>
                  <Field
                    as={TextAreaField}
                    error={!!flatErrors.nextSteps}
                    id="IssueLifecycleIdForm-NextSteps"
                    maxLength={3000}
                    name="nextSteps"
                  />
                </FieldGroup>
                <FieldGroup className="margin-top-4">
                  <Label htmlFor="IssueLifecycleIdForm-CostBaseline">
                    {t('issueLCID.costBaselineLabel')}
                  </Label>
                  <HelpText className="margin-top-05 line-height-body-5 text-base">
                    {t('issueLCID.costBaselineHelpText')}
                  </HelpText>
                  <Field
                    as={TextAreaField}
                    id="IssueLifecycleIdForm-CostBaseline"
                    maxLength={3000}
                    name="costBaseline"
                  />
                </FieldGroup>
                <FieldGroup
                  scrollElement="feedback"
                  error={!!flatErrors.feedback}
                  className="margin-top-5"
                >
                  <EmailRecipientsFields
                    systemIntakeId={systemId}
                    activeContact={activeContact}
                    setActiveContact={setActiveContact}
                  />
                  <Label
                    htmlFor="IssueLifecycleIdForm-Feedback"
                    className="margin-top-0 line-height-body-2 text-normal"
                  >
                    {t('issueLCID.feedbackLabel')}
                  </Label>
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
                <div>
                  <Button
                    className="margin-top-2"
                    type="submit"
                    onClick={() => {
                      setShouldSendEmail(true);
                      setFieldValue('skipEmail', false);
                    }}
                    disabled={!!activeContact}
                  >
                    {t('submitAction.submit')}
                  </Button>
                </div>
                <div className="margin-bottom-2">
                  <CompleteWithoutEmailButton
                    onClick={() => {
                      setShouldSendEmail(false);
                      setFieldValue('skipEmail', true);
                      setTimeout(submitForm);
                    }}
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

export default IssueLifecycleId;
