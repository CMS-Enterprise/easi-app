import React from 'react';
import { Field, FormikProps } from 'formik';
import { SystemIntakeForm } from 'types/systemIntake';
import { RadioField } from 'components/shared/RadioField';
import { DropdownField, DropdownItem } from 'components/shared/DropdownField';
import Label from 'components/shared/Label';
import TextField from 'components/shared/TextField';
import FieldGroup from 'components/shared/FieldGroup';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import HelpText from 'components/shared/HelpText';
import TextAreaField from 'components/shared/TextAreaField';
import processStages from 'constants/enums/processStages';
import CollapsableLink from 'components/shared/CollapsableLink';

type RequestDetailsProps = {
  formikProps: FormikProps<SystemIntakeForm>;
};

const RequestDetails = ({ formikProps }: RequestDetailsProps) => {
  const { values, setFieldValue } = formikProps;

  return (
    <>
      <h2 className="font-heading-xl">Request Details</h2>
      <p className="line-height-body-6">
        Provide a detailed explanation of the business need/issue/problem that
        the requested project will address, including any legislative mandates,
        regulations, etc. Include any expected benefits from the investment of
        organizational resources into this project. Please be sure to indicate
        clearly any/all relevant deadlines (e.g., statutory deadlines that CMS
        must meet). Explain the benefits of developing an IT solution for this
        need.
      </p>
      <div className="grid-col-8 margin-bottom-7">
        <FieldGroup error={false}>
          <Label htmlFor="IntakeForm-ProjectName" error={false}>
            Project Name
          </Label>
          <FieldErrorMsg errorMsg="" />
          <Field
            as={TextField}
            id="IntakeForm-ProjectName"
            maxLength={50}
            name="projectName"
          />
        </FieldGroup>

        <fieldset className="usa-fieldset margin-top-3">
          <legend className="usa-label margin-bottom-1">
            Is this project funded from an existing funding source?
          </legend>
          <HelpText>
            If yes, please provide your six digit funding number found [TBA this
            is where you find it]
          </HelpText>

          <Field
            as={RadioField}
            checked={values.fundingSource.isFunded === true}
            id="IntakeForm-HasFundingSourceYes"
            name="fundingSource.isFunded"
            label="Yes"
            onChange={() => {
              setFieldValue('fundingSource.isFunded', true);
            }}
            value
          />
          {values.fundingSource.isFunded && (
            <div className="width-card margin-top-neg-2 margin-left-3 margin-bottom-1">
              <FieldGroup error={false}>
                <Label htmlFor="IntakeForm-FundingNumber" error={false}>
                  Funding Number
                </Label>
                <FieldErrorMsg errorMsg="" />
                <Field
                  as={TextField}
                  id="IntakeForm-FundingNumber"
                  maxLength={6}
                  name="fundingSource.fundingNumber"
                />
              </FieldGroup>
            </div>
          )}
          <Field
            as={RadioField}
            checked={values.fundingSource.isFunded === false}
            id="IntakeForm-HasFundingSourceNo"
            name="fundingSource.isFunded"
            label="No"
            onChange={() => {
              setFieldValue('fundingSource.isFunded', false);
              setFieldValue('fundingSource.fundingNumber', '');
            }}
            value={false}
          />
        </fieldset>

        <Label htmlFor="IntakeForm-BusinessNeed">
          What is your business need?
        </Label>
        <HelpText>
          <span>
            Include:
            <br />
            <ul>
              <li>
                a detailed explanation of the business need/issue/problem that
                the project will address
              </li>
              <li>
                any legislative mandates or regulations that needs to be met
              </li>
              <li>
                any expected benefits from the investment of organizational
                resources into the project
              </li>
              <li>
                relevant deadlines (e.g., statutory deadlines that CMS must
                meet)
              </li>
              <li>
                and the benefits of developing an IT solution for this need
              </li>
            </ul>
          </span>
        </HelpText>
        <Field
          as={TextAreaField}
          id="IntakeForm-BusinessNeed"
          maxLength={2000}
          name="businessNeed"
        />
        <HelpText>{`${2000 -
          values.businessNeed.length} characters left`}</HelpText>

        <Label htmlFor="IntakeForm-BusinessSolution">
          How are you thinking of solving it?
        </Label>
        <HelpText>Let us know if you have a solution in mind</HelpText>
        <Field
          as={TextAreaField}
          id="IntakeForm-BusinessSolution"
          maxLength={2000}
          name="businessSolution"
        />
        <HelpText>{`${2000 -
          values.businessSolution.length} characters left`}</HelpText>

        <Field
          as={DropdownField}
          id="IntakeForm-CurrentStage"
          label="Where are you in the process?"
          name="currentStage"
        >
          <Field as={DropdownItem} name="Select" value="" />
          {processStages.map(stage => (
            <Field
              as={DropdownItem}
              key={`ProcessStageComponent-${stage.value}`}
              name={stage.name}
              value={stage.name}
            />
          ))}
        </Field>

        <fieldset className="usa-fieldset margin-top-3">
          <legend className="usa-label margin-bottom-1">
            Does your project need Enterprise Architecture support?
          </legend>
          <HelpText>
            If you are unsure, mark &quot;Yes&quot; and someone from the EA team
            will assess your needs.
          </HelpText>

          <Field
            as={RadioField}
            checked={values.needsEaSupport === true}
            id="IntakeForm-NeedsEaSupportYes"
            name="needsEaSupport"
            label="Yes"
            onChange={() => {
              setFieldValue('needsEaSupport', true);
            }}
            value
          />

          <Field
            as={RadioField}
            checked={values.needsEaSupport === false}
            id="IntakeForm-NeedsEaSupportNo"
            name="needsEaSupport"
            label="No"
            onChange={() => {
              setFieldValue('needsEaSupport', false);
            }}
            value={false}
          />

          <CollapsableLink label="How can the Enterprise Architecture team help me?">
            <p>
              CMS&apos; Enterprise Architecture (EA) function will help you
              build your Business Case by addressing the following:
              <ul>
                <li>
                  Explore business solutions that might exist elsewhere within
                  CMS
                </li>
                <li>Discuss lessons learned from similar projects</li>
                <li>
                  Give you and your team an enterprise-level view of the agency
                  to avoid duplication of projects
                </li>
                <li>
                  Help you explore alternatives you might not have thought of
                </li>
                <li>Model your business processes and document workflows</li>
              </ul>
            </p>
          </CollapsableLink>
        </fieldset>

        <Field
          as={DropdownField}
          id="IntakeForm-HasContract"
          label="Do you have a contract in place to support this effort?"
          helpText="This information helps the Office of Acquisition and Grants Management (OAGM) track work"
          name="hasContract"
        >
          <Field as={DropdownItem} name="Select" value="" />
          <Field
            as={DropdownItem}
            key="HasContract-Yes"
            name="Yes"
            value="Yes"
          />
          <Field as={DropdownItem} key="HasContract-No" name="No" value="No" />
          <Field
            as={DropdownItem}
            key="HasContract-StatementOfWork"
            name="No, but I have a Statement of Work/Objectives"
            value="StatementOfWork"
          />
        </Field>
      </div>
    </>
  );
};

export default RequestDetails;
