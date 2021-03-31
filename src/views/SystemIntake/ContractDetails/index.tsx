import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Link } from '@trussworks/react-uswds';
import classnames from 'classnames';
import { Field, Form, Formik, FormikProps } from 'formik';

import MandatoryFieldsAlert from 'components/MandatoryFieldsAlert';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import {
  DateInputDay,
  DateInputMonth,
  DateInputYear
} from 'components/shared/DateInput';
import { DropdownField, DropdownItem } from 'components/shared/DropdownField';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import { RadioField } from 'components/shared/RadioField';
import TextAreaField from 'components/shared/TextAreaField';
import TextField from 'components/shared/TextField';
import fundingSources from 'constants/enums/fundingSources';
import processStages from 'constants/enums/processStages';
import { yesNoMap } from 'data/common';
import { ContractDetailsForm, SystemIntakeForm } from 'types/systemIntake';
import flattenErrors from 'utils/flattenErrors';
import SystemIntakeValidationSchema from 'validations/systemIntakeSchema';

type ContractDetailsProps = {
  formikRef: any;
  systemIntake: SystemIntakeForm;
  dispatchSave: () => void;
};

const ContractDetails = ({
  formikRef,
  systemIntake,
  dispatchSave
}: ContractDetailsProps) => {
  const history = useHistory();

  const initialValues: ContractDetailsForm = {
    currentStage: systemIntake.currentStage,
    fundingSource: systemIntake.fundingSource,
    costs: systemIntake.costs,
    contract: systemIntake.contract
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

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={dispatchSave}
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
            <PageHeading>Contract details</PageHeading>
            <div className="tablet:grid-col-9 margin-bottom-7">
              <div className="tablet:grid-col-6">
                <MandatoryFieldsAlert />
              </div>
              <Form>
                <FieldGroup
                  className="margin-bottom-4"
                  scrollElement="currentStage"
                  error={!!flatErrors.currentStage}
                >
                  <Label htmlFor="IntakeForm-CurrentStage">
                    Where are you in the process?
                  </Label>
                  <HelpText id="IntakeForm-ProcessHelp" className="margin-y-1">
                    This helps the governance team provide the right type of
                    guidance for your request
                  </HelpText>
                  <FieldErrorMsg>{flatErrors.CurrentStage}</FieldErrorMsg>
                  <Field
                    as={DropdownField}
                    error={!!flatErrors.currentStage}
                    id="IntakeForm-CurrentStage"
                    name="currentStage"
                    aria-describedby="IntakeForm-ProcessHelp"
                  >
                    <Field
                      as={DropdownItem}
                      name="Select an option"
                      value=""
                      disabled
                    />
                    {processStages.map(stage => (
                      <Field
                        as={DropdownItem}
                        key={`ProcessStageComponent-${stage.value}`}
                        name={stage.name}
                        value={stage.name}
                      />
                    ))}
                  </Field>
                </FieldGroup>

                <FieldGroup
                  scrollElement="fundingSource.isFunded"
                  error={!!flatErrors['fundingSource.isFunded']}
                >
                  <fieldset className="usa-fieldset margin-top-4">
                    <legend className="usa-label margin-bottom-1">
                      Will this project be funded out of an existing funding
                      source?
                    </legend>
                    <HelpText
                      id="Intake-Form-ExistingFundingHelp"
                      className="margin-bottom-1"
                    >
                      If you are unsure, please get in touch with your
                      Contracting Officer Representative
                    </HelpText>
                    <FieldErrorMsg>
                      {flatErrors['fundingSource.isFunded']}
                    </FieldErrorMsg>
                    <Field
                      as={RadioField}
                      checked={values.fundingSource.isFunded === true}
                      id="IntakeForm-HasFundingSourceYes"
                      name="fundingSource.isFunded"
                      label="Yes"
                      onChange={() => {
                        setFieldValue('fundingSource.isFunded', true);
                      }}
                      aria-describedby="Intake-Form-ExistingFundingHelp"
                      value
                    />
                    {values.fundingSource.isFunded && (
                      <div className="margin-top-neg-2 margin-left-4 margin-bottom-1">
                        <FieldGroup
                          scrollElement="fundingSource.source"
                          error={!!flatErrors['fundingSource.source']}
                        >
                          <Label htmlFor="IntakeForm-FundingSource">
                            Funding Source
                          </Label>
                          <FieldErrorMsg>
                            {flatErrors['fundingSource.source']}
                          </FieldErrorMsg>
                          <Field
                            as={DropdownField}
                            error={!!flatErrors['fundingSource.source']}
                            id="IntakeForm-FundingSource"
                            name="fundingSource.source"
                            // manual onChange to catch case where user selects 'Unknown' funding source
                            // TODO: I feel like there should be a better option for this use case
                            //       but I could not find anything cleaner then this solution
                            onChange={(e: any) => {
                              formikProps.handleChange(e);

                              // If funding source is 'Unknown' set funding number to 'N/A' (funding number
                              // field is disabled in this case), for any other funding source it is set
                              // to empty string and the user can enter funding number normally
                              setFieldValue(
                                'fundingSource.fundingNumber',
                                e.target.value === 'Unknown' ? 'N/A' : ''
                              );
                            }}
                          >
                            <Field
                              as={DropdownItem}
                              name="Select an option"
                              value=""
                              disabled
                            />
                            {fundingSources.map(source => (
                              <Field
                                as={DropdownItem}
                                key={source.split(' ').join('-')}
                                name={source}
                                value={source}
                              />
                            ))}
                          </Field>
                        </FieldGroup>
                        <FieldGroup
                          className="margin-top-neg-2"
                          scrollElement="fundingSource.fundingNumber"
                          error={!!flatErrors['fundingSource.fundingNumber']}
                        >
                          <Label htmlFor="IntakeForm-FundingNumber">
                            Funding Number
                          </Label>
                          <HelpText
                            id="IntakeForm-FundingNumberHelp"
                            className="margin-y-1"
                          >
                            <Link
                              aria-label="Open 'CMS Operating Plan' in a new tab"
                              href="https://cmsintranet.share.cms.gov/JT/Pages/Budget.aspx"
                              target="_blank"
                              rel="noopener noreferrer"
                              variant="external"
                            >
                              You can find your funding number in the CMS
                              Operating Plan page (opens in a new tab)
                            </Link>
                          </HelpText>
                          <FieldErrorMsg>
                            {flatErrors['fundingSource.fundingNumber']}
                          </FieldErrorMsg>
                          <Field
                            className="width-card-lg"
                            as={TextField}
                            error={!!flatErrors['fundingSource.fundingNumber']}
                            id="IntakeForm-FundingNumber"
                            maxLength={6}
                            name="fundingSource.fundingNumber"
                            aria-describedby="IntakeForm-FundingNumberHelp"
                            // If funding source is 'Unknown' disable funding number input and set
                            // placeholder to 'N/A' (actual field value is set to 'N/A' as well)
                            disabled={values.fundingSource.source === 'Unknown'}
                            placeholder={
                              values.fundingSource.source === 'Unknown'
                                ? 'N/A'
                                : ''
                            }
                          />
                        </FieldGroup>
                      </div>
                    )}
                    <Field
                      as={RadioField}
                      checked={values.fundingSource.isFunded === false}
                      id="IntakeForm-HasFundingSourceNo"
                      name="fundingSource.isFunded"
                      label="No"
                      onChange={() => {
                        setFieldValue('fundingSource.isFunded', false);
                        setFieldValue('fundingSource.fundingNumber', '');
                        setFieldValue('fundingSource.source', '');
                      }}
                      value={false}
                    />
                  </fieldset>
                </FieldGroup>

                <FieldGroup
                  scrollElement="conts.isExpectingIncrease"
                  error={!!flatErrors['costs.isExpectingIncrease']}
                >
                  <fieldset className="usa-fieldset margin-top-4">
                    <legend className="usa-label margin-bottom-1">
                      Do you expect costs for this request to increase?
                    </legend>
                    <HelpText
                      id="IntakeForm-IncreasedCostsHelp"
                      className="margin-bottom-1"
                    >
                      This information helps the team decide on the right
                      approval process for this request
                    </HelpText>
                    <FieldErrorMsg>
                      {flatErrors['costs.isExpectingIncrease']}
                    </FieldErrorMsg>
                    <Field
                      as={RadioField}
                      checked={values.costs.isExpectingIncrease === 'YES'}
                      id="IntakeForm-CostsExpectingIncreaseYes"
                      name="costs.isExpectingIncrease"
                      label={yesNoMap.YES}
                      value="YES"
                      aria-describedby="IntakeForm-IncreasedCostsHelp"
                    />
                    {values.costs.isExpectingIncrease === 'YES' && (
                      <div className="width-mobile margin-top-neg-2 margin-left-4 margin-bottom-1">
                        <FieldGroup
                          scrollElement="costs.expectedIncreaseAmount"
                          error={!!flatErrors['costs.expectedIncreaseAmount']}
                        >
                          <Label htmlFor="IntakeForm-CostsExpectedIncrease">
                            Approximately how much do you expect the cost to
                            increase?
                          </Label>
                          <FieldErrorMsg>
                            {flatErrors['costs.expectedIncreaseAmount']}
                          </FieldErrorMsg>
                          <Field
                            as={TextAreaField}
                            className="system-intake__cost-amount"
                            error={!!flatErrors['costs.expectedIncreaseAmount']}
                            id="IntakeForm-CostsExpectedIncrease"
                            name="costs.expectedIncreaseAmount"
                            maxLength={100}
                          />
                        </FieldGroup>
                      </div>
                    )}
                    <Field
                      as={RadioField}
                      checked={values.costs.isExpectingIncrease === 'NO'}
                      id="IntakeForm-CostsExpectingIncreaseNo"
                      name="costs.isExpectingIncrease"
                      label={yesNoMap.NO}
                      value="NO"
                      onChange={() => {
                        setFieldValue('costs.isExpectingIncrease', 'NO');
                        setFieldValue('costs.expectedIncreaseAmount', '');
                      }}
                    />
                    <Field
                      as={RadioField}
                      checked={values.costs.isExpectingIncrease === 'NOT_SURE'}
                      id="IntakeForm-CostsExpectingIncreaseNotSure"
                      name="costs.isExpectingIncrease"
                      label={yesNoMap.NOT_SURE}
                      value="NOT_SURE"
                      onChange={() => {
                        setFieldValue('costs.isExpectingIncrease', 'NOT_SURE');
                        setFieldValue('costs.expectedIncreaseAmount', '');
                      }}
                    />
                  </fieldset>
                </FieldGroup>

                <FieldGroup
                  scrollElement="contract.hasContract"
                  error={!!flatErrors['contract.hasContract']}
                >
                  <fieldset className="usa-fieldset margin-top-4">
                    <legend className="usa-label margin-bottom-1">
                      Do you already have a contract in place to support this
                      effort?
                    </legend>
                    <HelpText
                      id="IntakeForm-HasContractHelp"
                      className="margin-bottom-1"
                    >
                      This information helps the Office of Acquisition and
                      Grants Management (OAGM) track work
                    </HelpText>
                    <FieldErrorMsg>
                      {flatErrors['contract.hasContract']}
                    </FieldErrorMsg>
                    <Field
                      as={RadioField}
                      checked={values.contract.hasContract === 'HAVE_CONTRACT'}
                      id="IntakeForm-ContractHaveContract"
                      name="contract.hasContract"
                      label="I already have a contract/InterAgency Agreement (IAA) in place"
                      value="HAVE_CONTRACT"
                      aria-describedby="IntakeForm-HasContractHelp"
                    />
                    {values.contract.hasContract === 'HAVE_CONTRACT' && (
                      <div className="margin-top-neg-2 margin-left-4 margin-bottom-2">
                        <FieldGroup
                          scrollElement="contract.contractor"
                          error={!!flatErrors['contract.contractor']}
                        >
                          <Label htmlFor="IntakeForm-Contractor">
                            Contractor(s)
                          </Label>
                          <FieldErrorMsg>
                            {flatErrors['contract.contractor']}
                          </FieldErrorMsg>
                          <Field
                            as={TextField}
                            error={!!flatErrors['contract.contractor']}
                            id="IntakeForm-Contractor"
                            maxLength={100}
                            name="contract.contractor"
                          />
                        </FieldGroup>
                        <FieldGroup
                          scrollElement="contract.vehicle"
                          error={!!flatErrors['contract.vehicle']}
                        >
                          <Label
                            className="system-intake__label-margin-top-1"
                            htmlFor="IntakeForm-Vehicle"
                          >
                            Contract vehicle
                          </Label>
                          <FieldErrorMsg>
                            {flatErrors['contract.vehicle']}
                          </FieldErrorMsg>
                          <Field
                            as={TextField}
                            error={!!flatErrors['contract.vehicle']}
                            id="IntakeForm-Vehicle"
                            maxLength={100}
                            name="contract.vehicle"
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
                            Period of performance
                          </legend>
                          <HelpText className="margin-bottom-1">
                            For example: 4/10/2020
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
                                  Month
                                </Label>
                                <Field
                                  as={DateInputMonth}
                                  error={
                                    !!flatErrors['contract.startDate.month']
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
                                  Day
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
                                  Year
                                </Label>
                                <Field
                                  as={DateInputYear}
                                  error={
                                    !!flatErrors['contract.startDate.year']
                                  }
                                  id="IntakeForm-ContractStartYear"
                                  name="contract.startDate.year"
                                />
                              </FieldGroup>
                            </div>

                            <span className="margin-right-2">to</span>
                            <div className="usa-memorable-date">
                              <FieldGroup
                                className="usa-form-group--month"
                                scrollElement="contract.endDate.month"
                              >
                                <Label
                                  className="system-intake__label-margin-top-0"
                                  htmlFor="IntakeForm-ContractEndMonth"
                                >
                                  Month
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
                                  Day
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
                                  Year
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
                      as={RadioField}
                      checked={values.contract.hasContract === 'IN_PROGRESS'}
                      id="IntakeForm-ContractInProgress"
                      name="contract.hasContract"
                      label="I am currently working on my OAGM Acquisition Plan/IAA documents"
                      value="IN_PROGRESS"
                    />
                    {values.contract.hasContract === 'IN_PROGRESS' && (
                      <div className="margin-top-neg-2 margin-left-4 margin-bottom-2">
                        <FieldGroup
                          scrollElement="contract.contractor"
                          error={!!flatErrors['contract.contractor']}
                        >
                          <Label htmlFor="IntakeForm-Contractor">
                            Contractor(s)
                          </Label>
                          <FieldErrorMsg>
                            {flatErrors['contract.contractor']}
                          </FieldErrorMsg>
                          <Field
                            as={TextField}
                            error={!!flatErrors['contract.contractor']}
                            id="IntakeForm-Contractor"
                            maxLength={100}
                            name="contract.contractor"
                          />
                        </FieldGroup>
                        <FieldGroup
                          scrollElement="contract.vehicle"
                          error={!!flatErrors['contract.vehicle']}
                        >
                          <Label
                            className="system-intake__label-margin-top-1"
                            htmlFor="IntakeForm-Vehicle"
                          >
                            Contract vehicle
                          </Label>
                          <FieldErrorMsg>
                            {flatErrors['contract.vehicle']}
                          </FieldErrorMsg>
                          <Field
                            as={TextField}
                            error={!!flatErrors['contract.vehicle']}
                            id="IntakeForm-Vehicle"
                            maxLength={100}
                            name="contract.vehicle"
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
                            Estimated period of performance
                          </legend>
                          <HelpText className="margin-bottom-1">
                            For example: 4/10/2020
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
                                  Month
                                </Label>
                                <Field
                                  as={DateInputMonth}
                                  error={
                                    !!flatErrors['contract.startDate.month']
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
                                  Day
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
                                  Year
                                </Label>
                                <Field
                                  as={DateInputYear}
                                  error={
                                    !!flatErrors['contract.startDate.year']
                                  }
                                  id="IntakeForm-ContractStartYear"
                                  name="contract.startDate.year"
                                />
                              </FieldGroup>
                            </div>

                            <span className="margin-right-2">to</span>
                            <div className="usa-memorable-date">
                              <FieldGroup
                                className="usa-form-group--month"
                                scrollElement="contract.endDate.month"
                              >
                                <Label
                                  className="system-intake__label-margin-top-0"
                                  htmlFor="IntakeForm-ContractEndMonth"
                                >
                                  Month
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
                                  Day
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
                                  Year
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
                      as={RadioField}
                      checked={values.contract.hasContract === 'NOT_STARTED'}
                      id="IntakeForm-ContractNotStarted"
                      name="contract.hasContract"
                      label="I haven't started acquisition planning yet"
                      value="NOT_STARTED"
                      onChange={() => {
                        setFieldValue('contract.hasContract', 'NOT_STARTED');
                        setFieldValue('contract.contractor', '');
                        setFieldValue('contract.vehicle', '');
                        setFieldValue('contract.startDate.month', '');
                        setFieldValue('contract.startDate.year', '');
                        setFieldValue('contract.endDate.month', '');
                        setFieldValue('contract.endDate.year', '');
                      }}
                    />
                    <Field
                      as={RadioField}
                      checked={values.contract.hasContract === 'NOT_NEEDED'}
                      id="IntakeForm-ContractNotNeeded"
                      name="contract.hasContract"
                      label="I don't anticipate needing contractor support"
                      value="NOT_NEEDED"
                      onChange={() => {
                        setFieldValue('contract.hasContract', 'NOT_NEEDED');
                        setFieldValue('contract.contractor', '');
                        setFieldValue('contract.vehicle', '');
                        setFieldValue('contract.startDate.month', '');
                        setFieldValue('contract.startDate.year', '');
                        setFieldValue('contract.endDate.month', '');
                        setFieldValue('contract.endDate.year', '');
                      }}
                    />
                  </fieldset>
                </FieldGroup>

                <Button
                  type="button"
                  outline
                  onClick={() => {
                    dispatchSave();
                    formikProps.setErrors({});
                    const newUrl = 'request-details';
                    history.push(newUrl);
                  }}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    formikProps.validateForm().then(err => {
                      if (Object.keys(err).length === 0) {
                        dispatchSave();
                        const newUrl = 'review';
                        history.push(newUrl);
                      } else {
                        window.scrollTo(0, 0);
                      }
                    });
                  }}
                >
                  Next
                </Button>
                <div className="margin-y-3">
                  <Button
                    type="button"
                    unstyled
                    onClick={() => {
                      dispatchSave();
                      history.push(saveExitLink);
                    }}
                  >
                    <span>
                      <i className="fa fa-angle-left" /> Save & Exit
                    </span>
                  </Button>
                </div>
              </Form>
            </div>
            <AutoSave
              values={values}
              onSave={dispatchSave}
              debounceDelay={1000 * 30}
            />
            <PageNumber currentPage={3} totalPages={3} />
          </>
        );
      }}
    </Formik>
  );
};

export default ContractDetails;
