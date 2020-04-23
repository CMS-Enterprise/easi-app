import React from 'react';
import { Field, FormikProps } from 'formik';
import Label from 'components/shared/Label';
import HelpText from 'components/shared/HelpText';
import TextField from 'components/shared/TextField';
import TextAreaField from 'components/shared/TextAreaField';
import FieldGroup from 'components/shared/FieldGroup';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import Button from 'components/shared/Button';
import EstimatedLifecycleCost from 'components/EstimatedLifecycleCost';
import { defaultProposedSolution } from 'data/businessCase';
import {
  BusinessCaseModel,
  ProposedBusinessCaseSolution
} from 'types/businessCase';
import flattenErrors from 'utils/flattenErrors';

type AlternativeSolutionProps = {
  formikProps: FormikProps<BusinessCaseModel>;
  altLetter: string;
  handleToggleAlternative?: () => void;
};

const AlternativeSolution = ({
  formikProps,
  altLetter,
  handleToggleAlternative
}: AlternativeSolutionProps) => {
  const { values, errors } = formikProps;
  const flatErrors = flattenErrors(errors);
  const altLabel = `Alternative ${altLetter}`;
  const altId = `alternative${altLetter}`;
  const altValues = ((letter: string): ProposedBusinessCaseSolution => {
    switch (letter) {
      case 'A':
        return values.alternativeA;
      case 'B':
        return values.alternativeB || defaultProposedSolution;
      default:
        return defaultProposedSolution;
    }
  })(altLetter);

  const altErrors = ((letter: string): any => {
    switch (letter) {
      case 'A':
        return errors.alternativeA;
      case 'B':
        return errors.alternativeB;
      default:
        return {};
    }
  })(altLetter);

  return (
    <div className="grid-container">
      <h1 className="font-heading-xl">Alternatives Analysis</h1>
      <div className="tablet:grid-col-9">
        <div className="easi-business-case__name-wrapper">
          <h2>{altLabel}</h2>
          {altLetter === 'B' && (
            <Button
              type="button"
              className="margin-left-2"
              unstyled
              onClick={handleToggleAlternative}
            >
              Remove Alternative B
            </Button>
          )}
        </div>
        <FieldGroup
          scrollElement={`${altId}.title`}
          error={!!flatErrors[`${altId}.title`]}
        >
          <Label htmlFor={`BusinessCase-${altId}Title`}>
            {`${altLabel}: Title`}
          </Label>
          <FieldErrorMsg>{flatErrors[`${altId}.title`]}</FieldErrorMsg>
          <Field
            as={TextField}
            error={!!flatErrors[`${altId}.title`]}
            id={`BusinessCase-${altId}Title`}
            maxLength={50}
            name={`${altId}.title`}
          />
        </FieldGroup>

        <FieldGroup
          scrollElement={`${altId}.summary`}
          error={!!flatErrors[`${altId}.summary`]}
        >
          <Label htmlFor={`BusinessCase-${altId}Summary`}>
            {`${altLabel}: Summary`}
          </Label>
          <HelpText className="margin-top-1">
            <span>Please include:</span>
            <ul className="padding-left-205 margin-bottom-1">
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
          <FieldErrorMsg>{flatErrors[`${altId}.summary`]}</FieldErrorMsg>
          <Field
            as={TextAreaField}
            error={!!flatErrors[`${altId}.summary`]}
            id={`BusinessCase-${altId}Summary`}
            maxLength={2000}
            name={`${altId}.summary`}
          />
          <HelpText className="margin-top-1">{`${2000 -
            altValues.summary.length} characters left`}</HelpText>
        </FieldGroup>

        <FieldGroup
          scrollElement={`${altId}.acquisitionApproach`}
          error={!!flatErrors[`${altId}.acquisitionApproach`]}
        >
          <Label htmlFor={`BusinessCase-${altId}AcquisitionApproach`}>
            {`${altLabel}: Acquisition Approach`}
          </Label>
          <HelpText className="margin-y-1">
            Describe the approach to acquiring the products and services
            required to deliver the system, including potential contract
            vehicles.
          </HelpText>
          <FieldErrorMsg>
            {flatErrors[`${altId}.acquisitionApproach`]}
          </FieldErrorMsg>
          <Field
            as={TextAreaField}
            error={flatErrors[`${altId}.acquisitionApproach`]}
            id={`BusinessCase-${altId}AcquisitionApproach`}
            maxLength={2000}
            name={`${altId}.acquisitionApproach`}
          />
          <HelpText className="margin-top-1">{`${2000 -
            altValues.acquisitionApproach.length} characters left`}</HelpText>
        </FieldGroup>

        <FieldGroup
          scrollElement={`${altId}.pros`}
          error={!!flatErrors[`${altId}.pros`]}
        >
          <Label htmlFor={`BusinessCase-${altId}Pros`}>
            {`${altLabel}: Pros`}
          </Label>
          <HelpText className="margin-y-1">
            Identify any aspects of this solution that positively differentiates
            this approach from other solutions.
          </HelpText>
          <FieldErrorMsg>{flatErrors[`${altId}.pros`]}</FieldErrorMsg>
          <Field
            as={TextAreaField}
            error={!!flatErrors[`${altId}.pros`]}
            id={`BusinessCase-${altId}Pros`}
            maxLength={2000}
            name={`${altId}.pros`}
          />
          <HelpText className="margin-top-1">{`${2000 -
            altValues.pros.length} characters left`}</HelpText>
        </FieldGroup>

        <FieldGroup
          scrollElement={`${altId}.cons`}
          error={!!flatErrors[`${altId}.cons`]}
        >
          <Label htmlFor={`BusinessCase-${altId}Cons`}>
            {`${altLabel}: Cons`}
          </Label>
          <HelpText className="margin-y-1">
            Identify any aspects of this solution that negatively impacts this
            approach.
          </HelpText>
          <FieldErrorMsg>{flatErrors[`${altId}.cons`]}</FieldErrorMsg>
          <Field
            as={TextAreaField}
            error={!!flatErrors[`${altId}.cons`]}
            id={`BusinessCase-${altId}Cons`}
            maxLength={2000}
            name={`${altId}.cons`}
          />
          <HelpText className="margin-top-1">{`${2000 -
            altValues.cons.length} characters left`}</HelpText>
        </FieldGroup>
      </div>
      <div className="tablet:grid-col-9 margin-top-2">
        <h2 className="margin-0">Estimated Lifecycle Cost</h2>
        <HelpText>
          <p className="margin-y-2">
            You can add speculative costs if exact ones are not known or if a
            contract is not yet in place.
          </p>
          <span>These things should be considered when estimating costs:</span>
          <ul className="padding-left-205">
            <li>Hosting</li>
            <li>Software subscription and licenses (COTS and GOTS products)</li>
            <li>Contractor rates and salaries</li>
            <li>Inflation</li>
          </ul>
        </HelpText>
      </div>
      <EstimatedLifecycleCost
        formikKey={`${altId}.estimatedLifecycleCost`}
        years={altValues.estimatedLifecycleCost}
        errors={altErrors && altErrors.estimatedLifecycleCost}
      />
      <div className="tablet:grid-col-9 margin-top-2 margin-bottom-7">
        <FieldGroup
          scrollElement={`${altId}.costSavings`}
          error={!!flatErrors[`${altId}.costSavings`]}
        >
          <Label htmlFor={`BusinessCase-${altId}CostSavings`}>
            What is the cost savings or avoidance associated with this solution?
          </Label>
          <HelpText className="margin-y-1">
            This could include old systems going away, contract hours/ new Full
            Time Employees not needed, or other savings, even if indirect.
          </HelpText>
          <FieldErrorMsg>{flatErrors[`${altId}.costSavings`]}</FieldErrorMsg>
          <Field
            as={TextAreaField}
            error={!!flatErrors[`${altId}.costSavings`]}
            id={`BusinessCase-${altId}CostSavings`}
            maxLength={2000}
            name={`${altId}.costSavings`}
          />
          <HelpText className="margin-top-1">{`${2000 -
            altValues.costSavings.length} characters left`}</HelpText>
        </FieldGroup>

        {altLetter === 'A' && !values.alternativeB && (
          <>
            <h2 className="margin-bottom-1">Additional Alternatives</h2>
            <HelpText>
              If you are building a multi-year project that will require
              significant upkeep, you may want to include more options. Keep in
              mind that Government Off the Shelf and Commercial Off the Shelf
              are acceptable alternatives to include.
            </HelpText>
            <div className="margin-top-2">
              <Button type="button" base onClick={handleToggleAlternative}>
                + Alternative B
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AlternativeSolution;
