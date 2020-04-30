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
import flattenErrors from 'utils/flattenErrors';

type RequestDetailsProps = {
  formikProps: FormikProps<SystemIntakeForm>;
};

const RequestDetails = ({ formikProps }: RequestDetailsProps) => {
  const { values, errors, setFieldValue } = formikProps;
  const flatErrors = flattenErrors(errors);

  return (
    <>
      <h1 className="font-heading-xl margin-top-4">Request Details</h1>
      <p className="line-height-body-6">
        Provide a detailed explanation of the business need/issue/problem that
        the requested project will address, including any legislative mandates,
        regulations, etc. Include any expected benefits from the investment of
        organizational resources into this project. Please be sure to indicate
        clearly any/all relevant deadlines (e.g., statutory deadlines that CMS
        must meet). Explain the benefits of developing an IT solution for this
        need.
      </p>
      <div className="tablet:grid-col-9 margin-bottom-7">
        <FieldGroup
          scrollElement="projectName"
          error={!!flatErrors.projectName}
        >
          <Label htmlFor="IntakeForm-ProjectName">Project Name</Label>
          <FieldErrorMsg>{flatErrors.projectName}</FieldErrorMsg>
          <Field
            as={TextField}
            error={!!flatErrors.projectName}
            id="IntakeForm-ProjectName"
            maxLength={50}
            name="projectName"
          />
        </FieldGroup>

        <FieldGroup
          scrollElement="fundingSource.isFunded"
          error={!!flatErrors['fundingSource.isFunded']}
        >
          <fieldset className="usa-fieldset margin-top-4">
            <legend className="usa-label margin-bottom-1">
              Is this project funded from an existing funding source?
            </legend>
            <HelpText className="margin-bottom-1">
              If yes, please provide your six digit funding number found [TBA
              this is where you find it]
            </HelpText>
            <FieldErrorMsg>
              {flatErrors['fundingSource.isFunded']}
            </FieldErrorMsg>
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
              <div className="width-card margin-top-neg-2 margin-left-4 margin-bottom-1">
                <FieldGroup
                  scrollElement="fundingSource.fundingNumber"
                  error={!!flatErrors['fundingSource.fundingNumber']}
                >
                  <Label htmlFor="IntakeForm-FundingNumber">
                    Funding Number
                  </Label>
                  <FieldErrorMsg>
                    {flatErrors['fundingSource.fundingNumber']}
                  </FieldErrorMsg>
                  <Field
                    as={TextField}
                    error={!!flatErrors['fundingSource.fundingNumber']}
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
        </FieldGroup>

        <FieldGroup
          scrollElement="businessNeed"
          error={!!flatErrors.businessNeed}
        >
          <Label htmlFor="IntakeForm-BusinessNeed">
            What is your business need?
          </Label>
          <HelpText className="margin-top-105">
            <>
              <span>Include:</span>
              <ul className="margin-top-1 padding-left-205">
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
            </>
          </HelpText>
          <FieldErrorMsg>{flatErrors.businessNeed}</FieldErrorMsg>
          <Field
            as={TextAreaField}
            className="system-intake__textarea"
            error={!!flatErrors.businessNeed}
            id="IntakeForm-BusinessNeed"
            maxLength={2000}
            name="businessNeed"
          />
          <HelpText className="margin-top-1">{`${2000 -
            values.businessNeed.length} characters left`}</HelpText>
        </FieldGroup>

        <FieldGroup
          scrollElement="businessSolution"
          error={!!flatErrors.businessSolution}
        >
          <Label htmlFor="IntakeForm-BusinessSolution">
            How are you thinking of solving it?
          </Label>
          <HelpText className="margin-y-1">
            Let us know if you have a solution in mind
          </HelpText>
          <FieldErrorMsg>{flatErrors.businessSolution}</FieldErrorMsg>
          <Field
            as={TextAreaField}
            className="system-intake__textarea"
            error={!!flatErrors.businessSolution}
            id="IntakeForm-BusinessSolution"
            maxLength={2000}
            name="businessSolution"
          />
          <HelpText className="margin-top-1">{`${2000 -
            values.businessSolution.length} characters left`}</HelpText>
        </FieldGroup>

        <FieldGroup
          scrollElement="currentStage"
          error={!!flatErrors.currentStage}
        >
          <Label htmlFor="IntakeForm-CurrentStage">
            Where are you in the process?
          </Label>
          <FieldErrorMsg>{flatErrors.CurrentStage}</FieldErrorMsg>
          <Field
            as={DropdownField}
            error={!!flatErrors.currentStage}
            id="IntakeForm-CurrentStage"
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
        </FieldGroup>

        <FieldGroup
          scrollElement="needsEaSupport"
          error={!!flatErrors.needsEaSupport}
        >
          <fieldset className="usa-fieldset margin-top-4">
            <legend className="usa-label margin-bottom-1">
              Does your project need Enterprise Architecture (EA) support?
            </legend>
            <HelpText className="margin-bottom-1">
              If you are unsure, mark &quot;Yes&quot; and someone from the EA
              team will assess your needs.
            </HelpText>
            <FieldErrorMsg>{flatErrors.needsEaSupport}</FieldErrorMsg>
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
              <div>
                CMS&apos; Enterprise Architecture (EA) function will help you
                build your Business Case by addressing the following:
                <ul className="margin-bottom-0">
                  <li>
                    Explore business solutions that might exist elsewhere within
                    CMS
                  </li>
                  <li>Discuss lessons learned from similar projects</li>
                  <li>
                    Give you and your team an enterprise-level view of the
                    agency to avoid duplication of projects
                  </li>
                  <li>
                    Help you explore alternatives you might not have thought of
                  </li>
                  <li>Model your business processes and document workflows</li>
                </ul>
              </div>
            </CollapsableLink>
          </fieldset>
        </FieldGroup>

        <FieldGroup
          scrollElement="hasContract"
          error={!!flatErrors.hasContract}
        >
          <Label htmlFor="IntakeForm-HasContract">
            Do you have a contract in place to support this effort?
          </Label>
          <FieldErrorMsg>{flatErrors.hasContract}</FieldErrorMsg>
          <Field
            as={DropdownField}
            error={!!flatErrors.hasContract}
            id="IntakeForm-HasContract"
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
            <Field
              as={DropdownItem}
              key="HasContract-No"
              name="No"
              value="No"
            />
            <Field
              as={DropdownItem}
              key="HasContract-StatementOfWork"
              name="No, but I have a Statement of Work/Objectives"
              value="No, but I have a Statement of Work/Objectives"
            />
          </Field>
        </FieldGroup>
      </div>
    </>
  );
};

export default RequestDetails;
