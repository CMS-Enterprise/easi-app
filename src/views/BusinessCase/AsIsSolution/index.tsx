import React from 'react';
import { Field, FormikProps } from 'formik';
import Label from 'components/shared/Label';
import HelpText from 'components/shared/HelpText';
import TextField from 'components/shared/TextField';
import TextAreaField from 'components/shared/TextAreaField';
import FieldGroup from 'components/shared/FieldGroup';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import EstimatedLifecycleCost from 'components/EstimatedLifecycleCost';
import { BusinessCaseModel } from 'types/businessCase';

type AsIsSolutionProps = {
  formikProps: FormikProps<BusinessCaseModel>;
};
const AsIsSolution = ({ formikProps }: AsIsSolutionProps) => {
  const { values } = formikProps;
  return (
    <>
      <h1 className="font-heading-xl">Alternatives Analysis</h1>
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
          <Label htmlFor="BusinessCase-AsIsSolutionSummary">
            &quot;As is&quot; Solution: Summary
          </Label>
          <HelpText className="margin-top-1">
            <span>Please include:</span>
            <ul className="padding-left-205">
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
            id="BusinessCase-AsIsSolutionSummary"
            maxLength={2000}
            name="asIsSolution.summary"
          />
          <HelpText className="margin-top-1">{`${2000 -
            values.asIsSolution.summary.length} characters left`}</HelpText>
        </FieldGroup>

        <FieldGroup scrollElement="asIsSolution.pros" error={false}>
          <Label htmlFor="BusinessCase-AsIsSolutionPros">
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
            id="BusinessCase-AsIsSolutionPros"
            maxLength={2000}
            name="asIsSolution.pros"
          />
          <HelpText className="margin-top-1">{`${2000 -
            values.asIsSolution.pros.length} characters left`}</HelpText>
        </FieldGroup>

        <FieldGroup scrollElement="asIsSolution.cons" error={false}>
          <Label htmlFor="BusinessCase-AsIsSolutionCons">
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
            id="BusinessCase-AsIsSolutionCons"
            maxLength={2000}
            name="asIsSolution.cons"
          />
          <HelpText className="margin-top-1">{`${2000 -
            values.asIsSolution.cons.length} characters left`}</HelpText>
        </FieldGroup>
      </div>
      <div className="tablet:grid-col-9 margin-top-2">
        <h2 className="margin-0">Estimated Lifecycle Cost</h2>
        <HelpText>
          <p className="margin-y-2">
            You can add speculative costs if exact ones are not known or if a
            contract is not yet in place. If your &quot;As is&quot; solution
            does not have any existing costs associated with it (licenses,
            contractors, etc) then please mark the cost as $0.
          </p>
          <span>These things should be considered when estimating costs:</span>
          <ul className="padding-left-205">
            <li>Hosting</li>
            <li>Software subscription and licenses(COTS and GOTS products)</li>
            <li>Contractor rates and salaries</li>
            <li>Inflation</li>
          </ul>
        </HelpText>
      </div>
      <EstimatedLifecycleCost
        formikKey="asIsSolution.estimatedLifecycleCost"
        years={values.asIsSolution.estimatedLifecycleCost}
      />
      <div className="tablet:grid-col-9 margin-bottom-7">
        <FieldGroup scrollElement="asIsSolution.costSavings" error={false}>
          <Label htmlFor="BusinessCase-AsIsSolutionCostSavings">
            What is the cost savings or avoidance associated with this solution?
          </Label>
          <HelpText className="margin-y-1">
            This could include old systems going away, contract hours/ new Full
            Time Employees not needed, or other savings, even if indirect.
          </HelpText>
          <FieldErrorMsg />
          <Field
            as={TextAreaField}
            error={false}
            id="BusinessCase-AsIsSolutionCostSavings"
            maxLength={2000}
            name="asIsSolution.costSavings"
          />
          <HelpText className="margin-top-1">{`${2000 -
            values.asIsSolution.costSavings.length} characters left`}</HelpText>
        </FieldGroup>
      </div>
    </>
  );
};

export default AsIsSolution;
