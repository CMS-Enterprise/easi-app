import React from 'react';
import { Button } from '@trussworks/react-uswds';
import classnames from 'classnames';
import { Field, FieldArray } from 'formik';

import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import Label from 'components/shared/Label';
import { RadioField, RadioGroup } from 'components/shared/RadioField';
import TextField from 'components/shared/TextField';
import { LifecyclePhase } from 'types/estimatedLifecycle';
import formatDollars from 'utils/formatDollars';

import './index.scss';

type PhaseProps = {
  formikKey: string;
  year: number;
  index: number;
  values: LifecyclePhase;
  errors: any[];
};
const Phase = ({ formikKey, year, index, values, errors = [] }: PhaseProps) => {
  const phaseError = errors[index] || {};
  return (
    <FieldArray name={`${formikKey}.year${year}`}>
      {arrayHelpers => (
        <div className="est-lifecycle-cost__phase-cost-wrapper">
          <FieldGroup error={phaseError.phase || phaseError.cost}>
            {phaseError.phase && (
              <FieldErrorMsg>{phaseError.phase}</FieldErrorMsg>
            )}
            {phaseError.cost && (
              <FieldErrorMsg>{phaseError.cost}</FieldErrorMsg>
            )}
            <div className="margin-right-2">
              <fieldset
                className="usa-fieldset"
                aria-describedby="BusinessCase-EstimatedLifecycleCostHelp"
                data-scroll={`${formikKey}.year${year}.${index}.phase`}
              >
                <div>
                  <legend
                    className={classnames('usa-label', 'margin-bottom-1')}
                    aria-label={`Year ${year} Phase ${index + 1} Phase Type`}
                  >
                    Phase
                  </legend>
                  <RadioGroup>
                    <Field
                      as={RadioField}
                      checked={values.phase === 'Development'}
                      id={`BusinessCase-${formikKey}.Year${year}.Phase${index}.Development`}
                      name={`${formikKey}.year${year}.${index}.phase`}
                      label="Development"
                      value="Development"
                    />

                    <Field
                      as={RadioField}
                      checked={values.phase === 'Operations and Maintenance'}
                      id={`BusinessCase-${formikKey}.Year${year}.Phase${index}.opsMaintenance`}
                      name={`${formikKey}.year${year}.${index}.phase`}
                      label="Operations and Maintenance"
                      value="Operations and Maintenance"
                    />

                    <Field
                      as={RadioField}
                      checked={values.phase === 'Other'}
                      id={`BusinessCase-${formikKey}.Year${year}.Phase${index}.other`}
                      name={`${formikKey}.year${year}.${index}.phase`}
                      label="Other"
                      value="Other"
                    />
                  </RadioGroup>
                </div>
              </fieldset>
            </div>
            <div
              className="est-lifecycle-cost__phase-cost-row"
              data-scroll={`${formikKey}.year${year}.${index}.cost`}
            >
              <div>
                <Label
                  htmlFor={`BusinessCase-${formikKey}.Year${year}.Phase${index}.cost`}
                  aria-label={`Year ${year} Phase ${index + 1} Cost`}
                >
                  Cost
                </Label>
                <Field
                  as={TextField}
                  error={!!phaseError.cost}
                  id={`BusinessCase-${formikKey}.Year${year}.Phase${index}.cost`}
                  name={`${formikKey}.year${year}.${index}.cost`}
                  maxLength={10}
                  match={/^[0-9\b]+$/}
                />
              </div>

              <div className="est-lifecycle-cost__phase-btn-wrapper">
                {index === 0 ? (
                  <Button
                    type="button"
                    outline
                    onClick={() => {
                      arrayHelpers.push({
                        phase: '',
                        cost: ''
                      });
                    }}
                  >
                    + Add Phase
                  </Button>
                ) : (
                  <Button
                    className="est-lifecycle-cost__remove-phase-btn"
                    type="button"
                    outline
                    onClick={() => {
                      arrayHelpers.remove(index);
                    }}
                    unstyled
                  >
                    Remove phase
                  </Button>
                )}
              </div>
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
    year1: LifecyclePhase[];
    year2: LifecyclePhase[];
    year3: LifecyclePhase[];
    year4: LifecyclePhase[];
    year5: LifecyclePhase[];
  };
  errors: any;
};
const EstimatedLifecycleCost = ({
  formikKey,
  years,
  errors = {}
}: EstimatedLifecycleCostProps) => {
  const sumCostinYear = (phases: LifecyclePhase[]) => {
    return phases.reduce((prev, current) => {
      if (current.cost) {
        return prev + parseFloat(current.cost);
      }
      return prev;
    }, 0);
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
          {years.year1.map((year: LifecyclePhase, index: number) => {
            return (
              <Phase
                key={`Year1Phase-${index + 1}`}
                formikKey={formikKey}
                year={1}
                index={index}
                values={year}
                errors={errors.year1}
              />
            );
          })}
        </div>
        <div className="est-lifecycle-cost__year-costs">
          <span className="text-bold">Year 2</span>
          {years.year2.map((year: LifecyclePhase, index: number) => {
            return (
              <Phase
                key={`Year2Phase-${index + 1}`}
                formikKey={formikKey}
                year={2}
                index={index}
                values={year}
                errors={errors.year2}
              />
            );
          })}
        </div>
        <div className="est-lifecycle-cost__year-costs">
          <span className="text-bold">Year 3</span>
          {years.year3.map((year: LifecyclePhase, index: number) => {
            return (
              <Phase
                key={`Year3Phase-${index + 1}`}
                formikKey={formikKey}
                year={3}
                index={index}
                values={year}
                errors={errors.year3}
              />
            );
          })}
        </div>
        <div className="est-lifecycle-cost__year-costs">
          <span className="text-bold">Year 4</span>
          {years.year4.map((year: LifecyclePhase, index: number) => {
            return (
              <Phase
                key={`Year4Phase-${index + 1}`}
                formikKey={formikKey}
                year={4}
                index={index}
                values={year}
                errors={errors.year4}
              />
            );
          })}
        </div>
        <div className="est-lifecycle-cost__year-costs">
          <span className="text-bold">Year 5</span>
          {years.year5.map((year: LifecyclePhase, index: number) => {
            return (
              <Phase
                key={`Year5Phase-${index + 1}`}
                formikKey={formikKey}
                year={5}
                index={index}
                values={year}
                errors={errors.year5}
              />
            );
          })}
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
