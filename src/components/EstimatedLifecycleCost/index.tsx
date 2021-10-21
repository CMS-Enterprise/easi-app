import React from 'react';
import { Checkbox, Label, TextInput } from '@trussworks/react-uswds';
import { Field, FieldArray } from 'formik';
import { DateTime } from 'luxon';

import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import { LifecycleCosts } from 'types/estimatedLifecycle';
import { getFiscalYear } from 'utils/date';
import formatDollars from 'utils/formatDollars';

import './index.scss';

type PhaseProps = {
  formikKey: string;
  year: number;
  fiscalYear: number;
  values: LifecycleCosts;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  errors: any;
};

const Phase = ({
  formikKey,
  year,
  fiscalYear,
  values,
  setFieldValue,
  errors = {}
}: PhaseProps) => {
  return (
    <FieldArray name={`${formikKey}.year${year}`}>
      {() => (
        <FieldGroup
          className="est-lifecycle-cost__phase-costs"
          error={Object.keys(errors).length > 0}
          scrollElement={`${formikKey}.year${year}`}
        >
          <div className="est-lifecycle-cost__phase-fieldset">
            <fieldset
              className="usa-fieldset"
              aria-describedby="BusinessCase-EstimatedLifecycleCostHelp"
            >
              <FieldErrorMsg>
                {typeof errors === 'string' ? errors : ''}
              </FieldErrorMsg>
              <legend className="usa-label">
                {`Fiscal year ${fiscalYear} phase costs`}
              </legend>

              <Field
                as={Checkbox}
                checked={values.development.isPresent}
                id={`BusinessCase-${formikKey}.Year${year}.development.isPresent`}
                name={`${formikKey}.year${year}.development.isPresent`}
                label="Development"
                value="Development"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFieldValue(
                    `${formikKey}.year${year}.development.isPresent`,
                    e.target.checked
                  );
                }}
              />
              {values.development.isPresent && (
                <FieldGroup
                  className="margin-left-4 margin-bottom-2"
                  scrollElement={`${formikKey}.year${year}.development.cost`}
                >
                  <Label
                    htmlFor={`BusinessCase-${formikKey}.Year${year}.development.cost`}
                    aria-label={`Enter year ${fiscalYear} development cost`}
                  >
                    Development costs
                  </Label>
                  <FieldErrorMsg>{errors?.development?.cost}</FieldErrorMsg>
                  <Field
                    as={TextInput}
                    error={!!errors?.development?.cost}
                    className="width-card-lg"
                    id={`BusinessCase-${formikKey}.Year${year}.development.cost`}
                    name={`${formikKey}.year${year}.development.cost`}
                    maxLength={10}
                    match={/^[0-9\b]+$/}
                    aria-describedby="DevelopmentCostsDefinition"
                  />
                </FieldGroup>
              )}

              <Field
                as={Checkbox}
                checked={values.operationsMaintenance.isPresent}
                id={`BusinessCase-${formikKey}.Year${year}.operationsMaintenance.isPresent`}
                name={`${formikKey}.year${year}.operationsMaintenance.isPresent`}
                label="Operations and Maintenance"
                value="Operations and Maintenance"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFieldValue(
                    `${formikKey}.year${year}.operationsMaintenance.isPresent`,
                    e.target.checked
                  );
                }}
              />
              {values.operationsMaintenance.isPresent && (
                <FieldGroup
                  className="margin-left-4 margin-bottom-2"
                  scrollElement={`${formikKey}.year${year}.operationsMaintenance.cost`}
                >
                  <Label
                    htmlFor={`BusinessCase-${formikKey}.Year${year}.operationsMaintenance.cost`}
                    aria-label={`Enter year ${fiscalYear} operations and maintenance cost`}
                  >
                    Operations and Maintenance costs
                  </Label>
                  <FieldErrorMsg>
                    {errors?.operationsMaintenance?.cost}
                  </FieldErrorMsg>
                  <Field
                    as={TextInput}
                    error={!!errors?.operationsMaintenance?.cost}
                    className="width-card-lg"
                    id={`BusinessCase-${formikKey}.Year${year}.operationsMaintenance.cost`}
                    name={`${formikKey}.year${year}.operationsMaintenance.cost`}
                    maxLength={10}
                    match={/^[0-9\b]+$/}
                    aria-describedby="OperationsMaintenanceCostsDefinition"
                  />
                </FieldGroup>
              )}

              <Field
                as={Checkbox}
                checked={values.other.isPresent}
                id={`BusinessCase-${formikKey}.Year${year}.other.isPresent`}
                name={`${formikKey}.year${year}.other.isPresent`}
                label="Other"
                value="Other"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFieldValue(
                    `${formikKey}.year${year}.other.isPresent`,
                    e.target.checked
                  );
                }}
              />
              {values.other.isPresent && (
                <FieldGroup
                  className="margin-left-4 margin-bottom-2"
                  scrollElement={`${formikKey}.year${year}.other.cost`}
                >
                  <Label
                    htmlFor={`BusinessCase-${formikKey}.Year${year}.other.cost`}
                    aria-label={`Enter year ${fiscalYear} other cost`}
                  >
                    Other costs
                  </Label>
                  <FieldErrorMsg>{errors?.other?.cost}</FieldErrorMsg>
                  <Field
                    as={TextInput}
                    error={!!errors?.other?.cost}
                    className="width-card-lg"
                    id={`BusinessCase-${formikKey}.Year${year}.other.cost`}
                    name={`${formikKey}.year${year}.other.cost`}
                    maxLength={10}
                    match={/^[0-9\b]+$/}
                    aria-describedby="OtherCostsDefinition"
                  />
                </FieldGroup>
              )}
            </fieldset>
          </div>
        </FieldGroup>
      )}
    </FieldArray>
  );
};

