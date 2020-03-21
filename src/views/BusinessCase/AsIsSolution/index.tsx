import React from 'react';
import { Field, FormikProps } from 'formik';
import Label from 'components/shared/Label';
import HelpText from 'components/shared/HelpText';
import TextField from 'components/shared/TextField';
import TextAreaField from 'components/shared/TextAreaField';
import FieldGroup from 'components/shared/FieldGroup';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import EstimatedLifecycleCost from 'components/EstimatedLifecycleCost';

const AsIsSolution = () => {
  return (
    <>
      <h1 className="font-heading-xl">Options Analysis</h1>
      <p className="line-height-body-6">
        Below you should identify options and alternatives to meet your business
        need. Include a summary of the approaches, how you will acquire the
        solution, and describe the pros, cons, total life cycle costs and
        potential cost savings/avoidance for each alternative considered.
        Include at least three viable alternatives: keeping things “as-is” or
        reuse existing people, equipment, or processes; and at least two
        additional alternatives. Identify your preferred solution.
      </p>
      <div className="tablet:grid-col-9">
        <h2>&quot;As is&quot; Solution</h2>
        <FieldGroup scrollElement="asIsSolution.title" error={false}>
          <Label htmlFor="BusinessCase-AsIsSolutionTitle">
            &quot;As is&quot; Solution: Title
          </Label>
          <FieldErrorMsg />
          <Field
            as={TextField}
            error={false}
            id="BusinessCase-AsIsSolutionTitle"
            maxLength={50}
            name="asIsSolution.title"
          />
        </FieldGroup>

        <FieldGroup scrollElement="asIsSolution.summary" error={false}>
          <Label htmlFor="IntakeForm-AsIsSolutionSummary">
            &quot;As is&quot; Solution: Summary
          </Label>
          <HelpText className="margin-top-1">
            <span>Please include:</span>
            <br />
            {/* Need to fix this. */}
            <ul className="system-intake__business-need-help padding-left-205">
              <li>
                a brief summary of the proposed IT solution including any
                associated software products,
              </li>
              <li>
                implementation approach (e.g. development/configuration,
                phases),
              </li>
              <li>costs (e.g. services, software, O&M),</li>
              <li>and potential acqueisition approaches.</li>
            </ul>
          </HelpText>
          <FieldErrorMsg />
          <Field
            as={TextAreaField}
            error={false}
            id="IntakeForm-AsIsSolutionSummary"
            maxLength={2000}
            name="asIsSolution.summary"
          />
        </FieldGroup>

        <FieldGroup scrollElement="asIsSolution.pros" error={false}>
          <Label htmlFor="IntakeForm-AsIsSolutionPros">
            &quot;As is&quot; Solution: Pros
          </Label>
          <HelpText className="margin-y-1">
            Identify any aspects of this solution that positively differentiates
            this approach from other solutions.
          </HelpText>
          <FieldErrorMsg />
          <Field
            as={TextAreaField}
            error={false}
            id="IntakeForm-AsIsSolutionPros"
            maxLength={2000}
            name="asIsSolution.pros"
          />
        </FieldGroup>

        <FieldGroup scrollElement="asIsSolution.cons" error={false}>
          <Label htmlFor="IntakeForm-AsIsSolutionCons">
            &quot;As is&quot; Solution: Cons
          </Label>
          <HelpText className="margin-y-1">
            Identify any aspects of this solution that negatively impacts this
            approach.
          </HelpText>
          <FieldErrorMsg />
          <Field
            as={TextAreaField}
            error={false}
            id="IntakeForm-AsIsSolutionCons"
            maxLength={2000}
            name="asIsSolution.cons"
          />
        </FieldGroup>
      </div>
      <div>
        <div className="tablet:grid-col-9">
          <h2>Estimated Lifecycle Cost</h2>
          <HelpText>
            <p>
              You can add speculative costs if exact ones are not known or if a
              contract is not yet in place. If your &quot;As is&quot; solution
              does not have any existing costs associated with it (licenses,
              contractors, etc) then please mark the cost as $0.
            </p>
            <br />
            <span>
              These things should be considered when estimating costs:
            </span>
            {/* TODO NEED TO FIX THIS */}
            <ul className="system-intake__business-need-help padding-left-205">
              <li>
                a brief summary of the proposed IT solution including any
                associated software products,
              </li>
              <li>
                implementation approach (e.g. development/configuration,
                phases),
              </li>
              <li>costs (e.g. services, software, O&M),</li>
              <li>and potential acqueisition approaches.</li>
            </ul>
          </HelpText>
        </div>
      </div>
      <EstimatedLifecycleCost />
      <div className="tablet:grid-col-9 margin-bottom-7">
        {/* How will you determine whether or not this effort is successful? */}
      </div>
    </>
  );
};

export default AsIsSolution;
