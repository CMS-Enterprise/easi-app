import React from 'react';
import { Button } from '@trussworks/react-uswds';
import { Field, FormikProps } from 'formik';

import CharacterCounter from 'components/CharacterCounter';
import EstimatedLifecycleCost from 'components/EstimatedLifecycleCost';
import MandatoryFieldsAlert from 'components/MandatoryFieldsAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import { RadioField } from 'components/shared/RadioField';
import TextAreaField from 'components/shared/TextAreaField';
import TextField from 'components/shared/TextField';
import { defaultProposedSolution } from 'data/businessCase';
import { yesNoMap } from 'data/common';
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
  const { values, errors, setFieldValue } = formikProps;
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
        <div className="line-height-body-6">
          Some examples of options to consider may include:
          <ul className="padding-left-205 margin-y-0">
            <li>Buy vs. build vs. lease vs. reuse of existing system</li>
            <li>
              Commercial off-the-shelf (COTS) vs. Government off-the-shelf
              (GOTS)
            </li>
            <li>Mainframe vs. server-based vs. clustering vs. Cloud</li>
          </ul>
          <br />
          In your options, include details such as differences between system
          capabilities, user friendliness, technical and security
          considerations, ease and timing of integration with CMS&apos; IT
          infrastructure, etc.
        </div>
      </div>
      <div className="tablet:grid-col-5 margin-top-2 margin-bottom-5">
        <MandatoryFieldsAlert />
      </div>
      <div className="tablet:grid-col-9">
        <div className="easi-business-case__name-wrapper">
          <h2 className="margin-0">{altLabel}</h2>
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
              <li>
                costs (e.g. services, software, Operation and Maintenance),{' '}
              </li>
              <li>and potential acquisition approaches</li>
            </ul>
          </HelpText>
          <FieldErrorMsg>{flatErrors[`${altId}.summary`]}</FieldErrorMsg>
          <Field
            as={TextAreaField}
            error={!!flatErrors[`${altId}.summary`]}
            id={`BusinessCase-${altId}Summary`}
            maxLength={2000}
            name={`${altId}.summary`}
            aria-describedby={`BusinessCase-${altId}SummmaryCounter`}
          />
          <CharacterCounter
            id={`BusinessCase-${altId}SummmaryCounter`}
            characterCount={2000 - altValues.summary.length}
          />
        </FieldGroup>

        <FieldGroup
          scrollElement={`${altId}.acquisitionApproach`}
          error={!!flatErrors[`${altId}.acquisitionApproach`]}
        >
          <Label htmlFor={`BusinessCase-${altId}AcquisitionApproach`}>
            {`${altLabel}: Acquisition approach`}
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
            aria-describedby={`BusinessCase-${altId}AcquisitionApproachCounter`}
          />
          <CharacterCounter
            id={`BusinessCase-${altId}AcquisitionApproachCounter`}
            characterCount={2000 - altValues.acquisitionApproach.length}
          />
        </FieldGroup>

        <FieldGroup
          scrollElement={`${altId}.hosting.type`}
          error={!!flatErrors[`${altId}.hosting.type`]}
        >
          <fieldset className="usa-fieldset margin-top-4">
            <legend className="usa-label margin-bottom-1">
              Do you need to host your solution?
            </legend>
            <FieldErrorMsg>{flatErrors[`${altId}.hosting.type`]}</FieldErrorMsg>

            <Field
              as={RadioField}
              checked={altValues.hosting.type === 'cloud'}
              id={`BusinessCase-${altId}SolutionHostingCloud`}
              name={`${altId}.hosting.type`}
              label="Yes, in the cloud (AWS, Azure, etc.)"
              value="cloud"
              onChange={() => {
                setFieldValue(`${altId}.hosting.type`, 'cloud');
                setFieldValue(`${altId}.hosting.location`, '');
                setFieldValue(`${altId}.hosting.cloudServiceType`, '');
              }}
            />
            {altValues.hosting.type === 'cloud' && (
              <>
                <FieldGroup
                  className="margin-top-neg-2 margin-bottom-1 margin-left-4"
                  scrollElement={`{${altId}.hosting.location`}
                  error={!!flatErrors[`${altId}.hosting.location`]}
                >
                  <Label htmlFor={`BusinessCase-${altId}CloudLocation`}>
                    Where are you planning to host?
                  </Label>
                  <FieldErrorMsg>
                    {flatErrors[`${altId}.hosting.location`]}
                  </FieldErrorMsg>
                  <Field
                    as={TextField}
                    error={!!flatErrors[`${altId}.hosting.location`]}
                    id={`BusinessCase-${altId}CloudLocation`}
                    maxLength={50}
                    name={`${altId}.hosting.location`}
                  />
                </FieldGroup>
                <FieldGroup
                  className="margin-top-neg-2 margin-bottom-1 margin-left-4"
                  scrollElement={`${altId}.hosting.cloudServiceType`}
                  error={!!flatErrors[`${altId}.hosting.cloudServiceType`]}
                >
                  <Label htmlFor={`BusinessCase-${altId}CloudServiceType`}>
                    What, if any, type of cloud service are you planning to use
                    for this solution (Iaas, PaaS, SaaS, etc.)?
                  </Label>
                  <FieldErrorMsg>
                    {flatErrors[`${altId}.hosting.cloudServiceType`]}
                  </FieldErrorMsg>
                  <Field
                    as={TextField}
                    error={!!flatErrors[`${altId}.hosting.cloudServiceType`]}
                    id={`BusinessCase-${altId}CloudServiceType`}
                    maxLength={50}
                    name={`${altId}.hosting.cloudServiceType`}
                  />
                </FieldGroup>
              </>
            )}
            <Field
              as={RadioField}
              checked={altValues.hosting.type === 'dataCenter'}
              id={`BusinessCase-${altId}HostingDataCenter`}
              name={`${altId}.hosting.type`}
              label="Yes, at a data center"
              value="dataCenter"
              onChange={() => {
                setFieldValue(`${altId}.hosting.type`, 'dataCenter');
                setFieldValue(`${altId}.hosting.location`, '');
                setFieldValue(`${altId}.hosting.cloudServiceType`, '');
              }}
            />
            {altValues.hosting.type === 'dataCenter' && (
              <FieldGroup
                className="margin-top-neg-2 margin-bottom-1 margin-left-4"
                scrollElement={`${altId}.hosting.location`}
                error={!!flatErrors[`${altId}.hosting.location`]}
              >
                <Label htmlFor={`BusinessCase-${altId}DataCenterLocation`}>
                  Which data center do you plan to host it at?
                </Label>
                <FieldErrorMsg>
                  {flatErrors[`${altId}.hosting.location`]}
                </FieldErrorMsg>
                <Field
                  as={TextField}
                  error={!!flatErrors[`${altId}.hosting.location`]}
                  id={`BusinessCase-${altId}DataCenterLocation`}
                  maxLength={50}
                  name={`${altId}.hosting.location`}
                />
              </FieldGroup>
            )}
            <Field
              as={RadioField}
              checked={altValues.hosting.type === 'none'}
              id={`BusinessCase-${altId}HostingNone`}
              name={`${altId}.hosting.type`}
              label="No, hosting is not needed"
              value="none"
              onChange={() => {
                setFieldValue(`${altId}.hosting.type`, 'none');
                setFieldValue(`${altId}.hosting.location`, '');
                setFieldValue(`${altId}.hosting.cloudServiceType`, '');
              }}
            />
          </fieldset>
        </FieldGroup>

        <FieldGroup
          scrollElement={`${altId}.hasUserInterface`}
          error={!!flatErrors[`${altId}.hasUserInterface`]}
        >
          <fieldset className="usa-fieldset margin-top-4">
            <legend className="usa-label margin-bottom-1">
              Will your solution have a User Interface?
            </legend>
            <FieldErrorMsg>
              {flatErrors[`${altId}.hasUserInterface`]}
            </FieldErrorMsg>

            <Field
              as={RadioField}
              checked={altValues.hasUserInterface === 'YES'}
              id={`BusinessCase-${altId}HasUserInferfaceYes`}
              name={`${altId}.hasUserInterface`}
              label={yesNoMap.YES}
              value="YES"
            />
            <Field
              as={RadioField}
              checked={altValues.hasUserInterface === 'NO'}
              id={`BusinessCase-${altId}HasUserInferfaceNo`}
              name={`${altId}.hasUserInterface`}
              label={yesNoMap.NO}
              value="NO"
            />

            <Field
              as={RadioField}
              checked={altValues.hasUserInterface === 'NOT_SURE'}
              id={`BusinessCase-${altId}HasUserInferfaceNotSure`}
              name={`${altId}.hasUserInterface`}
              label={yesNoMap.NOT_SURE}
              value="NOT_SURE"
            />
          </fieldset>
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
            this approach from other solutions
          </HelpText>
          <FieldErrorMsg>{flatErrors[`${altId}.pros`]}</FieldErrorMsg>
          <Field
            as={TextAreaField}
            error={!!flatErrors[`${altId}.pros`]}
            id={`BusinessCase-${altId}Pros`}
            maxLength={2000}
            name={`${altId}.pros`}
            aria-describedby={`BusinessCase-${altId}ProsCounter`}
          />
          <CharacterCounter
            id={`BusinessCase-${altId}ProsCounter`}
            characterCount={2000 - altValues.pros.length}
          />
        </FieldGroup>

        <FieldGroup
          scrollElement={`${altId}.cons`}
          error={!!flatErrors[`${altId}.cons`]}
        >
          <Label htmlFor={`BusinessCase-${altId}Cons`}>
            {`${altLabel}: Cons`}
          </Label>
          <HelpText className="margin-y-1">
            Identify any aspects of this solution that negatively impact this
            approach
          </HelpText>
          <FieldErrorMsg>{flatErrors[`${altId}.cons`]}</FieldErrorMsg>
          <Field
            as={TextAreaField}
            error={!!flatErrors[`${altId}.cons`]}
            id={`BusinessCase-${altId}Cons`}
            maxLength={2000}
            name={`${altId}.cons`}
            aria-describedby={`BusinessCase-${altId}ConsCounter`}
          />
          <CharacterCounter
            id={`BusinessCase-${altId}ConsCounter`}
            characterCount={2000 - altValues.cons.length}
          />
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
          formikKey={`${altId}.estimatedLifecycleCost`}
          years={altValues.estimatedLifecycleCost}
          errors={altErrors && altErrors.estimatedLifecycleCost}
        />
      </div>
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
            aria-describedby={`BusinessCase-${altId}CostSavingsCounter`}
          />
          <CharacterCounter
            id={`BusinessCase-${altId}CostSavingsCounter`}
            characterCount={2000 - altValues.costSavings.length}
          />
        </FieldGroup>

        {altLetter === 'A' && !values.alternativeB && (
          <>
            <h2 className="margin-bottom-1">Additional alternatives</h2>
            <HelpText>
              If you are buillding a multi-year project that will require
              significant upkeep, you may want to include more alternatives.
              Keep in mind that Government off-the-shelf and Commercial
              off-the-shelf products are acceptable alternatives to include.
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
