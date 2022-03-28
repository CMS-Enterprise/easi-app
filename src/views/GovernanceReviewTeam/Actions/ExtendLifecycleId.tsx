import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { ApolloQueryResult, useMutation } from '@apollo/client';
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
import TextAreaField from 'components/shared/TextAreaField';
import CreateSystemIntakeActionExtendLifecycleIdQuery from 'queries/CreateSystemIntakeActionExtendLifecycleIdQuery';
import {
  CreateSystemIntakeActionExtendLifecycleId,
  CreateSystemIntakeActionExtendLifecycleIdVariables
} from 'queries/types/CreateSystemIntakeActionExtendLifecycleId';
import { GetSystemIntake } from 'queries/types/GetSystemIntake';
import { formatDateAndIgnoreTimezone } from 'utils/date';
import flattenErrors from 'utils/flattenErrors';
import { extendLifecycleIdSchema } from 'validations/actionSchema';

import EmailRecipientsFields from './EmailRecipientsFields';

type ExtendLCIDForm = {
  currentExpiresAt: string;
  newExpirationDay: string;
  newExpirationMonth: string;
  newExpirationYear: string;
  currentScope: string;
  newScope: string;
  currentNextSteps: string;
  newNextSteps: string;
  currentCostBaseline: string;
  newCostBaseline: string;
};

type ExtendLifecycleIdProps = {
  lcid: string;
  lcidExpiresAt: string;
  lcidScope: string;
  lcidNextSteps: string;
  lcidCostBaseline: string;
  onSubmit(): Promise<ApolloQueryResult<GetSystemIntake>>;
};

const RADIX = 10;

