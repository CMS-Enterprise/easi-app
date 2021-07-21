import React from 'react';
import { Field, FormikProps } from 'formik';

import CharacterCounter from 'components/CharacterCounter';
import EstimatedLifecycleCost from 'components/EstimatedLifecycleCost';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import { RadioField } from 'components/shared/RadioField';
import TextAreaField from 'components/shared/TextAreaField';
import TextField from 'components/shared/TextField';
import { yesNoMap } from 'data/common';
import flattenErrors from 'utils/flattenErrors';

type AlternativeSolutionFieldsProps = {
  altLetter: string;
  businessCaseCreatedAt: string;
  formikProps: FormikProps<any>;
};

const AlternativeSolutionFields = ({
  altLetter,
  businessCaseCreatedAt,
  formikProps
}: AlternativeSolutionFieldsProps) => {
  const { values, errors = {}, setFieldValue } = formikProps;
  const altLabel = `Alternative ${altLetter}`;
  const altId = `alternative${altLetter}`;
  const flatErrors = flattenErrors(errors);

  return (
    <>
      <div data-testid="alternative-solution-fields">
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
          <HelpText
            id={`BusinessCase-${altId}SummaryHelp`}
            className="margin-top-1"
          >
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
            aria-describedby={`BusinessCase-${altId}SummmaryCounter BusinessCase-${altId}SummaryHelp`}
          />
          <CharacterCounter
            id={`BusinessCase-${altId}SummmaryCounter`}
            characterCount={2000 - values[`${altId}`].summary.length}
          />
        </FieldGroup>

        <FieldGroup
          scrollElement={`${altId}.acquisitionApproach`}
          error={!!flatErrors[`${altId}.acquisitionApproach`]}
        >
          <Label htmlFor={`BusinessCase-${altId}AcquisitionApproach`}>
            {`${altLabel}: Acquisition approach`}
          </Label>
          <HelpText
            id={`BusinessCase-${altId}AcquisitionApproachHelp`}
            className="margin-y-1"
          >
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
            aria-describedby={`BusinessCase-${altId}AcquisitionApproachCounter BusinessCase-${altId}AcquisitionApproachHelp`}
          />
          <CharacterCounter
            id={`BusinessCase-${altId}AcquisitionApproachCounter`}
            characterCount={
              2000 - values[`${altId}`].acquisitionApproach.length
            }
          />
        </FieldGroup>

        <FieldGroup
          scrollElement={`${altId}.security.isApproved`}
          error={!!flatErrors[`${altId}.security.isApproved`]}
          data-testid="security-approval"
        >
          <fieldset className="usa-fieldset margin-top-4">
            <legend className="usa-label">
              Is your solution approved by IT Security for use at CMS (FedRAMP,
              FISMA approved, within the CMS cloud enclave)?
            </legend>
            <FieldErrorMsg>
              {flatErrors[`${altId}.security.isApproved`]}
            </FieldErrorMsg>
            <Field
              as={RadioField}
              checked={values[`${altId}`].security.isApproved === true}
              id={`BusinessCase-${altId}SecurityApproved`}
              name={`${altId}.security.isApproved`}
              label={yesNoMap.YES}
              value
              onChange={() => {
                setFieldValue(`${altId}.security.isApproved`, true);
              }}
            />

            <Field
              as={RadioField}
              checked={values[`${altId}`].security.isApproved === false}
              id={`BusinessCase-${altId}SecurityNotApproved`}
              name={`${altId}.security.isApproved`}
              label={yesNoMap.NO}
              value={false}
              onChange={() => {
                setFieldValue(`${altId}.security.isApproved`, false);
                setFieldValue(`${altId}.security.isBeingReviewed`, '');
              }}
            />
          </fieldset>
        </FieldGroup>

        {values[`${altId}`].security.isApproved === false && (
          <FieldGroup
            scrollElement={`${altId}.security.isBeingReviewed`}
            error={!!flatErrors[`${altId}.security.isBeingReviewed`]}
            data-testid="security-approval-in-progress"
          >
            <fieldset className="usa-fieldset margin-top-4">
              <legend className="usa-label margin-bottom-1">
                Is it in the process of CMS approval?
              </legend>
              <HelpText id={`BusinessCase-${altId}SecurityReviewHelp`}>
                Obtaining CMS Approval can be lengthy and solutions that do not
                have it or are just starting may lead to longer project
                timelines.
              </HelpText>
              <FieldErrorMsg>
                {flatErrors[`${altId}.security.isBeingReviewed`]}
              </FieldErrorMsg>
              <Field
                as={RadioField}
                checked={values[`${altId}`].security.isBeingReviewed === 'YES'}
                id={`BusinessCase-${altId}SecurityIsBeingReviewedYed`}
                name={`${altId}.security.isBeingReviewed`}
                label={yesNoMap.YES}
                value="YES"
                aria-describedby={`BusinessCase-${altId}SecurityReviewHelp`}
              />
              <Field
                as={RadioField}
                checked={values[`${altId}`].security.isBeingReviewed === 'NO'}
                id={`BusinessCase-${altId}SecurityIsBeingReviewedNo`}
                name={`${altId}.security.isBeingReviewed`}
                label={yesNoMap.NO}
                value="NO"
              />
              <Field
                as={RadioField}
                checked={
                  values[`${altId}`].security.isBeingReviewed === 'NOT_SURE'
                }
                id={`BusinessCase-${altId}SecurityIsBeingReviewedNotSure`}
                name={`${altId}.security.isBeingReviewed`}
                label={yesNoMap.NOT_SURE}
                value="NOT_SURE"
              />
            </fieldset>
          </FieldGroup>
        )}

        <FieldGroup
          scrollElement={`${altId}.hosting.type`}
          error={!!flatErrors[`${altId}.hosting.type`]}
        >
          <fieldset className="usa-fieldset margin-top-4">
            <legend className="usa-label">
              Do you need to host your solution?
            </legend>
            <FieldErrorMsg>{flatErrors[`${altId}.hosting.type`]}</FieldErrorMsg>

            <Field
              as={RadioField}
              checked={values[`${altId}`].hosting.type === 'cloud'}
              id={`BusinessCase-${altId}HostingCloud`}
              name={`${altId}.hosting.type`}
              label="Yes, in the cloud (AWS, Azure, etc.)"
              value="cloud"
              onChange={() => {
                setFieldValue(`${altId}.hosting.type`, 'cloud');
                setFieldValue(`${altId}.hosting.location`, '');
                setFieldValue(`${altId}.hosting.cloudServiceType`, '');
              }}
            />
            {values[`${altId}`].hosting.type === 'cloud' && (
              <>
                <FieldGroup
                  className="margin-y-1 margin-left-4"
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
                  className="margin-bottom-1 margin-left-4"
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
              checked={values[`${altId}`].hosting.type === 'dataCenter'}
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
            {values[`${altId}`].hosting.type === 'dataCenter' && (
              <FieldGroup
                className="margin-y-1 margin-left-4"
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
              checked={values[`${altId}`].hosting.type === 'none'}
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
          data-testid="user-interface-group"
        >
          <fieldset className="usa-fieldset margin-top-4">
            <legend className="usa-label">
              Will your solution have a User Interface?
            </legend>
            <FieldErrorMsg>
              {flatErrors[`${altId}.hasUserInterface`]}
            </FieldErrorMsg>

            <Field
              as={RadioField}
              checked={values[`${altId}`].hasUserInterface === 'YES'}
              id={`BusinessCase-${altId}HasUserInferfaceYes`}
              name={`${altId}.hasUserInterface`}
              label={yesNoMap.YES}
              value="YES"
            />
            <Field
              as={RadioField}
              checked={values[`${altId}`].hasUserInterface === 'NO'}
              id={`BusinessCase-${altId}HasUserInferfaceNo`}
              name={`${altId}.hasUserInterface`}
              label={yesNoMap.NO}
              value="NO"
            />

            <Field
              as={RadioField}
              checked={values[`${altId}`].hasUserInterface === 'NOT_SURE'}
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
          <HelpText id={`BusinessCase-${altId}ProsHelp`} className="margin-y-1">
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
            aria-describedby={`BusinessCase-${altId}ProsCounter BusinessCase-${altId}ProsHelp`}
          />
          <CharacterCounter
            id={`BusinessCase-${altId}ProsCounter`}
            characterCount={2000 - values[`${altId}`].pros.length}
          />
        </FieldGroup>

        <FieldGroup
          scrollElement={`${altId}.cons`}
          error={!!flatErrors[`${altId}.cons`]}
        >
          <Label htmlFor={`BusinessCase-${altId}Cons`}>
            {`${altLabel}: Cons`}
          </Label>
          <HelpText id={`BusinessCase-${altId}ConsHelp`} className="margin-y-1">
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
            aria-describedby={`BusinessCase-${altId}ConsHelp BusinessCase-${altId}ConsCounter`}
          />
          <CharacterCounter
            id={`BusinessCase-${altId}ConsCounter`}
            characterCount={2000 - values[`${altId}`].cons.length}
          />
        </FieldGroup>
      </div>
      <div className="margin-top-2">
        <h2 className="margin-0">Estimated lifecycle cost</h2>
        <HelpText id="BusinessCase-EstimatedLifecycleCostHelp">
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
          years={values[`${altId}`].estimatedLifecycleCost}
          businessCaseCreatedAt={businessCaseCreatedAt}
          errors={
            errors &&
            errors[`${altId}`] &&
            // @ts-ignore
            errors[`${altId}`].estimatedLifecycleCost
          }
          setFieldValue={setFieldValue}
        />
      </div>
      <div className="margin-top-2 margin-bottom-7">
        <FieldGroup
          scrollElement={`${altId}.costSavings`}
          error={!!flatErrors[`${altId}.costSavings`]}
        >
          <Label htmlFor={`BusinessCase-${altId}CostSavings`}>
            What is the cost savings or avoidance associated with this solution?
          </Label>
          <HelpText
            id={`BusinessCase-${altId}CostSavingsHelp`}
            className="margin-y-1"
          >
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
            aria-describedby={`BusinessCase-${altId}CostSavingsCounter BusinessCase-${altId}CostSavingsHelp`}
          />
          <CharacterCounter
            id={`BusinessCase-${altId}CostSavingsCounter`}
            characterCount={2000 - values[`${altId}`].costSavings.length}
          />
        </FieldGroup>
      </div>
    </>
  );
};

export default AlternativeSolutionFields;
