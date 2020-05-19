import React from 'react';
import classnames from 'classnames';
import { Field, FieldArray } from 'formik';
import Label from 'components/shared/Label';
import FieldGroup from 'components/shared/FieldGroup';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import TextField from 'components/shared/TextField';
import { RadioField } from 'components/shared/RadioField';
import Button from 'components/shared/Button';
import CollapsableLink from 'components/shared/CollapsableLink';
import { LifecyclePhase } from 'types/estimatedLifecycle';
import {
  DescriptionList,
  DescriptionTerm,
  DescriptionDefinition
} from 'components/shared/DescriptionGroup';
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
            <div className="est-lifecycle-cost__field-group">
              <fieldset
                className="usa-fieldset est-lifecycle-cost__phase-fieldset"
                data-scroll={`${formikKey}.year${year}.${index}.phase`}
              >
                <div className=" est-lifecycle-cost__phase-field-wrapper">
                  <legend
                    className={classnames('usa-label', 'margin-bottom-1')}
                    aria-label={`Year ${year} Phase ${index + 1} Phase Type`}
                  >
                    Phase
                  </legend>
                  <div className="est-lifecycle-cost__radio-row">
                    <Field
                      as={RadioField}
                      checked={values.phase === 'Initiate'}
                      id={`BusinessCase-${formikKey}.Year${year}.Phase${index}.initiate`}
                      name={`${formikKey}.year${year}.${index}.phase`}
                      label="Initiate"
                      value="Initiate"
                      inline
                    />

                    <Field
                      as={RadioField}
                      checked={values.phase === 'Operations and Maintenance'}
                      id={`BusinessCase-${formikKey}.Year${year}.Phase${index}.opsMaintenance`}
                      name={`${formikKey}.year${year}.${index}.phase`}
                      label="Operations and Maintenance"
                      value="Operations and Maintenance"
                      inline
                    />
                  </div>
                </div>
              </fieldset>
              <div
                className="est-lifecycle-cost__cost-field-wrapper"
                data-scroll={`${formikKey}.year${year}.${index}.cost`}
              >
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

  const currentYearCost = sumCostinYear(years.year1);
  const year2Cost = sumCostinYear(years.year2);
  const year3Cost = sumCostinYear(years.year3);
  const year4Cost = sumCostinYear(years.year4);
  const year5Cost = sumCostinYear(years.year5);

  return (
    <div className="est-lifecycle-cost grid-row">
      <div className="tablet:grid-col-8">
        <div className="est-lifecycle-cost__year-costs margin-top-0">
          <span className="text-bold">Current year</span>
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
        <div className="est-lifecycle-cost__phase-help-text">
          <CollapsableLink label="What phase should I choose?">
            <div>
              <p className="margin-top-0">
                <strong>Initiate: </strong>Projects that are going through the
                governance process, have not yet received funding, or are
                currently in development (pre-Authority to Operate)
              </p>
              <p className="margin-bottom-0">
                <strong>Operation and Maintenance: </strong>Projects that are
                live, post-Authority to Operate
              </p>
            </div>
          </CollapsableLink>
        </div>
      </div>
      <div className="tablet:grid-col-4">
        <DescriptionList
          title="Estimated Lifecycle Cost Summary"
          className="est-lifecycle-cost__total-cost-wrapper"
        >
          <div>
            <DescriptionTerm term="Current year" />
            <DescriptionDefinition
              definition={`${formatDollars(currentYearCost)}`}
            />
          </div>
          <div>
            <DescriptionTerm term="Year 2" />
            <DescriptionDefinition definition={`${formatDollars(year2Cost)}`} />
          </div>
          <div>
            <DescriptionTerm term="Year 3" />
            <DescriptionDefinition definition={`${formatDollars(year3Cost)}`} />
          </div>
          <div>
            <DescriptionTerm term="Year 4" />
            <DescriptionDefinition definition={`${formatDollars(year4Cost)}`} />
          </div>
          <div>
            <DescriptionTerm term="Year 5" />
            <DescriptionDefinition definition={`${formatDollars(year5Cost)}`} />
          </div>
          <div>
            <hr className="margin-bottom-3 text-black" />
            <DescriptionTerm
              className="est-lifecycle-cost__dt-total"
              term="System total cost"
            />
            <DescriptionDefinition
              className="est-lifecycle-cost__dd-total"
              definition={`${formatDollars(
                currentYearCost + year2Cost + year3Cost + year4Cost + year5Cost
              )}`}
            />
          </div>
        </DescriptionList>
      </div>
    </div>
  );
};

export default EstimatedLifecycleCost;
