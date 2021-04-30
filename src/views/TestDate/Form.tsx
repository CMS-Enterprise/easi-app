import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

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
import TextField from 'components/shared/TextField';
import { TestDateFormType } from 'types/accessibility';
import flattenErrors from 'utils/flattenErrors';
import { TestDateValidationSchema } from 'validations/testDateSchema';

import './styles.scss';

type TestDateFormProps = {
  initialValues: TestDateFormType;
  onSubmit: any;
  formType: string;
  error: any;
  requestName: string;
  requestId: string;
};

const TestDateForm = ({
  initialValues,
  onSubmit,
  formType,
  error,
  requestName,
  requestId
}: TestDateFormProps) => {
  const { t } = useTranslation('accessibility');

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={TestDateValidationSchema}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
    >
      {(formikProps: FormikProps<TestDateFormType>) => {
        const { errors, setFieldValue, values, handleSubmit } = formikProps;
        const flatErrors = flattenErrors(errors);
        return (
          <>
            {Object.keys(errors).length > 0 && (
              <ErrorAlert
                testId="test-date-errors"
                classNames="margin-bottom-4"
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
            {error && (
              <ErrorAlert heading="System error">
                <ErrorAlertMessage message={error.message} errorKey="system" />
              </ErrorAlert>
            )}
            <PageHeading>
              {t(`testDateForm.header.${formType}`, { requestName })}
            </PageHeading>
            <div className="grid-row grid-gap-lg">
              <div className="grid-col-9">
                <Form
                  onSubmit={e => {
                    handleSubmit(e);
                    window.scrollTo(0, 0);
                  }}
                >
                  <FieldGroup error={!!flatErrors.testType}>
                    <fieldset className="usa-fieldset">
                      <legend className="usa-label margin-bottom-1">
                        {t('testDateForm.testTypeHeader')}
                      </legend>
                      <FieldErrorMsg>{flatErrors.testType}</FieldErrorMsg>

                      <Field
                        as={RadioField}
                        checked={values.testType === 'INITIAL'}
                        id="TestDate-TestTypeInitial"
                        name="testType"
                        label="Initial"
                        value="INITIAL"
                      />
                      <Field
                        as={RadioField}
                        checked={values.testType === 'REMEDIATION'}
                        // Radios have a margin-bottom
                        // This is changing to margin-top in USWDS 2.9
                        className="margin-bottom-0"
                        id="TestDate-TestTypeRemediation"
                        name="testType"
                        label="Remediation"
                        value="REMEDIATION"
                      />
                    </fieldset>
                  </FieldGroup>
                  {/* GRT Date Fields */}
                  <FieldGroup
                    error={
                      !!flatErrors.dateMonth ||
                      !!flatErrors.dateDay ||
                      !!flatErrors.dateYear ||
                      !!flatErrors.validDate
                    }
                  >
                    <fieldset className="usa-fieldset margin-top-4">
                      <legend className="usa-label margin-bottom-1">
                        {t('testDateForm.dateHeader')}
                      </legend>
                      <HelpText id="TestDate-DateHelp">
                        {t('testDateForm.dateHelpText')}
                      </HelpText>
                      <FieldErrorMsg>{flatErrors.dateMonth}</FieldErrorMsg>
                      <FieldErrorMsg>{flatErrors.dateDay}</FieldErrorMsg>
                      <FieldErrorMsg>{flatErrors.dateYear}</FieldErrorMsg>
                      <FieldErrorMsg>{flatErrors.validDate}</FieldErrorMsg>
                      <div className="usa-memorable-date">
                        <div className="usa-form-group usa-form-group--month">
                          <Label
                            htmlFor="TestDate-DateMonth"
                            className="easi-508-test-date__date-label"
                          >
                            {t('general:date.month')}
                          </Label>
                          <Field
                            as={DateInputMonth}
                            error={!!flatErrors.dateMonth}
                            id="TestDate-DateMonth"
                            name="dateMonth"
                          />
                        </div>
                        <div className="usa-form-group usa-form-group--day">
                          <Label
                            htmlFor="TestDate-DateDay"
                            className="easi-508-test-date__date-label"
                          >
                            {t('general:date.day')}
                          </Label>
                          <Field
                            as={DateInputDay}
                            error={!!flatErrors.dateDay}
                            id="TestDate-DateDay"
                            name="dateDay"
                          />
                        </div>
                        <div className="usa-form-group usa-form-group--year">
                          <Label
                            htmlFor="TestDate-DateYear"
                            className="easi-508-test-date__date-label"
                          >
                            {t('general:date.year')}
                          </Label>
                          <Field
                            as={DateInputYear}
                            error={!!flatErrors.dateYear}
                            id="TestDate-DateYear"
                            name="dateYear"
                          />
                        </div>
                      </div>
                    </fieldset>
                  </FieldGroup>
                  <FieldGroup
                    scrollElement="score.isPresent"
                    error={!!flatErrors['score.isPresent']}
                  >
                    <fieldset className="usa-fieldset margin-top-4">
                      <legend className="usa-label margin-bottom-1">
                        {t('testDateForm.scoreHeader')}
                      </legend>

                      <FieldErrorMsg>
                        {flatErrors['score.isPresent']}
                      </FieldErrorMsg>
                      <Field
                        as={RadioField}
                        checked={values.score.isPresent === false}
                        id="TestDate-HasScoreNo"
                        name="score.isPresent"
                        label="No"
                        onChange={() => {
                          setFieldValue('score.isPresent', false);
                          setFieldValue('score.name', '');
                        }}
                        value={false}
                      />
                      <Field
                        as={RadioField}
                        checked={values.score.isPresent === true}
                        id="TestDate-HasScoreYes"
                        name="score.isPresent"
                        label="Yes"
                        onChange={() => {
                          setFieldValue('score.isPresent', true);
                        }}
                        value
                      />
                      {values.score.isPresent && (
                        <div className="width-card-lg margin-left-4 margin-bottom-1">
                          <FieldGroup
                            scrollElement="score.value"
                            error={!!flatErrors['score.value']}
                          >
                            <Label
                              htmlFor="TestDate-ScoreValue"
                              className="margin-bottom-1"
                              style={{ marginTop: '0.5em' }}
                              aria-label={t(
                                'testDateForm.scoreValueSRHelpText'
                              )}
                            >
                              {t('testDateForm.scoreValueHeader')}
                            </Label>
                            <FieldErrorMsg>
                              {flatErrors['score.value']}
                            </FieldErrorMsg>
                            <div className="display-flex">
                              <div className="width-10">
                                <Field
                                  as={TextField}
                                  error={!!flatErrors['score.value']}
                                  className="margin-top-0"
                                  id="TestDate-ScoreValue"
                                  maxLength={4}
                                  name="score.value"
                                />
                              </div>
                              <div className="bg-black text-white width-5 display-flex flex-justify-center flex-align-center">
                                <span className="text-bold">%</span>
                              </div>
                            </div>
                          </FieldGroup>
                        </div>
                      )}
                    </fieldset>
                  </FieldGroup>
                  <Button className="margin-top-4" type="submit">
                    {t(`testDateForm.submitButton.${formType}`)}
                  </Button>
                  <Link
                    to={`/508/requests/${requestId}`}
                    className="margin-top-2 display-block"
                  >
                    {t('testDateForm.cancel')}
                  </Link>
                </Form>
              </div>
            </div>
          </>
        );
      }}
    </Formik>
  );
};

export default TestDateForm;