const ExtendLifecycleId = ({
  lcid,
  lcidExpiresAt,
  lcidScope,
  lcidNextSteps,
  lcidCostBaseline,
  onSubmit
}: ExtendLifecycleIdProps) => {
  const { t } = useTranslation('action');
  const { systemId } = useParams<{ systemId: string }>();
  const history = useHistory();
  const initialValues: ExtendLCIDForm = {
    currentExpiresAt: lcidExpiresAt,
    newExpirationDay: '',
    newExpirationMonth: '',
    newExpirationYear: '',
    currentScope: lcidScope,
    newScope: '',
    currentNextSteps: lcidNextSteps,
    newNextSteps: '',
    currentCostBaseline: lcidCostBaseline,
    newCostBaseline: ''
  };

  const [extendLifecycleID, extendLifecycleIDStatus] = useMutation<
    CreateSystemIntakeActionExtendLifecycleId,
    CreateSystemIntakeActionExtendLifecycleIdVariables
  >(CreateSystemIntakeActionExtendLifecycleIdQuery);

  const handleSubmit = (values: ExtendLCIDForm) => {
    const {
      newExpirationMonth = '',
      newExpirationDay = '',
      newExpirationYear = '',
      newScope = '',
      newNextSteps = '',
      newCostBaseline = ''
    } = values;
    const expiresAt = DateTime.utc(
      parseInt(newExpirationYear, RADIX),
      parseInt(newExpirationMonth, RADIX),
      parseInt(newExpirationDay, RADIX)
    ).toISO();
    extendLifecycleID({
      variables: {
        input: {
          id: systemId,
          expirationDate: expiresAt,
          scope: newScope,
          nextSteps: newNextSteps,
          costBaseline: newCostBaseline
        }
      }
    }).then(response => {
      if (!response.errors) {
        history.push(`/governance-review-team/${systemId}/notes`);
        onSubmit();
      }
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={extendLifecycleIdSchema}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
    >
      {(formikProps: FormikProps<ExtendLCIDForm>) => {
        const { errors, setErrors } = formikProps;
        const flatErrors = flattenErrors(errors);

        return (
          <>
            {Object.keys(errors).length > 0 && (
              <ErrorAlert
                testId="extend-lcid-errors"
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

            <PageHeading className="margin-top-0 margin-bottom-3">
              {t('extendLcid.heading')}
            </PageHeading>
            <h3 className="margin-top-3 margin-bottom-2">
              {t('extendLcid.subheading')}
            </h3>
            <div className="margin-bottom-05 text-bold line-height-body-2">
              {t('extendLcid.selectedAction')}
            </div>
            <div>
              {t('extendLcid.action')}{' '}
              <Link to={`/governance-review-team/${systemId}/actions`}>
                {t('extendLcid.back')}
              </Link>
            </div>
            <div className="tablet:grid-col-9 margin-bottom-7">
              <h3 className="margin-top-3 margin-bottom-2">
                {t('extendLcid.currentLcid')}
              </h3>
              <dl title="Existing Lifecycle ID" className="margin-bottom-5">
                <dt className="text-bold">{t('extendLcid.lifecycleId')}</dt>
                <dd className="margin-left-0 margin-bottom-2 line-height-body-5">
                  {lcid}
                </dd>
                <dt className="text-bold">
                  {t('extendLcid.currentLcidExpiration')}
                </dt>
                <dd className="margin-left-0 margin-bottom-2 line-height-body-5">
                  {formatDateAndIgnoreTimezone(lcidExpiresAt)}
                </dd>
                <dt className="text-bold">{t('extendLcid.currentScope')}</dt>
                <dd className="margin-left-0 margin-bottom-2 line-height-body-5">
                  {lcidScope}
                </dd>
                <dt className="text-bold">
                  {t('extendLcid.currentNextSteps')}
                </dt>
                <dd className="margin-left-0 margin-bottom-2 line-height-body-5">
                  {lcidNextSteps}
                </dd>
                <dt className="text-bold">
                  {t('extendLcid.currentCostBaseline')}
                </dt>
                <dd className="margin-left-0 margin-bottom-2 line-height-body-5">
                  {lcidCostBaseline || t('extendLcid.noCostBaseline')}
                </dd>
              </dl>
              <hr className="border-0 height-1px bg-base-light " />
              <h3 className="margin-top-5 margin-bottom-2">
                {t('extendLcid.newLcid')}
              </h3>
              <MandatoryFieldsAlert />
              <Form>
                <FieldGroup scrollElement="validDate">
                  <fieldset className="usa-fieldset margin-top-4">
                    <legend className="usa-label line-height-body-2">
                      {t('extendLcid.expirationDate.label')}
                    </legend>
                    <HelpText className="margin-top-05 line-height-body-5 text-base">
                      {t('extendLcid.expirationDate.helpText')}
                    </HelpText>
                    <FieldErrorMsg>{flatErrors.newExpirationDay}</FieldErrorMsg>
                    <FieldErrorMsg>
                      {flatErrors.newExpirationMonth}
                    </FieldErrorMsg>
                    <FieldErrorMsg>
                      {flatErrors.newExpirationYear}
                    </FieldErrorMsg>
                    <FieldErrorMsg>{flatErrors.validDate}</FieldErrorMsg>
                    <div className="usa-memorable-date">
                      <div className="usa-form-group usa-form-group--month margin-top-105 margin-right-1 width-7">
                        <Label
                          htmlFor="ExtendLifecycleId-NewExpirationMonth"
                          className="line-height-body-3 text-normal"
                        >
                          {t('extendLcid.expirationDate.month')}
                        </Label>
                        <Field
                          as={DateInputMonth}
                          error={!!flatErrors.newExpirationMonth}
                          id="ExtendLifecycleId-NewExpirationMonth"
                          name="newExpirationMonth"
                          className="margin-top-05"
                        />
                      </div>
                      <div className="usa-form-group usa-form-group--day margin-top-105 margin-right-1 width-7">
                        <Label
                          htmlFor="ExtendLifecycleId-NewExpirationDay"
                          className="line-height-body-3 text-normal"
                        >
                          {t('extendLcid.expirationDate.day')}
                        </Label>
                        <Field
                          as={DateInputDay}
                          error={!!flatErrors.newExpirationDay}
                          id="ExtendLifecycleId-NewExpirationDay"
                          name="newExpirationDay"
                          className="margin-top-05"
                        />
                      </div>
                      <div className="usa-form-group usa-form-group--year margin-top-105 margin-right-1 width-10">
                        <Label
                          htmlFor="ExtendLifecycleId-NewExpirationYear"
                          className="line-height-body-3 text-normal"
                        >
                          {t('extendLcid.expirationDate.year')}
                        </Label>
                        <Field
                          as={DateInputYear}
                          error={!!flatErrors.newExpirationYear}
                          id="ExtendLifecycleId-NewExpirationYear"
                          name="newExpirationYear"
                          className="margin-top-05"
                        />
                      </div>
                    </div>
                  </fieldset>
                </FieldGroup>
                <FieldGroup
                  scrollElement="scope"
                  error={!!flatErrors.newScope}
                  className="margin-top-4"
                >
                  <Label
                    htmlFor="ExtendLifecycleIdForm-Scope"
                    className="line-height-body-2"
                  >
                    {t('issueLCID.scopeLabel')}
                  </Label>
                  <HelpText className="margin-top-05 line-height-body-5 text-base">
                    {t('extendLcid.scopeHelpText')}
                  </HelpText>
                  <FieldErrorMsg>{flatErrors.newScope}</FieldErrorMsg>
                  <Field
                    as={TextAreaField}
                    error={!!flatErrors.newScope}
                    id="ExtendLifecycleIdForm-Scope"
                    maxLength={3000}
                    name="newScope"
                  />
                </FieldGroup>
                <FieldGroup
                  scrollElement="nextSteps"
                  error={!!flatErrors.newNextSteps}
                  className="margin-top-4"
                >
                  <Label
                    htmlFor="ExtendLifecycleIdForm-NextSteps"
                    className="line-height-body-2"
                  >
                    {t('issueLCID.nextStepsLabel')}
                  </Label>
                  <HelpText className="margin-top-05 line-height-body-5 text-base">
                    {t('extendLcid.nextStepsHelpText')}
                  </HelpText>
                  <FieldErrorMsg>{flatErrors.newNextSteps}</FieldErrorMsg>
                  <Field
                    as={TextAreaField}
                    error={!!flatErrors.newNextSteps}
                    id="ExtendLifecycleIdForm-NextSteps"
                    maxLength={3000}
                    name="newNextSteps"
                  />
                </FieldGroup>
                <FieldGroup className="margin-top-4">
                  <Label
                    htmlFor="ExtendLifecycleIdForm-CostBaseline"
                    className="line-height-body-2"
                  >
                    {t('issueLCID.costBaselineLabel')}
                  </Label>
                  <HelpText className="margin-top-05 line-height-body-5 text-base">
                    {t('extendLcid.costBaselineHelpText')}
                  </HelpText>
                  <Field
                    as={TextAreaField}
                    id="ExtendLifecycleIdForm-CostBaseline"
                    maxLength={3000}
                    name="newCostBaseline"
                  />
                </FieldGroup>
                <EmailRecipientsFields className="margin-top-5" />
                <p className="margin-top-3 margin-bottom-0 line-height-body-5 text-base">
                  {t('extendLcid.submissionInfo')}
                </p>
                <Button
                  className="margin-top-1"
                  type="submit"
                  onClick={() => setErrors({})}
                  disabled={extendLifecycleIDStatus.loading}
                >
                  {t('submitAction.submit')}
                </Button>
              </Form>
            </div>
          </>
        );
      }}
    </Formik>
  );
};

export default ExtendLifecycleId;
