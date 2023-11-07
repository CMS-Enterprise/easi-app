import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import {
  Button,
  IconNavigateBefore,
  Label,
  Radio,
  Textarea,
  TextInput
} from '@trussworks/react-uswds';
import classnames from 'classnames';
import { Field, Form, Formik, FormikProps } from 'formik';
import { DateTime } from 'luxon';

import CharacterCounter from 'components/CharacterCounter';
import MandatoryFieldsAlert from 'components/MandatoryFieldsAlert';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import {
  DateInputDay,
  DateInputMonth,
  DateInputYear
} from 'components/shared/DateInput';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import IconButton from 'components/shared/IconButton';
import intakeFundingSources from 'constants/enums/intakeFundingSources';
import GetSystemIntakeQuery from 'queries/GetSystemIntakeQuery';
import { UpdateSystemIntakeContractDetails as UpdateSystemIntakeContractDetailsQuery } from 'queries/SystemIntakeQueries';
import { SystemIntake } from 'queries/types/SystemIntake';
import {
  UpdateSystemIntakeContractDetails,
  UpdateSystemIntakeContractDetailsVariables
} from 'queries/types/UpdateSystemIntakeContractDetails';
import { SystemIntakeFormState } from 'types/graphql-global-types';
import { ContractDetailsForm } from 'types/systemIntake';
import flattenErrors from 'utils/flattenErrors';
import SystemIntakeValidationSchema from 'validations/systemIntakeSchema';

import FeedbackBanner from '../FeedbackBanner';

import FundingSources from './FundingSources';

import './index.scss';

type ContractDetailsProps = {
  systemIntake: SystemIntake;
};