type EstimatedLifecycleCostProps = {
  formikKey: string;
  years: {
    year1: LifecycleCosts;
    year2: LifecycleCosts;
    year3: LifecycleCosts;
    year4: LifecycleCosts;
    year5: LifecycleCosts;
  };
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  errors: any;
  businessCaseCreatedAt?: string;
};
const EstimatedLifecycleCost = ({
  formikKey,
  years,
  setFieldValue,
  errors = {},
  businessCaseCreatedAt = ''
}: EstimatedLifecycleCostProps) => {
  const sumCostinYear = (phases: LifecycleCosts) => {
    const { development, operationsMaintenance, other } = phases;
    return (
      (development.isPresent ? parseFloat(development.cost || '0') : 0) +
      (operationsMaintenance.isPresent
        ? parseFloat(operationsMaintenance.cost || '0')
        : 0) +
      (other.isPresent ? parseFloat(other.cost || '0') : 0)
    );
  };
  const year1Cost = sumCostinYear(years.year1);
  const year2Cost = sumCostinYear(years.year2);
  const year3Cost = sumCostinYear(years.year3);
  const year4Cost = sumCostinYear(years.year4);
  const year5Cost = sumCostinYear(years.year5);

  const fiscalYear = getFiscalYear(DateTime.fromISO(businessCaseCreatedAt));

  return (
    <div className="est-lifecycle-cost grid-row">
      <div className="tablet:grid-col-5">
        <div className="est-lifecycle-cost__help-box">
          <h3 className="est-lifecycle-cost__help-title text-bold">
            What do phases mean?
          </h3>
          <dl className="margin-bottom-105">
            <dt className="margin-bottom-1 text-bold">Development</dt>
            <dd
              id="DevelopmentCostsDefinition"
              className="margin-bottom-2 margin-left-0 line-height-body-3"
            >
              These are costs related to current development that is
              pre-production.
            </dd>
            <dt className="margin-bottom-1 text-bold">
              Operations and Maintenance
            </dt>
            <dd
              id="OperationsMaintenanceCostsDefinition"
              className="margin-bottom-2 margin-left-0 line-height-body-3"
            >
              These are costs related to running and upkeep post-production.
            </dd>
            <dt className="margin-bottom-1 text-bold">Other</dt>
            <dd
              id="OtherCostsDefinition"
              className="margin-bottom-2 margin-left-0 line-height-body-3"
            >
              This can be Non-IT costs like education, licenses etc.
            </dd>
          </dl>
        </div>
      </div>
      <div className="tablet:grid-col-7">
        <Phase
          formikKey={formikKey}
          year={1}
          fiscalYear={fiscalYear}
          values={years.year1}
          setFieldValue={setFieldValue}
          errors={errors.year1}
        />
        <Phase
          formikKey={formikKey}
          year={2}
          fiscalYear={fiscalYear + 1}
          values={years.year2}
          setFieldValue={setFieldValue}
          errors={errors.year2}
        />
        <Phase
          formikKey={formikKey}
          year={3}
          fiscalYear={fiscalYear + 2}
          values={years.year3}
          setFieldValue={setFieldValue}
          errors={errors.year3}
        />
        <Phase
          formikKey={formikKey}
          year={4}
          fiscalYear={fiscalYear + 3}
          values={years.year4}
          setFieldValue={setFieldValue}
          errors={errors.year4}
        />
        <Phase
          formikKey={formikKey}
          year={5}
          fiscalYear={fiscalYear + 4}
          values={years.year5}
          setFieldValue={setFieldValue}
          errors={errors.year5}
        />
        <div className="est-lifecycle-cost__total bg-base-lightest overflow-auto margin-top-3 padding-x-2">
          <DescriptionList title="System total cost">
            <DescriptionTerm term="System total cost" />
            <DescriptionDefinition
              definition={formatDollars(
                year1Cost + year2Cost + year3Cost + year4Cost + year5Cost
              )}
            />
          </DescriptionList>
        </div>
      </div>
    </div>
  );
};

export default EstimatedLifecycleCost;
