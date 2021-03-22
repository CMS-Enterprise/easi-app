import React from 'react';
import classnames from 'classnames';
import { Field, FieldArray } from 'formik';

import CheckboxField from 'components/shared/CheckboxField/';
import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import Label from 'components/shared/Label';
import TextField from 'components/shared/TextField';
import { LifecycleCosts } from 'types/estimatedLifecycle';
import formatDollars from 'utils/formatDollars';

import './index.scss';

type PhaseProps = {
  formikKey: string;
  year: number;
  values: LifecycleCosts;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  errors: any;
};

const Phase = ({
  formikKey,
  year,
  values,
  setFieldValue,
  errors = {}
}: PhaseProps) => {
  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    phase: string
  ) => {
    setFieldValue(
      `${formikKey}.year${year}.${phase}.isPresent`,
      e.target.checked
    );
  };

  return (
    <FieldArray name={`${formikKey}.year${year}`}>
      {() => (
        <div className="est-lifecycle-cost__phase-cost-wrapper">
          <FieldGroup
            error={Object.keys(errors).length > 0}
            scrollElement={`${formikKey}.year${year}`}
          >
            <div className="margin-right-2">
              <fieldset
                className="usa-fieldset"
                aria-describedby="BusinessCase-EstimatedLifecycleCostHelp"
              >
                <div>
                  <FieldErrorMsg>
                    {typeof errors === 'string' ? errors : ''}
                  </FieldErrorMsg>
                  <legend
                    className={classnames('usa-label', 'margin-bottom-1')}
                    aria-label={`Year ${year}`}
                  >
                    Phase
                  </legend>

                  <Field
                    as={CheckboxField}
                    checked={values.development.isPresent}
                    id={`BusinessCase-${formikKey}.Year${year}.development.isPresent`}
                    name={`${formikKey}.year${year}.development.isPresent`}
                    label="Development"
                    value="Development"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleCheckboxChange(e, 'development');
                    }}
                  />
                  {values.development.isPresent && (
                    <FieldGroup
                      className="margin-left-4 margin-bottom-2"
                      scrollElement={`${formikKey}.year${year}.development.cost`}
                    >
                      <Label
                        htmlFor={`BusinessCase-${formikKey}.Year${year}.development.cost`}
                        aria-label={`Enter year ${year} development cost`}
                      >
                        Cost
                      </Label>
                      <FieldErrorMsg>{errors?.development?.cost}</FieldErrorMsg>
                      <Field
                        as={TextField}
                        error={!!errors?.development?.cost}
                        className="width-card-lg"
                        id={`BusinessCase-${formikKey}.Year${year}.development.cost`}
                        name={`${formikKey}.year${year}.development.cost`}
                        maxLength={10}
                        match={/^[0-9\b]+$/}
                      />
                    </FieldGroup>
                  )}

                  <Field
                    as={CheckboxField}
                    checked={values.operationsMaintenance.isPresent}
                    id={`BusinessCase-${formikKey}.Year${year}.operationsMaintenance.isPresent`}
                    name={`${formikKey}.year${year}.operationsMaintenance.isPresent`}
                    label="Operations and Maintenance"
                    value="Operations and Maintenance"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleCheckboxChange(e, 'operationsMaintenance');
                    }}
                  />
                  {values.operationsMaintenance.isPresent && (
                    <FieldGroup
                      className="margin-left-4 margin-bottom-2"
                      scrollElement={`${formikKey}.year${year}.operationsMaintenance.cost`}
                    >
                      <Label
                        htmlFor={`BusinessCase-${formikKey}.Year${year}.operationsMaintenance.cost`}
                        aria-label={`Enter year ${year} operations and maintenance cost`}
                      >
                        Cost
                      </Label>
                      <FieldErrorMsg>
                        {errors?.operationsMaintenance?.cost}
                      </FieldErrorMsg>
                      <Field
                        as={TextField}
                        error={!!errors?.operationsMaintenance?.cost}
                        className="width-card-lg"
                        id={`BusinessCase-${formikKey}.Year${year}.operationsMaintenance.cost`}
                        name={`${formikKey}.year${year}.operationsMaintenance.cost`}
                        maxLength={10}
                        match={/^[0-9\b]+$/}
                      />
                    </FieldGroup>
                  )}

                  <Field
                    as={CheckboxField}
                    checked={values.other.isPresent}
                    id={`BusinessCase-${formikKey}.Year${year}.other.isPresent`}
                    name={`${formikKey}.year${year}.other.isPresent`}
                    label="Other"
                    value="Other"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleCheckboxChange(e, 'other');
                    }}
                  />
                  {values.other.isPresent && (
                    <FieldGroup
                      className="margin-left-4 margin-bottom-2"
                      scrollElement={`${formikKey}.year${year}.other.cost`}
                    >
                      <Label
                        htmlFor={`BusinessCase-${formikKey}.Year${year}.other.cost`}
                        aria-label={`Enter year ${year} other cost`}
                      >
                        Cost
                      </Label>
                      <FieldErrorMsg>{errors?.other?.cost}</FieldErrorMsg>
                      <Field
                        as={TextField}
                        error={!!errors?.other?.cost}
                        className="width-card-lg"
                        id={`BusinessCase-${formikKey}.Year${year}.other.cost`}
                        name={`${formikKey}.year${year}.other.cost`}
                        maxLength={10}
                        match={/^[0-9\b]+$/}
                      />
                    </FieldGroup>
                  )}
                </div>
              </fieldset>
            </div>
          </FieldGroup>
        </div>
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
};
const EstimatedLifecycleCost = ({
  formikKey,
  years,
  setFieldValue,
  errors = {}
}: EstimatedLifecycleCostProps) => {
  const sumCostinYear = (phases: LifecycleCosts) => {
    return (
      parseFloat(phases.development.cost || '0') +
      parseFloat(phases.operationsMaintenance.cost || '0') +
      parseFloat(phases.other.cost || '0')
    );
  };
  const year1Cost = sumCostinYear(years.year1);
  const year2Cost = sumCostinYear(years.year2);
  const year3Cost = sumCostinYear(years.year3);
  const year4Cost = sumCostinYear(years.year4);
  const year5Cost = sumCostinYear(years.year5);

  return (
    <div className="est-lifecycle-cost grid-row">
      <div className="tablet:grid-col-5">
        <div className="est-lifecycle-cost__help-box">
          <h3 className="est-lifecycle-cost__help-title text-bold">
            What do phases mean?
          </h3>
          <dl className="margin-bottom-105">
            <dt className="margin-bottom-1 text-bold">Development</dt>
            <dd className="margin-0 line-height-body-3">
              Costs related to current development that is pre-production
            </dd>
          </dl>
          <dl>
            <dt className="margin-bottom-1 text-bold">
              Operations and Maintenance
            </dt>
            <dd className="margin-0 line-height-body-3">
              Costs related to running and upkeep post-production
            </dd>
          </dl>
          <dl>
            <dt className="margin-bottom-1 text-bold">Other</dt>
            <dd className="margin-0 line-height-body-3">
              This can be Non-IT costs like education, licenses etc.
            </dd>
          </dl>
        </div>
      </div>
      <div className="tablet:grid-col-7">
        <div className="est-lifecycle-cost__year-costs margin-top-0">
          <span className="text-bold">Year 1</span>
          <Phase
            formikKey={formikKey}
            year={1}
            values={years.year1}
            setFieldValue={setFieldValue}
            errors={errors.year1}
          />
        </div>
        <div className="est-lifecycle-cost__year-costs">
          <span className="text-bold">Year 2</span>
          <Phase
            formikKey={formikKey}
            year={2}
            values={years.year2}
            setFieldValue={setFieldValue}
            errors={errors.year2}
          />
        </div>
        <div className="est-lifecycle-cost__year-costs">
          <span className="text-bold">Year 3</span>
          <Phase
            formikKey={formikKey}
            year={3}
            values={years.year3}
            setFieldValue={setFieldValue}
            errors={errors.year3}
          />
        </div>
        <div className="est-lifecycle-cost__year-costs">
          <span className="text-bold">Year 4</span>
          <Phase
            formikKey={formikKey}
            year={4}
            values={years.year4}
            setFieldValue={setFieldValue}
            errors={errors.year4}
          />
        </div>
        <div className="est-lifecycle-cost__year-costs">
          <span className="text-bold">Year 5</span>
          <Phase
            formikKey={formikKey}
            year={5}
            values={years.year5}
            setFieldValue={setFieldValue}
            errors={errors.year5}
          />
        </div>
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
