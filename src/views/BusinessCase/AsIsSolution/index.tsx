import React from 'react';
import { Field, FormikProps } from 'formik';

import CharacterCounter from 'components/CharacterCounter';
import EstimatedLifecycleCost from 'components/EstimatedLifecycleCost';
import MandatoryFieldsAlert from 'components/MandatoryFieldsAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import TextField from 'components/shared/TextField';
import { BusinessCaseModel } from 'types/businessCase';
import flattenErrors from 'utils/flattenErrors';

type AsIsSolutionProps = {
  formikProps: FormikProps<BusinessCaseModel>;
};
const AsIsSolution = ({ formikProps }: AsIsSolutionProps) => {
  const { values, errors } = formikProps;
  const flatErrors = flattenErrors(errors);
  return (
    <div>
      <h1 className="font-heading-xl">Alternatives Analysis</h1>
      <p className="line-height-body-5">
        Below you should identify options and alternatives to meet your business
        need. Include a summary of the approaches, how you will acquire the
        solution, and describe the pros, cons, total life cycle costs and
        potential cost savings/avoidance for each alternative considered.
        Include at least three viable alternatives: keeping things “as-is” or
        reuse existing people, equipment, or processes; and at least two
        additional alternatives. Identify your preferred solution.
      </p>
      <div className="tablet:grid-col-5">
        <MandatoryFieldsAlert />
      </div>
      <div className="tablet:grid-col-9">
        <h2>&quot;As is&quot; solution</h2>
        <FieldGroup
          scrollElement="asIsSolution.title"
          error={!!flatErrors['asIsSolution.title']}
        >
          <Label htmlFor="BusinessCase-AsIsSolutionTitle">
            &quot;As is&quot; solution: Title
          </Label>
          <FieldErrorMsg>{flatErrors['asIsSolution.title']}</FieldErrorMsg>
          <Field
            as={TextField}
            error={!!flatErrors['asIsSolution.title']}
            id="BusinessCase-AsIsSolutionTitle"
            maxLength={50}
            name="asIsSolution.title"
          />
        </FieldGroup>

        <FieldGroup
          scrollElement="asIsSolution.summary"
          error={!!flatErrors['asIsSolution.summary']}
        >
          <Label htmlFor="BusinessCase-AsIsSolutionSummary">
            &quot;As is&quot; solution: Summary
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
              <li>
                costs (e.g. services, software, Operation and Maintenance),{' '}
              </li>
              <li>and potential acquisition approaches</li>
            </ul>
          </HelpText>
          <FieldErrorMsg>{flatErrors['asIsSolution.summary']}</FieldErrorMsg>
          <Field
            as={TextAreaField}
            error={!!flatErrors['asIsSolution.summary']}
            id="BusinessCase-AsIsSolutionSummary"
            maxLength={2000}
            name="asIsSolution.summary"
            aria-describedby="BusinessCase-AsIsSolutionSummaryCounter"
          />
          <CharacterCounter
            id="BusinessCase-AsIsSolutionSummaryCounter"
            characterCount={2000 - values.asIsSolution.summary.length}
          />
        </FieldGroup>

        <FieldGroup
          scrollElement="asIsSolution.pros"
          error={!!flatErrors['asIsSolution.pros']}
        >
          <Label htmlFor="BusinessCase-AsIsSolutionPros">
            &quot;As is&quot; solution: Pros
          </Label>
          <HelpText className="margin-y-1">
            Identify any aspects of this solution that positively differentiates
            this approach from other solutions
          </HelpText>
          <FieldErrorMsg>{flatErrors['asIsSolution.pros']}</FieldErrorMsg>
          <Field
            as={TextAreaField}
            error={!!flatErrors['asIsSolution.pros']}
            id="BusinessCase-AsIsSolutionPros"
            maxLength={2000}
            name="asIsSolution.pros"
            aria-describedby="BusinessCase-AsIsSolutionProsCounter"
          />
          <CharacterCounter
            id="BusinessCase-AsIsSolutionProsCounter"
            characterCount={2000 - values.asIsSolution.pros.length}
          />
        </FieldGroup>

        <FieldGroup
          scrollElement="asIsSolution.cons"
          error={!!flatErrors['asIsSolution.cons']}
        >
          <Label htmlFor="BusinessCase-AsIsSolutionCons">
            &quot;As is&quot; solution: Cons
          </Label>
          <HelpText className="margin-y-1">
            Identify any aspects of this solution that negatively impact this
            approach
          </HelpText>
          <FieldErrorMsg>{flatErrors['asIsSolution.cons']}</FieldErrorMsg>
          <Field
            as={TextAreaField}
            error={!!flatErrors['asIsSolution.cons']}
            id="BusinessCase-AsIsSolutionCons"
            maxLength={2000}
            name="asIsSolution.cons"
            aria-describedby="BusinessCase-AsIsSolutionConsCounter"
          />
          <CharacterCounter
            id="BusinessCase-AsIsSolutionConsCounter"
            characterCount={2000 - values.asIsSolution.cons.length}
          />
        </FieldGroup>
      </div>
      <div className="tablet:grid-col-9 margin-top-2">
        <h2 className="margin-0">Estimated lifecycle cost</h2>
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
            <li>
              Software subscription and licenses (Commercial off-the-shelf and
              Government off-the-shelf products)
            </li>
            <li>Contractor rates and salaries</li>
            <li>Inflation</li>
          </ul>
        </HelpText>
        <EstimatedLifecycleCost
          formikKey="asIsSolution.estimatedLifecycleCost"
          years={values.asIsSolution.estimatedLifecycleCost}
          errors={
            errors.asIsSolution && errors.asIsSolution.estimatedLifecycleCost
          }
        />
      </div>
      <div className="tablet:grid-col-9 margin-bottom-7">
        <FieldGroup
          scrollElement="asIsSolution.costSavings"
          error={!!flatErrors['asIsSolution.costSavings']}
        >
          <Label htmlFor="BusinessCase-AsIsSolutionCostSavings">
            What is the cost savings or avoidance associated with this solution?
          </Label>
          <HelpText className="margin-y-1">
            This could include old systems going away, contract hours/ new Full
            Time Employees not needed, or other savings, even if indirect.
          </HelpText>
          <FieldErrorMsg>
            {flatErrors['asIsSolution.costSavings']}
          </FieldErrorMsg>
          <Field
            as={TextAreaField}
            error={!!flatErrors['asIsSolution.costSavings']}
            id="BusinessCase-AsIsSolutionCostSavings"
            maxLength={2000}
            name="asIsSolution.costSavings"
            aria-describedby="BusinessCase-AsIsSolutionCostSavingsCounter"
          />
          <CharacterCounter
            id="BusinessCase-AsIsSolutionCostSavingsCounter"
            characterCount={2000 - values.asIsSolution.costSavings.length}
          />
        </FieldGroup>
      </div>
    </div>
  );
};

export default AsIsSolution;
