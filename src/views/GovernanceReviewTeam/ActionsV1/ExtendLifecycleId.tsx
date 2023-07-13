import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { ApolloError, ApolloQueryResult, useMutation } from '@apollo/client';
import { Button } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
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
import useSystemIntakeContacts from 'hooks/useSystemIntakeContacts';
import CreateSystemIntakeActionExtendLifecycleIdQuery from 'queries/CreateSystemIntakeActionExtendLifecycleIdQuery';
import {
  CreateSystemIntakeActionExtendLifecycleId,
  CreateSystemIntakeActionExtendLifecycleIdVariables
} from 'queries/types/CreateSystemIntakeActionExtendLifecycleId';
import { GetSystemIntake } from 'queries/types/GetSystemIntake';
import { ActionForm } from 'types/action';
import { SystemIntakeContactProps } from 'types/systemIntake';
import { formatDateUtc } from 'utils/date';
import flattenErrors from 'utils/flattenErrors';
import { sharedLifecycleIdSchema } from 'validations/actionSchema';

import CompleteWithoutEmailButton from './CompleteWithoutEmailButton';
import EmailRecipientsFields from './EmailRecipientsFields';

interface ExtendLCIDForm extends ActionForm {
  currentCostBaseline: string;
  currentExpiresAt: string;
  currentNextSteps: string;
  currentScope: string;
  expirationDateDay: string;
  expirationDateMonth: string;
  expirationDateYear: string;
  newCostBaseline: string;
  nextSteps: string;
  scope: string;
}

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

  const initialValues: ExtendLCIDForm = {
    currentExpiresAt: lcidExpiresAt,
    expirationDateDay: '',
    expirationDateMonth: '',
    expirationDateYear: '',
    currentScope: lcidScope,
    scope: '',
    currentNextSteps: lcidNextSteps,
    nextSteps: '',
    currentCostBaseline: lcidCostBaseline,
    newCostBaseline: '',
    feedback: '',
    notificationRecipients: {
      regularRecipientEmails: [requester.email].filter(e => e), // Filter out null emails
      shouldNotifyITGovernance: true,
      shouldNotifyITInvestment: true
    },
    shouldSendEmail: true
  };

  const [extendLifecycleID, extendLifecycleIDStatus] = useMutation<
    CreateSystemIntakeActionExtendLifecycleId,
    CreateSystemIntakeActionExtendLifecycleIdVariables
  >(CreateSystemIntakeActionExtendLifecycleIdQuery);

  const handleSubmit = (
    values: ExtendLCIDForm,
    { setFieldError }: FormikHelpers<ExtendLCIDForm>
  ) => {
    const {
      expirationDateMonth = '',
      expirationDateDay = '',
      expirationDateYear = '',
      scope = '',
      nextSteps = '',
      newCostBaseline = '',
      notificationRecipients,
      shouldSendEmail
    } = values;

    // Get expiration date
    const expiresAt = DateTime.utc(
      parseInt(expirationDateYear, RADIX),
      parseInt(expirationDateMonth, RADIX),
      parseInt(expirationDateDay, RADIX)
    ).toISO();

    const variables: CreateSystemIntakeActionExtendLifecycleIdVariables = {
      input: {
        id: systemId,
        expirationDate: expiresAt,
        scope,
        nextSteps,
        costBaseline: newCostBaseline
      }
    };

    if (shouldSendEmail) {
      variables.input.notificationRecipients = notificationRecipients;
    }

    // GQL mutation to extend lifecycle ID
    extendLifecycleID({
      variables
    })
      .then(({ errors }) => {
        if (!errors) {
          // If no errors, view intake action notes
          history.push(`/governance-review-team/${systemId}/notes`);
          onSubmit();
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
      onSubmit={handleSubmit}
      validationSchema={sharedLifecycleIdSchema}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
      enableReinitialize
    >
      {(formikProps: FormikProps<ExtendLCIDForm>) => {
        const {
          errors,
          setErrors,
          submitForm,
          values,
          setFieldValue
        } = formikProps;
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

            <PageHeading
              data-testid="extend-lcid"
              className="margin-top-0 margin-bottom-3"
            >
              {t('extendLcid.heading')}
            </PageHeading>
            <h3 className="margin-top-3 margin-bottom-2">
              {t('extendLcid.subheading')}
            </h3>
            <div className="margin-bottom-05 text-bold line-height-body-2">
              {t('extendLcid.selectedAction')}
            </div>
            <div data-testid="grtSelectedAction">
              {t('extendLcid.action')}{' '}
              <Link to={`/governance-review-team/${systemId}/actions`}>
                {t('extendLcid.back')}
              </Link>
            </div>
            <div className="margin-bottom-7">
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
                  {formatDateUtc(lcidExpiresAt, 'MMMM d, yyyy')}
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
              <MandatoryFieldsAlert textClassName="font-body-md" />
              <Form>
                <FieldGroup scrollElement="validDate">
                  <fieldset className="usa-fieldset margin-top-4">
                    <legend className="usa-label line-height-body-2">
                      {t('extendLcid.expirationDate.label')}
                    </legend>
                    <HelpText className="margin-top-05 line-height-body-5 text-base">
                      {t('extendLcid.expirationDate.helpText')}
                    </HelpText>
                    <FieldErrorMsg>
                      {flatErrors.expirationDateDay}
                    </FieldErrorMsg>
                    <FieldErrorMsg>
                      {flatErrors.expirationDateMonth}
                    </FieldErrorMsg>
                    <FieldErrorMsg>
                      {flatErrors.expirationDateYear}
                    </FieldErrorMsg>
                    <FieldErrorMsg>{flatErrors.validDate}</FieldErrorMsg>
                    <div className="usa-memorable-date">
                      <div className="usa-form-group usa-form-group--month margin-top-105 margin-right-1 width-7">
                        <Label
                          htmlFor="ExtendLifecycleId-expirationDateMonth"
                          className="line-height-body-3 text-normal"
                        >
                          {t('extendLcid.expirationDate.month')}
                        </Label>
                        <Field
                          as={DateInputMonth}
                          error={
                            !!flatErrors.expirationDateMonth ||
                            !!flatErrors.validDate
                          }
                          id="ExtendLifecycleId-expirationDateMonth"
                          name="expirationDateMonth"
                          className="margin-top-05"
                        />
                      </div>
                      <div className="usa-form-group usa-form-group--day margin-top-105 margin-right-1 width-7">
                        <Label
                          htmlFor="ExtendLifecycleId-expirationDateDay"
                          className="line-height-body-3 text-normal"
                        >
                          {t('extendLcid.expirationDate.day')}
                        </Label>
                        <Field
                          as={DateInputDay}
                          error={
                            !!flatErrors.expirationDateDay ||
                            !!flatErrors.validDate
                          }
                          id="ExtendLifecycleId-expirationDateDay"
                          name="expirationDateDay"
                          className="margin-top-05"
                        />
                      </div>
                      <div className="usa-form-group usa-form-group--year margin-top-105 margin-right-1 width-10">
                        <Label
                          htmlFor="ExtendLifecycleId-expirationDateYear"
                          className="line-height-body-3 text-normal"
                        >
                          {t('extendLcid.expirationDate.year')}
                        </Label>
                        <Field
                          as={DateInputYear}
                          error={!!flatErrors.expirationDateYear}
                          id="ExtendLifecycleId-expirationDateYear"
                          name="expirationDateYear"
                          className="margin-top-05"
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
                    htmlFor="ExtendLifecycleIdForm-Scope"
                    className="line-height-body-2"
                  >
                    {t('issueLCID.scopeLabel')}
                  </Label>
                  <HelpText className="margin-top-05 line-height-body-5 text-base">
                    {t('extendLcid.scopeHelpText')}
                  </HelpText>
                  <FieldErrorMsg>{flatErrors.scope}</FieldErrorMsg>
                  <Field
                    as={TextAreaField}
                    error={!!flatErrors.scope}
                    id="ExtendLifecycleIdForm-Scope"
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
                    htmlFor="ExtendLifecycleIdForm-NextSteps"
                    className="line-height-body-2"
                  >
                    {t('issueLCID.nextStepsLabel')}
                  </Label>
                  <HelpText className="margin-top-05 line-height-body-5 text-base">
                    {t('extendLcid.nextStepsHelpText')}
                  </HelpText>
                  <FieldErrorMsg>{flatErrors.nextSteps}</FieldErrorMsg>
                  <Field
                    as={TextAreaField}
                    error={!!flatErrors.nextSteps}
                    id="ExtendLifecycleIdForm-NextSteps"
                    maxLength={3000}
                    name="nextSteps"
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
                <EmailRecipientsFields
                  className="margin-top-5"
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
                <p className="margin-top-3 margin-bottom-0 line-height-body-5 text-base">
                  {t('extendLcid.submissionInfo')}
                </p>
                <div>
                  <Button
                    className="margin-top-1"
                    type="submit"
                    onClick={() => {
                      setErrors({});
                      setFieldValue('shouldSendEmail', true);
                    }}
                    disabled={
                      extendLifecycleIDStatus.loading || !!activeContact
                    }
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

export default ExtendLifecycleId;
