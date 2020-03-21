import React from 'react';
import { Field } from 'formik';
import Label from 'components/shared/Label';
import FieldGroup from 'components/shared/FieldGroup';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import TextField from 'components/shared/TextField';
import { RadioField } from 'components/shared/RadioField';
import Button from 'components/shared/Button';
import './index.scss';

const EstimatedLifecycleCost = () => {
  return (
    <div className="est-lifecycle-cost">
      <div className="grid-col-8">
        <span className="text-bold">Current Year</span>
        <div className="est-lifecycle-cost__phase-wrapper">
          {/* <div className="est-lifecycle-cost__column-labels">
            <div>Phase</div>
            <div>Cost</div>
          </div> */}
          <div className="margin-top-1 est-lifecycle-cost__phase">
            {/* This FieldGroup encapsulates both fields because they are inline */}
            <FieldGroup
              className="est-lifecycle-cost__field-group"
              scrollElement="somethingGoesHere"
              error={false}
            >
              <FieldErrorMsg />
              <FieldErrorMsg />
              <fieldset className="usa-fieldset est-lifecycle-cost__phase-wrapper">
                <legend className="usa-label margin-bottom-1">Phase</legend>
                <div>
                  <Field
                    as={RadioField}
                    checked={false}
                    id="BusinessCase-PhaseInitiate"
                    name="somethingGoesHere"
                    label="Initiate"
                    onChange={() => {}}
                    value="Initiate"
                    inline
                  />

                  <Field
                    as={RadioField}
                    checked={false}
                    id="BusinessCase-PhaseOperationMaintanence"
                    name="somethingGoesHere"
                    label="Operations & Maintanence"
                    onChange={() => {}}
                    value="Operations & Maintanence"
                    inline
                  />
                </div>
              </fieldset>
              <div className="est-lifecycle-cost__cost-wrapper">
                <Label htmlFor="BusinessCase-PhaseCost">Cost</Label>
                <Field
                  as={TextField}
                  error={false}
                  id="BusinessCase-PhaseCost"
                  name="needSomethingHere"
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end'
                }}
              >
                <Button type="button" outline>
                  + Add Phase
                </Button>
              </div>
            </FieldGroup>
          </div>
        </div>
      </div>
      <div className="grid-col-4"></div>
    </div>
  );
};

export default EstimatedLifecycleCost;
