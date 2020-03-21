import React from 'react';
import classnames from 'classnames';
import { Field, FieldArray } from 'formik';
import Label from 'components/shared/Label';
import FieldGroup from 'components/shared/FieldGroup';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import TextField from 'components/shared/TextField';
import { RadioField } from 'components/shared/RadioField';
import Button from 'components/shared/Button';
import { LifecyclePhase } from 'types/estimatedLifecycle';
import './index.scss';

type PhaseProps = {
  displayAddPhase: boolean;
  displayLabel: boolean;
  formikKey: string;
  index: number;
  values: LifecyclePhase;
};
const Phase = ({
  displayAddPhase,
  displayLabel,
  formikKey,
  index,
  values
}: PhaseProps) => {
  return (
    <FieldArray name={formikKey}>
      {arrayHelpers => (
        <div className="est-lifecycle-cost__phase-wrapper">
          <div className="margin-top-1 est-lifecycle-cost__phase">
            <FieldGroup
              className="est-lifecycle-cost__field-group"
              scrollElement="somethingGoesHere"
              error={false}
            >
              <FieldErrorMsg />
              <FieldErrorMsg />
              <fieldset className="usa-fieldset est-lifecycle-cost__phase-wrapper">
                <div
                  className={classnames('est-lifecycle-cost__phase-wrapper', {
                    'est-lifecycle-cost__phase-wrapper--first': index === 0
                  })}
                >
                  <legend
                    className={classnames('usa-label', 'margin-bottom-1', {
                      'usa-sr-only': !displayLabel
                    })}
                  >
                    Phase
                  </legend>
                  <div>
                    <Field
                      as={RadioField}
                      checked={values.phase === 'Initiate'}
                      id={`BusinessCase-${formikKey}.Phase${index}.initiate`}
                      name={`${formikKey}.${index}.phase`}
                      label="Initiate"
                      value="Initiate"
                      inline
                    />

                    <Field
                      as={RadioField}
                      checked={values.phase === 'Operations & Maintanence'}
                      id={`BusinessCase-${formikKey}.Phase${index}.opsMaintanence`}
                      name={`${formikKey}.${index}.phase`}
                      label="Operations & Maintanence"
                      value="Operations & Maintanence"
                      inline
                    />
                  </div>
                </div>
              </fieldset>
              <div
                className={classnames('est-lifecycle-cost-wrapper', {
                  'est-lifecycle-cost-wrapper--first': index === 0
                })}
              >
                <Label
                  className={classnames({ 'usa-sr-only': !displayLabel })}
                  htmlFor={`BusinessCase-${formikKey}.Phase${index}.cost`}
                >
                  Cost
                </Label>
                <Field
                  as={TextField}
                  error={false}
                  id={`BusinessCase-${formikKey}.Phase${index}.cost`}
                  name={`${formikKey}.${index}.cost`}
                />
              </div>
              {displayAddPhase && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end'
                  }}
                >
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
                </div>
              )}
            </FieldGroup>
          </div>
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
};
const EstimatedLifecycleCost = ({
  formikKey,
  years
}: EstimatedLifecycleCostProps) => {
  return (
    <div className="est-lifecycle-cost">
      <div className="grid-col-8">
        <div className="est-lifecycle-cost__year-costs">
          <span className="text-bold">Current Year</span>
          {years.year1.map((year: LifecyclePhase, index: number) => {
            return (
              <Phase
                key={`Year1Phase-${index + 1}`}
                displayAddPhase={years.year1.length - 1 === index}
                displayLabel={index === 0}
                formikKey={`${formikKey}.year1`}
                index={index}
                values={year}
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
                displayAddPhase={years.year2.length - 1 === index}
                displayLabel={index === 0}
                formikKey={`${formikKey}.year2`}
                index={index}
                values={year}
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
                displayAddPhase={years.year3.length - 1 === index}
                displayLabel={index === 0}
                formikKey={`${formikKey}.year3`}
                index={index}
                values={year}
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
                displayAddPhase={years.year4.length - 1 === index}
                displayLabel={index === 0}
                formikKey={`${formikKey}.year4`}
                index={index}
                values={year}
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
                displayAddPhase={years.year5.length - 1 === index}
                displayLabel={index === 0}
                formikKey={`${formikKey}.year5`}
                index={index}
                values={year}
              />
            );
          })}
        </div>
      </div>
      <div className="grid-col-4"></div>
    </div>
  );
};

export default EstimatedLifecycleCost;
