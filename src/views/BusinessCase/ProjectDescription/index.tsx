import React from 'react';
import { Field, FormikProps } from 'formik';
import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import FieldGroup from 'components/shared/FieldGroup';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import HelpText from 'components/shared/HelpText';
import { BusinessCaseModel } from 'types/businessCase';

type ProjectDescriptionProps = {
  formikProps: FormikProps<BusinessCaseModel>;
};

const ProjectDescription = ({ formikProps }: ProjectDescriptionProps) => {
  return (
    <>
      <h1 className="font-heading-xl">Project Description</h1>
      <div className="tablet:grid-col-9 margin-bottom-7">
        <FieldGroup scrollElement="businessNeed" error={false}>
          <Label htmlFor="BusinessCase-BusinessNeed">
            What is your business or user need?
          </Label>
          <HelpText className="margin-y-1">
            Provide a detailed explanation of the business need/issue/problem
            that the requested project will address, including any legislative
            mandates, regulations, etc.
          </HelpText>
          <FieldErrorMsg />
          <Field
            as={TextAreaField}
            error={false}
            id="BusinessCase-BusinessNeed"
            maxLength={1000}
            name="businessNeed"
          />
        </FieldGroup>

        <FieldGroup scrollElement="cmsBenefit" error={false}>
          <Label htmlFor="BusinessCase-CmsBenefit">
            How will CMS benefit from this effort?
          </Label>
          <HelpText className="margin-y-1">
            Provide a summary of how this effort benefits CMS. Include any
            information on how it supports CMS&apos; mission and strategic
            goals, creates efficiencies and/or cost savings, or reduces risk.
          </HelpText>
          <FieldErrorMsg />
          <Field
            as={TextAreaField}
            error={false}
            id="BusinessCase-CmsBenefit"
            maxLength={1000}
            name="cmsBenefit"
          />
        </FieldGroup>

        <FieldGroup scrollElement="priorityAlignment" error={false}>
          <Label htmlFor="BusinessCase-PriorityAlignment">
            How does this effort algin with organizational priorities?
          </Label>
          <HelpText className="margin-y-1">
            Does this effort support any administrator priorities or new
            legislative or regulatory mandates? Include any relevant deadlines.
          </HelpText>
          <FieldErrorMsg />
          <Field
            as={TextAreaField}
            error={false}
            id="BusinessCase-PriorityAlignment"
            maxLength={1000}
            name="priorityAlignment"
          />
        </FieldGroup>

        <FieldGroup scrollElement="successIndicators" error={false}>
          <Label htmlFor="BusinessCase-SuccessIndicators">
            How will you determine whether or not this effort is successful?
          </Label>
          <HelpText className="margin-y-1">
            Include any indicators that you think would demonstrate success.
          </HelpText>
          <FieldErrorMsg />
          <Field
            as={TextAreaField}
            error={false}
            id="BusinessCase-SuccessIndicators"
            maxLength={1000}
            name="successIndicators"
          />
        </FieldGroup>
      </div>
    </>
  );
};

export default ProjectDescription;
