import React from 'react';
import { Field, FormikProps } from 'formik';
import Label from 'components/shared/Label';
import HelpText from 'components/shared/HelpText';
import TextField from 'components/shared/TextField';
import TextAreaField from 'components/shared/TextAreaField';
import { RadioField } from 'components/shared/RadioField';
import FieldGroup from 'components/shared/FieldGroup';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import EstimatedLifecycleCost from 'components/EstimatedLifecycleCost';
import { BusinessCaseModel } from 'types/businessCase';
import flattenErrors from 'utils/flattenErrors';
import MandatoryFieldsAlert from 'components/MandatoryFieldsAlert';
import CharacterCounter from 'components/CharacterCounter';

type PreferredSolutionProps = {
  formikProps: FormikProps<BusinessCaseModel>;
};
const PreferredSolution = ({ formikProps }: PreferredSolutionProps) => {
  const { values, errors, setFieldValue } = formikProps;
  console.log(values);
  const flatErrors = flattenErrors(errors);

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
            aria-describedby="BusinessCase-PreferredSolutionSummaryCounter"
          />
          <CharacterCounter
            id="BusinessCase-PreferredSolutionSummaryCounter"
            characterCount={2000 - values.preferredSolution.summary.length}
          />
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
            aria-describedby="BusinessCase-PreferredSolutionAcquisitionApproachCounter"
          />
          <CharacterCounter
            id="BusinessCase-PreferredSolutionAcquisitionApproachCounter"
            characterCount={
              2000 - values.preferredSolution.acquisitionApproach.length
            }
          />
        </FieldGroup>

        <FieldGroup
          scrollElement="preferredSolution.hosting.type"
          error={!!flatErrors['preferredSolution.hosting.type']}
        >
          <fieldset className="usa-fieldset margin-top-4">
            <legend className="usa-label margin-bottom-1">
              Do you need to host your solution?
            </legend>
            <FieldErrorMsg>
              {flatErrors['preferredSolution.hosting.type']}
            </FieldErrorMsg>

            <Field
              as={RadioField}
              checked={values.preferredSolution.hosting.type === 'cloud'}
              id="BusinessCase-PreferredSolutionHostingCloud"
              name="preferredSolution.hosting.type"
              label="Yes, in the cloud (AWS, Azure, etc.)"
              value="cloud"
              onChange={() => {
                setFieldValue('preferredSolution.hosting.type', 'cloud');
                setFieldValue('preferredSolution.hosting.location', '');
                setFieldValue('preferredSolution.hosting.cloudServiceType', '');
              }}
            />
            {values.preferredSolution.hosting.type === 'cloud' && (
              <>
                <FieldGroup
                  className="margin-top-neg-2 margin-bottom-1 margin-left-4"
                  scrollElement="preferredSolution.hosting.location"
                  error={!!flatErrors['preferredSolution.hosting.location']}
                >
                  <Label htmlFor="BusinessCase-PreferredSolutiohnCloudLocation">
                    Where are you planning to host?
                  </Label>
                  <FieldErrorMsg>
                    {flatErrors['preferredSolution.hosting.location']}
                  </FieldErrorMsg>
                  <Field
                    as={TextField}
                    error={!!flatErrors['preferredSolution.hosting.location']}
                    id="BusinessCase-PreferredSolutionCloudLocation"
                    maxLength={50}
                    name="preferredSolution.hosting.location"
                  />
                </FieldGroup>
                <FieldGroup
                  className="margin-top-neg-2 margin-bottom-1 margin-left-4"
                  scrollElement="preferredSolution.hosting.cloudServiceType"
                  error={
                    !!flatErrors['preferredSolution.hosting.cloudServiceType']
                  }
                >
                  <Label htmlFor="BusinessCase-PreferredSolutionCloudServiceType">
                    What, if any, type of cloud service are you planning to use
                    for this solution (Iaas, PaaS, SaaS, etc.)?
                  </Label>
                  <FieldErrorMsg>
                    {flatErrors['preferredSolution.hosting.cloudServiceType']}
                  </FieldErrorMsg>
                  <Field
                    as={TextField}
                    error={
                      !!flatErrors['preferredSolution.hosting.cloudServiceType']
                    }
                    id="BusinessCase-PreferredSolutionCloudServiceType"
                    maxLength={50}
                    name="preferredSolution.hosting.cloudServiceType"
                  />
                </FieldGroup>
              </>
            )}
            <Field
              as={RadioField}
              checked={values.preferredSolution.hosting.type === 'dataCenter'}
              id="BusinessCase-PreferredSolutionHostingDataCenter"
              name="preferredSolution.hosting.type"
              label="Yes, at a data center"
              value="dataCenter"
              onChange={() => {
                setFieldValue('preferredSolution.hosting.type', 'dataCenter');
                setFieldValue('preferredSolution.hosting.location', '');
                setFieldValue('preferredSolution.hosting.cloudServiceType', '');
              }}
            />
            {values.preferredSolution.hosting.type === 'dataCenter' && (
              <FieldGroup
                className="margin-top-neg-2 margin-bottom-1 margin-left-4"
                scrollElement="preferredSolution.hosting.location"
                error={!!flatErrors['preferredSolution.hosting.location']}
              >
                <Label htmlFor="BusinessCase-PreferredSolutionDataCenterLocation">
                  Which data center do you plan to host it at?
                </Label>
                <FieldErrorMsg>
                  {flatErrors['preferredSolution.hosting.location']}
                </FieldErrorMsg>
                <Field
                  as={TextField}
                  error={!!flatErrors['preferredSolution.hosting.location']}
                  id="BusinessCase-PreferredSolutionDataCenterLocation"
                  maxLength={50}
                  name="preferredSolution.hosting.location"
                />
              </FieldGroup>
            )}
            <Field
              as={RadioField}
              checked={values.preferredSolution.hosting.type === 'none'}
              id="BusinessCase-PreferredSolutionHostingNone"
              name="preferredSolution.hosting.type"
              label="No, hosting is not needed"
              value="none"
              onChange={() => {
                setFieldValue('preferredSolution.hosting.type', 'none');
                setFieldValue('preferredSolution.hosting.location', '');
                setFieldValue('preferredSolution.hosting.cloudServiceType', '');
              }}
            />
          </fieldset>
        </FieldGroup>

        <FieldGroup
          scrollElement="preferredSolution.hasUserInterface"
          error={!!flatErrors['preferredSolution.hasUserInterface']}
        >
          <fieldset className="usa-fieldset margin-top-4">
            <legend className="usa-label margin-bottom-1">
              Will your solution have a User Interface?
            </legend>
            <FieldErrorMsg>
              {flatErrors['preferredSolution.hasUserInterface']}
            </FieldErrorMsg>

            <Field
              as={RadioField}
              checked={values.preferredSolution.hasUserInterface === 'YES'}
              id="BusinessCase-PreferredHasUserInferfaceYes"
              name="preferredSolution.hasUserInterface"
              label="Yes"
              value="YES"
            />
            <Field
              as={RadioField}
              checked={values.preferredSolution.hasUserInterface === 'NO'}
              id="BusinessCase-PreferredHasUserInferfaceNo"
              name="preferredSolution.hasUserInterface"
              label="No"
              value="NO"
            />

            <Field
              as={RadioField}
              checked={values.preferredSolution.hasUserInterface === 'NOT_SURE'}
              id="BusinessCase-PreferredHasUserInferfaceNotSure"
              name="preferredSolution.hasUserInterface"
              label="I'm not sure"
              value="NOT_SURE"
            />
          </fieldset>
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
            aria-describedby="BusinessCase-PreferredSolutionProsCounter"
          />
          <CharacterCounter
            id="BusinessCase-PreferredSolutionProsCounter"
            characterCount={2000 - values.preferredSolution.pros.length}
          />
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
            aria-describedby="BusinessCase-PreferredSolutionConsCounter"
          />
          <CharacterCounter
            id="BusinessCase-PreferredSolutionConsCounter"
            characterCount={2000 - values.preferredSolution.cons.length}
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
            aria-describedby="BusinessCase-PreferredSolutionCostSavingsCounter"
          />
          <CharacterCounter
            id="BusinessCase-PreferredSolutionCostSavingsCounter"
            characterCount={2000 - values.preferredSolution.costSavings.length}
          />
        </FieldGroup>
      </div>
    </div>
  );
};

export default PreferredSolution;