const ContractDetails = ({ systemIntake }: ContractDetailsProps) => {
  const history = useHistory();
  const formikRef = useRef<FormikProps<ContractDetailsForm>>(null);
  const { t } = useTranslation('intake');

  const {
    id,
    fundingSources,
    annualSpending,
    contract,
    existingFunding
  } = systemIntake;
  const initialValues: ContractDetailsForm = {
    existingFunding,
    fundingSources,
    annualSpending: {
      currentAnnualSpending: annualSpending?.currentAnnualSpending || '',
      plannedYearOneSpending: annualSpending?.plannedYearOneSpending || ''
    },
    contract: {
      contractor: contract.contractor || '',
      endDate: {
        day: contract.endDate.day || '',
        month: contract.endDate.month || '',
        year: contract.endDate.year || ''
      },
      hasContract: contract.hasContract || '',
      startDate: {
        day: contract.startDate.day || '',
        month: contract.startDate.month || '',
        year: contract.startDate.year || ''
      },
      number: contract.number || ''
    }
  };

  const saveExitLink = (() => {
    let link = '';
    if (systemIntake.requestType === 'SHUTDOWN') {
      link = '/';
    } else {
      link = `/governance-task-list/${systemIntake.id}`;
    }
    return link;
  })();

  const [mutate] = useMutation<
    UpdateSystemIntakeContractDetails,
    UpdateSystemIntakeContractDetailsVariables
  >(UpdateSystemIntakeContractDetailsQuery, {
    refetchQueries: [
      {
        query: GetSystemIntakeQuery,
        variables: {
          id
        }
      }
    ]
  });

  const formatContractDetailsPayload = (values: ContractDetailsForm) => {
    const startDate = DateTime.fromObject(
      {
        day: Number(values.contract.startDate.day) || 0,
        month: Number(values.contract.startDate.month) || 0,
        year: Number(values.contract.startDate.year) || 0
      },
      { zone: 'UTC' }
    ).toISO();

    const endDate = DateTime.fromObject(
      {
        day: Number(values.contract.endDate.day) || 0,
        month: Number(values.contract.endDate.month) || 0,
        year: Number(values.contract.endDate.year) || 0
      },
      { zone: 'UTC' }
    ).toISO();

    return {
      id,
      fundingSources: {
        existingFunding: !!(values.fundingSources.length > 0),
        fundingSources: values.fundingSources
      },
      // costs: values.costs,
      annualSpending: values.annualSpending,
      contract: {
        ...values.contract,
        startDate,
        endDate
      }
    };
  };

  const onSubmit = (values?: ContractDetailsForm) => {
    if (values) {
      mutate({
        variables: {
          input: formatContractDetailsPayload(values)
        }
      });
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={SystemIntakeValidationSchema.contractDetails}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
      innerRef={formikRef}
    >
      {(formikProps: FormikProps<ContractDetailsForm>) => {
        const { values, errors, setFieldValue } = formikProps;
        const flatErrors = flattenErrors(errors);
        return (
          <>
            {Object.keys(errors).length > 0 && (
              <ErrorAlert
                testId="contract-details-errors"
                classNames="margin-top-3"
                heading={t('form:inputError.checkFix')}
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

            <PageHeading className="margin-bottom-3">
              {t('contractDetails.heading')}
            </PageHeading>

            {systemIntake.requestFormState ===
              SystemIntakeFormState.EDITS_REQUESTED && (
              <FeedbackBanner
                id={systemIntake.id}
                className="margin-bottom-3"
              />
            )}

            <MandatoryFieldsAlert className="tablet:grid-col-6" />

            <Form className="tablet:grid-col-9 margin-bottom-7">
              <FieldGroup
                scrollElement="fundingSources"
                error={!!flatErrors.fundingSources}
              >
                <legend className="usa-label margin-bottom-1">
                  {t('contractDetails.fundingSources.label')}
                </legend>
                <HelpText id="Intake-Form-ExistingFundingHelp">
                  {t('contractDetails.fundingSources.helpText')}
                </HelpText>
                <Field
                  as={FundingSources}
                  id="IntakeForm-Added-FundingSources"
                  name="fundingSources"
                  initialValues={values.fundingSources}
                  setFieldValue={setFieldValue}
                  fundingSourceOptions={intakeFundingSources}
                />
              </FieldGroup>
              <FieldGroup
                scrollElement="annualSpending.currentAnnualSpending"
                error={!!flatErrors['annualSpending.currentAnnualSpending']}
              >
                <fieldset
                  className="usa-fieldset margin-top-4"
                  data-testid="annual-spend-fieldset"
                >
                  <legend className="usa-label margin-bottom-1">
                    {t('contractDetails.currentAnnualSpending')}
                  </legend>
                  <FieldErrorMsg>
                    {flatErrors['annualSpending.currentAnnualSpending']}
                  </FieldErrorMsg>
                  <Field
                    as={Textarea}
                    className="system-intake__current-annual-spending"
                    error={!!flatErrors['annualSpending.currentAnnualSpending']}
                    id="IntakeForm-CurrentAnnualSpending"
                    name="annualSpending.currentAnnualSpending"
                    maxLength={100}
                  />
                  <CharacterCounter
                    id="currentAnnualSpending-counter"
                    characterCount={
                      2000 - values.annualSpending.currentAnnualSpending.length
                    }
                  />
                  <legend className="usa-label margin-bottom-1">
                    {t('contractDetails.plannedYearOneSpending')}
                  </legend>
                  <FieldErrorMsg>
                    {flatErrors['annualSpending.plannedYearOneSpending']}
                  </FieldErrorMsg>
                  <Field
                    as={Textarea}
                    className="system-intake__year-one-annual-spending"
                    error={
                      !!flatErrors['annualSpending.plannedYearOneSpending']
                    }
                    id="IntakeForm-PlannedYearOneAnnualSpending"
                    name="annualSpending.plannedYearOneSpending"
                    maxLength={100}
                  />
                  <CharacterCounter
                    id="plannedYearOneAnnualSpending-counter"
                    characterCount={
                      2000 - values.annualSpending.plannedYearOneSpending.length
                    }
                  />
                </fieldset>
              </FieldGroup>
              <FieldGroup
                scrollElement="contract.hasContract"
                error={!!flatErrors['contract.hasContract']}
                className="margin-bottom-105"
              >
                <fieldset
                  className="usa-fieldset margin-top-4"
                  data-testid="contract-fieldset"
                >
                  <legend className="usa-label margin-bottom-1">
                    {t('contractDetails.hasContract')}
                  </legend>
                  <HelpText id="IntakeForm-HasContractHelp">
                    {t('contractDetails.hasContractHelpText')}
                  </HelpText>
                  <FieldErrorMsg>
                    {flatErrors['contract.hasContract']}
                  </FieldErrorMsg>
                  <Field
                    as={Radio}
                    checked={values.contract.hasContract === 'HAVE_CONTRACT'}
                    id="IntakeForm-ContractHaveContract"
                    name="contract.hasContract"
                    label={t('contractDetails.hasContractRadio', {
                      context: 'HAVE_CONTRACT'
                    })}
                    aria-describedby="IntakeForm-HasContractHelp"
                    aria-expanded={
                      values.contract.hasContract === 'HAVE_CONTRACT'
                    }
                    aria-controls="has-contract-branch-wrapper"
                  />
                  {values.contract.hasContract === 'HAVE_CONTRACT' && (
                    <div
                      id="has-contract-branch-wrapper"
                      className="margin-top-neg-2 margin-left-4 margin-bottom-2"
                    >
                      <FieldGroup
                        scrollElement="contract.contractor"
                        error={!!flatErrors['contract.contractor']}
                      >
                        <Label htmlFor="IntakeForm-Contractor">
                          {t('contractDetails.contractors')}
                        </Label>
                        <FieldErrorMsg>
                          {flatErrors['contract.contractor']}
                        </FieldErrorMsg>
                        <Field
                          as={TextInput}
                          error={!!flatErrors['contract.contractor']}
                          id="IntakeForm-Contractor"
                          maxLength={100}
                          name="contract.contractor"
                        />
                      </FieldGroup>
                      <FieldGroup
                        scrollElement="contract.number"
                        error={!!flatErrors['contract.number']}
                      >
                        <Label
                          className="system-intake__label-margin-top-1"
                          htmlFor="IntakeForm-Number"
                        >
                          {t('fields.contractNumber')}
                        </Label>
                        <FieldErrorMsg>
                          {flatErrors['contract.number']}
                        </FieldErrorMsg>
                        <Field
                          as={TextInput}
                          error={!!flatErrors['contract.number']}
                          id="IntakeForm-Number"
                          maxLength={100}
                          name="contract.number"
                        />
                      </FieldGroup>

                      <fieldset
                        className={classnames(
                          'usa-fieldset',
                          'usa-form-group',
                          'margin-top-4',
                          {
                            'usa-form-group--error':
                              errors.contract &&
                              (errors.contract.startDate ||
                                errors.contract.endDate)
                          }
                        )}
                      >
                        <legend className="usa-label">
                          {t('contractDetails.periodOfPerformance')}
                        </legend>
                        <HelpText className="margin-bottom-1">
                          {t('contractDetails.periodOfPerformanceHelpText')}
                        </HelpText>
                        <FieldErrorMsg>
                          {flatErrors['contract.startDate.month']}
                        </FieldErrorMsg>
                        <FieldErrorMsg>
                          {flatErrors['contract.startDate.day']}
                        </FieldErrorMsg>
                        <FieldErrorMsg>
                          {flatErrors['contract.startDate.year']}
                        </FieldErrorMsg>
                        <FieldErrorMsg>
                          {flatErrors['contract.endDate.month']}
                        </FieldErrorMsg>
                        <FieldErrorMsg>
                          {flatErrors['contract.endDate.day']}
                        </FieldErrorMsg>
                        <FieldErrorMsg>
                          {flatErrors['contract.endDate.year']}
                        </FieldErrorMsg>
                        <div className="display-flex flex-align-center">
                          <div className="usa-memorable-date">
                            <FieldGroup
                              className="usa-form-group--month"
                              scrollElement="contract.startDate.month"
                            >
                              <Label
                                className="system-intake__label-margin-top-0"
                                htmlFor="IntakeForm-ContractStartMonth"
                              >
                                {t('general:date.month')}
                              </Label>
                              <Field
                                as={DateInputMonth}
                                error={!!flatErrors['contract.startDate.month']}
                                id="IntakeForm-ContractStartMonth"
                                name="contract.startDate.month"
                              />
                            </FieldGroup>
                            <FieldGroup
                              className="usa-form-group--day"
                              scrollElement="contract.startDate.day"
                            >
                              <Label
                                className="system-intake__label-margin-top-0"
                                htmlFor="IntakeForm-ContractStartDay"
                              >
                                {t('general:date.day')}
                              </Label>
                              <Field
                                as={DateInputDay}
                                error={!!flatErrors['contract.startDate.day']}
                                id="IntakeForm-ContractStartDay"
                                name="contract.startDate.day"
                              />
                            </FieldGroup>
                            <FieldGroup
                              className="usa-form-group--year"
                              scrollElement="contract.startDate.year"
                            >
                              <Label
                                className="system-intake__label-margin-top-0"
                                htmlFor="IntakeForm-ContractStartYear"
                              >
                                {t('general:date.year')}
                              </Label>
                              <Field
                                as={DateInputYear}
                                error={!!flatErrors['contract.startDate.year']}
                                id="IntakeForm-ContractStartYear"
                                name="contract.startDate.year"
                              />
                            </FieldGroup>
                          </div>

                          <span className="margin-right-2">{t('to')}</span>
                          <div className="usa-memorable-date">
                            <FieldGroup
                              className="usa-form-group--month"
                              scrollElement="contract.endDate.month"
                            >
                              <Label
                                className="system-intake__label-margin-top-0"
                                htmlFor="IntakeForm-ContractEndMonth"
                              >
                                {t('general:date.month')}
                              </Label>
                              <Field
                                as={DateInputMonth}
                                error={!!flatErrors['contract.endDate.month']}
                                id="IntakeForm-ContractEndMonth"
                                name="contract.endDate.month"
                              />
                            </FieldGroup>
                            <FieldGroup
                              className="usa-form-group--day"
                              scrollElement="contract.endDate.day"
                            >
                              <Label
                                className="system-intake__label-margin-top-0"
                                htmlFor="IntakeForm-ContractEndDay"
                              >
                                {t('general:date.day')}
                              </Label>
                              <Field
                                as={DateInputDay}
                                error={!!flatErrors['contract.endDate.day']}
                                id="IntakeForm-ContractEndDay"
                                name="contract.endDate.day"
                              />
                            </FieldGroup>
                            <FieldGroup
                              className="usa-form-group--year"
                              scrollElement="contract.endDate.year"
                            >
                              <Label
                                className="system-intake__label-margin-top-0"
                                htmlFor="IntakeForm-ContractEndYear"
                              >
                                {t('general:date.year')}
                              </Label>
                              <Field
                                as={DateInputYear}
                                error={!!flatErrors['contract.endDate.year']}
                                id="IntakeForm-ContractEndYear"
                                name="contract.endDate.year"
                              />
                            </FieldGroup>
                          </div>
                        </div>
                      </fieldset>
                    </div>
                  )}
                  <Field
                    as={Radio}
                    checked={values.contract.hasContract === 'IN_PROGRESS'}
                    id="IntakeForm-ContractInProgress"
                    name="contract.hasContract"
                    label={t('contractDetails.hasContractRadio', {
                      context: 'IN_PROGRESS'
                    })}
                    value="IN_PROGRESS"
                    aria-expanded={
                      values.contract.hasContract === 'IN_PROGRESS'
                    }
                    aria-controls="in-progress-branch-wrapper"
                  />
                  {values.contract.hasContract === 'IN_PROGRESS' && (
                    <div
                      id="in-progress-branch-wrapper"
                      className="margin-top-neg-2 margin-left-4 margin-bottom-2"
                    >
                      <FieldGroup
                        scrollElement="contract.contractor"
                        error={!!flatErrors['contract.contractor']}
                      >
                        <Label htmlFor="IntakeForm-Contractor">
                          {t('contractDetails.contractors')}
                        </Label>
                        <FieldErrorMsg>
                          {flatErrors['contract.contractor']}
                        </FieldErrorMsg>
                        <Field
                          as={TextInput}
                          error={!!flatErrors['contract.contractor']}
                          id="IntakeForm-Contractor"
                          maxLength={100}
                          name="contract.contractor"
                        />
                      </FieldGroup>
                      <FieldGroup
                        scrollElement="contract.number"
                        error={!!flatErrors['contract.number']}
                      >
                        <Label
                          className="system-intake__label-margin-top-1"
                          htmlFor="IntakeForm-Number"
                        >
                          {t('fields.contractNumber')}
                        </Label>
                        <FieldErrorMsg>
                          {flatErrors['contract.number']}
                        </FieldErrorMsg>
                        <Field
                          as={TextInput}
                          error={!!flatErrors['contract.number']}
                          id="IntakeForm-Number"
                          maxLength={100}
                          name="contract.number"
                        />
                      </FieldGroup>

                      <fieldset
                        className={classnames(
                          'usa-fieldset',
                          'usa-form-group',
                          'margin-top-4',
                          {
                            'usa-form-group--error':
                              errors.contract &&
                              (errors.contract.startDate ||
                                errors.contract.endDate)
                          }
                        )}
                      >
                        <legend className="usa-label">
                          {t('contractDetails.newPeriodOfPerformance')}
                        </legend>
                        <HelpText className="margin-bottom-1">
                          {t('contractDetails.periodOfPerformanceHelpText')}
                        </HelpText>
                        <FieldErrorMsg>
                          {flatErrors['contract.startDate.month']}
                        </FieldErrorMsg>
                        <FieldErrorMsg>
                          {flatErrors['contract.startDate.day']}
                        </FieldErrorMsg>
                        <FieldErrorMsg>
                          {flatErrors['contract.startDate.year']}
                        </FieldErrorMsg>
                        <FieldErrorMsg>
                          {flatErrors['contract.endDate.month']}
                        </FieldErrorMsg>
                        <FieldErrorMsg>
                          {flatErrors['contract.endDate.day']}
                        </FieldErrorMsg>
                        <FieldErrorMsg>
                          {flatErrors['contract.endDate.year']}
                        </FieldErrorMsg>
                        <div className="display-flex flex-align-center">
                          <div
                            className="usa-memorable-date"
                            data-scroll="contract.startDate.validDate"
                          >
                            <FieldGroup
                              className="usa-form-group--month"
                              scrollElement="contract.startDate.month"
                            >
                              <Label
                                className="system-intake__label-margin-top-0"
                                htmlFor="IntakeForm-ContractStartMonth"
                              >
                                {t('general:date.month')}
                              </Label>
                              <Field
                                as={DateInputMonth}
                                error={
                                  !!flatErrors['contract.startDate.month'] ||
                                  !!flatErrors['contract.startDate.validDate']
                                }
                                id="IntakeForm-ContractStartMonth"
                                name="contract.startDate.month"
                              />
                            </FieldGroup>
                            <FieldGroup
                              className="usa-form-group--day"
                              scrollElement="contract.startDate.day"
                            >
                              <Label
                                className="system-intake__label-margin-top-0"
                                htmlFor="IntakeForm-ContractStartDay"
                              >
                                {t('general:date.day')}
                              </Label>
                              <Field
                                as={DateInputDay}
                                error={
                                  !!flatErrors['contract.startDate.day'] ||
                                  !!flatErrors['contract.startDate.validDate']
                                }
                                id="IntakeForm-ContractStartDay"
                                name="contract.startDate.day"
                              />
                            </FieldGroup>
                            <FieldGroup
                              className="usa-form-group--year"
                              scrollElement="contract.startDate.year"
                            >
                              <Label
                                className="system-intake__label-margin-top-0"
                                htmlFor="IntakeForm-ContractStartYear"
                              >
                                {t('general:date.year')}
                              </Label>
                              <Field
                                as={DateInputYear}
                                error={
                                  !!flatErrors['contract.startDate.year'] ||
                                  !!flatErrors['contract.startDate.validDate']
                                }
                                id="IntakeForm-ContractStartYear"
                                name="contract.startDate.year"
                              />
                            </FieldGroup>
                          </div>

                          <span className="margin-right-2">{t('to')}</span>
                          <div
                            className="usa-memorable-date"
                            data-scroll="contract.endDate.validDate"
                          >
                            <FieldGroup
                              className="usa-form-group--month"
                              scrollElement="contract.endDate.month"
                            >
                              <Label
                                className="system-intake__label-margin-top-0"
                                htmlFor="IntakeForm-ContractEndMonth"
                              >
                                {t('general:date.month')}
                              </Label>
                              <Field
                                as={DateInputMonth}
                                error={
                                  !!flatErrors['contract.endDate.month'] ||
                                  !!flatErrors['contract.endDate.validDate']
                                }
                                id="IntakeForm-ContractEndMonth"
                                name="contract.endDate.month"
                              />
                            </FieldGroup>
                            <FieldGroup
                              className="usa-form-group--day"
                              scrollElement="contract.endDate.day"
                            >
                              <Label
                                className="system-intake__label-margin-top-0"
                                htmlFor="IntakeForm-ContractEndDay"
                              >
                                {t('general:date.day')}
                              </Label>
                              <Field
                                as={DateInputDay}
                                error={
                                  !!flatErrors['contract.endDate.day'] ||
                                  !!flatErrors['contract.endDate.validDate']
                                }
                                id="IntakeForm-ContractEndDay"
                                name="contract.endDate.day"
                              />
                            </FieldGroup>
                            <FieldGroup
                              className="usa-form-group--year"
                              scrollElement="contract.endDate.year"
                            >
                              <Label
                                className="system-intake__label-margin-top-0"
                                htmlFor="IntakeForm-ContractEndYear"
                              >
                                {t('general:date.year')}
                              </Label>
                              <Field
                                as={DateInputYear}
                                error={
                                  !!flatErrors['contract.endDate.year'] ||
                                  !!flatErrors['contract.endDate.validDate']
                                }
                                id="IntakeForm-ContractEndYear"
                                name="contract.endDate.year"
                              />
                            </FieldGroup>
                          </div>
                        </div>
                      </fieldset>
                    </div>
                  )}
                  <Field
                    as={Radio}
                    checked={values.contract.hasContract === 'NOT_STARTED'}
                    id="IntakeForm-ContractNotStarted"
                    name="contract.hasContract"
                    label={t('contractDetails.hasContractRadio', {
                      context: 'NOT_STARTED'
                    })}
                    value="NOT_STARTED"
                    onChange={() => {
                      setFieldValue('contract.hasContract', 'NOT_STARTED');
                      setFieldValue('contract.contractor', '');
                      setFieldValue('contract.number', '');
                      setFieldValue('contract.startDate.month', '');
                      setFieldValue('contract.startDate.day', '');
                      setFieldValue('contract.startDate.year', '');
                      setFieldValue('contract.endDate.month', '');
                      setFieldValue('contract.endDate.day', '');
                      setFieldValue('contract.endDate.year', '');
                    }}
                  />
                  <Field
                    as={Radio}
                    checked={values.contract.hasContract === 'NOT_NEEDED'}
                    id="IntakeForm-ContractNotNeeded"
                    name="contract.hasContract"
                    label={t('contractDetails.hasContractRadio', {
                      context: 'NOT_NEEDED'
                    })}
                    value="NOT_NEEDED"
                    onChange={() => {
                      setFieldValue('contract.hasContract', 'NOT_NEEDED');
                      setFieldValue('contract.contractor', '');
                      setFieldValue('contract.number', '');
                      setFieldValue('contract.startDate.month', '');
                      setFieldValue('contract.startDate.day', '');
                      setFieldValue('contract.startDate.year', '');
                      setFieldValue('contract.endDate.month', '');
                      setFieldValue('contract.endDate.day', '');
                      setFieldValue('contract.endDate.year', '');
                    }}
                  />
                </fieldset>
              </FieldGroup>

              <Button
                type="button"
                outline
                onClick={() => {
                  formikProps.setErrors({});
                  mutate({
                    variables: {
                      input: formatContractDetailsPayload(values)
                    }
                  }).then(res => {
                    if (!res.errors) {
                      history.push('request-details');
                    }
                  });
                }}
              >
                {t('Back')}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  formikProps.validateForm().then(err => {
                    if (Object.keys(err).length === 0) {
                      mutate({
                        variables: {
                          input: formatContractDetailsPayload(values)
                        }
                      }).then(res => {
                        if (!res.errors) {
                          history.push('documents');
                        }
                      });
                    } else {
                      window.scrollTo(0, 0);
                    }
                  });
                }}
              >
                {t('Next')}
              </Button>
              <IconButton
                type="button"
                unstyled
                onClick={() => {
                  mutate({
                    variables: {
                      input: formatContractDetailsPayload(values)
                    }
                  }).then(res => {
                    if (!res.errors) {
                      history.push(saveExitLink);
                    }
                  });
                }}
                className="margin-y-3"
                icon={<IconNavigateBefore className="margin-right-0" />}
                iconPosition="before"
              >
                {t('Save & Exit')}
              </IconButton>
            </Form>
            <AutoSave
              values={values}
              onSave={() => {
                onSubmit(formikRef?.current?.values);
              }}
              debounceDelay={3000}
            />
            <PageNumber currentPage={3} totalPages={5} />
          </>
        );
      }}
    </Formik>
  );
};

export default ContractDetails;
