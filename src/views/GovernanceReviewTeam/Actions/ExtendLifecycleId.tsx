import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

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
import { formatDateAndIgnoreTimezone } from 'utils/date';
import flattenErrors from 'utils/flattenErrors';
import { extendLifecycleIdSchema } from 'validations/actionSchema';

type ExtendLCIDForm = {
  currentExpiresAt: string;
  newExpirationDay: string;
  newExpirationMonth: string;
  newExpirationYear: string;
};

type ExtendLifecycleIdProps = {
  lcid: string;
  lcidExpiresAt: string;
};
const ExtendLifecycleId = ({ lcid, lcidExpiresAt }: ExtendLifecycleIdProps) => {
  const { t } = useTranslation('action');
  const { systemId } = useParams<{ systemId: string }>();
  const initialValues: ExtendLCIDForm = {
    currentExpiresAt: lcidExpiresAt,
    newExpirationDay: '',
    newExpirationMonth: '',
    newExpirationYear: ''
  };

  const handleSubmit = () => {};

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
        const { errors } = formikProps;
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

            <PageHeading>{t('extendLcid.heading')}</PageHeading>
            <h2>{t('extendLcid.subheading')}</h2>
            <p>
              {t('extendLcid.action')}{' '}
              <Link to={`/governance-review-team/${systemId}/actions`}>
                {t('extendLcid.back')}
              </Link>
            </p>
            <div className="tablet:grid-col-6">
              <MandatoryFieldsAlert />
            </div>
            <div className="tablet:grid-col-9 margin-bottom-7">
              <dl title="Existing Lifecycle ID">
                <dt className="text-bold margin-bottom-1">
                  {t('extendLcid.currentLcid')}
                </dt>
                <dd className="margin-left-0 margin-bottom-2">{lcid}</dd>

                <dt className="text-bold margin-bottom-1">
                  {t('extendLcid.currentLcidExpiration')}
                </dt>
                <dd className="margin-left-0 margin-bottom-2">
                  {formatDateAndIgnoreTimezone(lcidExpiresAt)}
                </dd>
              </dl>

              <Form>
                <FieldGroup>
                  <fieldset className="usa-fieldset margin-top-2">
                    <legend className="usa-label margin-bottom-1">
                      {t('extendLcid.expirationDate.label')}
                    </legend>
                    <HelpText>
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
                      <div className="usa-form-group usa-form-group--month">
                        <Label htmlFor="ExtendLifecycleId-NewExpirationMonth">
                          {t('extendLcid.expirationDate.month')}
                        </Label>
                        <Field
                          as={DateInputMonth}
                          error={!!flatErrors.newExpirationMonth}
                          id="ExtendLifecycleId-NewExpirationMonth"
                          name="newExpirationMonth"
                        />
                      </div>
                      <div className="usa-form-group usa-form-group--day">
                        <Label htmlFor="ExtendLifecycleId-NewExpirationDay">
                          {t('extendLcid.expirationDate.day')}
                        </Label>
                        <Field
                          as={DateInputDay}
                          error={!!flatErrors.newExpirationDay}
                          id="ExtendLifecycleId-NewExpirationDay"
                          name="newExpirationDay"
                        />
                      </div>
                      <div className="usa-form-group usa-form-group--year">
                        <Label htmlFor="ExtendLifecycleId-NewExpirationYear">
                          {t('extendLcid.expirationDate.year')}
                        </Label>
                        <Field
                          as={DateInputYear}
                          error={!!flatErrors.newExpirationYear}
                          id="ExtendLifecycleId-NewExpirationYear"
                          name="newExpirationYear"
                        />
                      </div>
                    </div>
                  </fieldset>
                </FieldGroup>
                <p className="margin-top-6 line-height-body-3">
                  {t('extendLcid.submissionInfo')}
                </p>
                <Button className="margin-y-2" type="submit">
                  {t('extendLcid.submit')}
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
