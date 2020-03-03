import React from 'react';
import { Field, FormikProps } from 'formik';
import { SystemIntakeForm } from '../../../types/systemIntake';
import TextField from '../../../components/shared/TextField';
import HelpText from '../../../components/shared/HelpText';
import TextAreaField from '../../../components/shared/TextAreaField';
import {
  DropdownField,
  DropdownItem
} from '../../../components/shared/DropdownField';
import processStages from '../../../constants/enums/processStages';
import { RadioField } from '../../../components/shared/RadioField';
import AccordionLink from '../../../components/shared/AccordionLink';

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
        <Field
          as={TextField}
          id="IntakeForm-ProjectName"
          label="Project Name"
          maxLength={50}
          name="projectName"
        />

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
            checked={values.fundingSource.isFunded}
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
              <Field
                as={TextField}
                id="IntakeForm-FundingNumber"
                label="Funding Number"
                maxLength={6}
                name="fundingSource.fundingNumber"
              />
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

        <Field
          as={TextAreaField}
          id="IntakeForm-BusinessNeed"
          maxLength={2000}
          label="What is your business need?"
          helpText={
            <p>
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
            </p>
          }
          name="businessNeed"
        />
        <Field
          as={TextAreaField}
          id="IntakeForm-BusinessSolution"
          maxLength={2000}
          label="How are you thinking of solving it?"
          helpText="Let us know if you have a solution in mind"
          name="businessSolution"
        />
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
            checked={values.needsEaSupport}
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

          <AccordionLink label="test">Test</AccordionLink>
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
