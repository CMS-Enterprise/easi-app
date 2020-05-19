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
import flattenErrors from 'utils/flattenErrors';

type PreferredSolutionProps = {
  formikProps: FormikProps<BusinessCaseModel>;
};
const PreferredSolution = ({ formikProps }: PreferredSolutionProps) => {
  const { values, errors } = formikProps;
  const flatErrors = flattenErrors(errors);

  return (
    <div className="grid-container">
      <h1 className="font-heading-xl">Alternatives Analysis</h1>
      <div className="tablet:grid-col-9">
        <h2>Preferred solution</h2>
        <FieldGroup
          scrollElement="preferredSolution.title"
          error={!!flatErrors['preferredSolution.title']}
        >
          <Label htmlFor="BusinessCase-PreferredSolutionTitle">
            Preferred solution: Title
          </Label>
          <FieldErrorMsg>{flatErrors['preferredSolution.title']}</FieldErrorMsg>
          <Field
            as={TextField}
            error={!!flatErrors['preferredSolution.title']}
            id="BusinessCase-PreferredSolutionTitle"
            maxLength={50}
            name="preferredSolution.title"
          />
        </FieldGroup>

        <FieldGroup
          scrollElement="preferredSolution.summary"
          error={!!flatErrors['preferredSolution.summary']}
        >
          <Label htmlFor="BusinessCase-PreferredSolutionSummary">
            Preferred solution: Summary
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
          <FieldErrorMsg>
            {flatErrors['preferredSolution.summary']}
          </FieldErrorMsg>
          <Field
            as={TextAreaField}
            error={!!flatErrors['preferredSolution.summary']}
            id="BusinessCase-PreferredSolutionSummary"
            maxLength={2000}
            name="preferredSolution.summary"
          />
          <HelpText className="margin-top-1">{`${2000 -
            values.preferredSolution.summary
              .length} characters left`}</HelpText>
        </FieldGroup>

        <FieldGroup
          scrollElement="preferredSolution.acquisitionApproach"
          error={!!flatErrors['preferredSolution.acquisitionApproach']}
        >
          <Label htmlFor="BusinessCase-PreferredSolutionAcquisitionApproach">
            Preferred solution: Acquisition approach
          </Label>
          <HelpText className="margin-y-1">
            Describe the approach to acquiring the products and services
            required to deliver the system, including potential contract
            vehicles.
          </HelpText>
          <FieldErrorMsg>
            {flatErrors['preferredSolution.acquisitionApproach']}
          </FieldErrorMsg>
          <Field
            as={TextAreaField}
            error={!!flatErrors['preferredSolution.acquisitionApproach']}
            id="BusinessCase-PreferredSolutionAcquisitionApproach"
            maxLength={2000}
            name="preferredSolution.acquisitionApproach"
          />
          <HelpText className="margin-top-1">{`${2000 -
            values.preferredSolution.acquisitionApproach
              .length} characters left`}</HelpText>
        </FieldGroup>

        <FieldGroup
          scrollElement="preferredSolution.pros"
          error={!!flatErrors['preferredSolution.pros']}
        >
          <Label htmlFor="BusinessCase-PreferredSolutionPros">
            Preferred solution: Pros
          </Label>
          <HelpText className="margin-y-1">
            Identify any aspects of this solution that positively differentiates
            this approach from other solutions
          </HelpText>
          <FieldErrorMsg>{flatErrors['preferredSolution.pros']}</FieldErrorMsg>
          <Field
            as={TextAreaField}
            error={!!flatErrors['preferredSolution.pros']}
            id="BusinessCase-PreferredSolutionPros"
            maxLength={2000}
            name="preferredSolution.pros"
          />
          <HelpText className="margin-top-1">{`${2000 -
            values.preferredSolution.pros.length} characters left`}</HelpText>
        </FieldGroup>

        <FieldGroup
          scrollElement="preferredSolution.cons"
          error={!!flatErrors['preferredSolution.cons']}
        >
          <Label htmlFor="BusinessCase-PreferredSolutionCons">
            Preferred solution: Cons
          </Label>
          <HelpText className="margin-y-1">
            Identify any aspects of this solution that negatively impact this
            approach
          </HelpText>
          <FieldErrorMsg>{flatErrors['preferredSolution.cons']}</FieldErrorMsg>
          <Field
            as={TextAreaField}
            error={!!flatErrors['preferredSolution.cons']}
            id="BusinessCase-PreferredSolutionCons"
            maxLength={2000}
            name="preferredSolution.cons"
          />
          <HelpText className="margin-top-1">{`${2000 -
            values.preferredSolution.cons.length} characters left`}</HelpText>
        </FieldGroup>
      </div>
      <div className="tablet:grid-col-9 margin-top-2">
        <h2 className="margin-0">Estimated lifecycle cost</h2>
        <HelpText>
          <p className="margin-y-2">
            You can add speculative costs if exact ones are not known or if a
            contract is not yet in place.
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
          formikKey="preferredSolution.estimatedLifecycleCost"
          years={values.preferredSolution.estimatedLifecycleCost}
          errors={
            errors.preferredSolution &&
            errors.preferredSolution.estimatedLifecycleCost
          }
        />
      </div>
      <div className="tablet:grid-col-9 margin-bottom-7">
        <FieldGroup
          scrollElement="preferredSolution.costSavings"
          error={!!flatErrors['preferredSolution.costSavings']}
        >
          <Label htmlFor="BusinessCase-PreferredSolutionCostSavings">
            What is the cost savings or avoidance associated with this solution?
          </Label>
          <HelpText className="margin-y-1">
            This could include old systems going away, contract hours/ new Full
            Time Employees not needed, or other savings, even if indirect.
          </HelpText>
          <FieldErrorMsg>
            {flatErrors['preferredSolution.costSavings']}
          </FieldErrorMsg>
          <Field
            as={TextAreaField}
            error={!!flatErrors['preferredSolution.costSavings']}
            id="BusinessCase-PreferredSolutionCostSavings"
            maxLength={2000}
            name="preferredSolution.costSavings"
          />
          <HelpText className="margin-top-1">{`${2000 -
            values.preferredSolution.costSavings
              .length} characters left`}</HelpText>
        </FieldGroup>
      </div>
    </div>
  );
};

export default PreferredSolution;
