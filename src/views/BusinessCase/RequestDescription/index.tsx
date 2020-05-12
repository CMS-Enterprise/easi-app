import React from 'react';
import { Field, FormikProps } from 'formik';
import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import FieldGroup from 'components/shared/FieldGroup';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import HelpText from 'components/shared/HelpText';
import { BidnessCaseModel } from 'types/bidnessCase';
import flattenErrors from 'utils/flattenErrors';

type RequestDescriptionProps = {
  formikProps: FormikProps<BidnessCaseModel>;
};

const RequestDescription = ({ formikProps }: RequestDescriptionProps) => {
  const { values, errors } = formikProps;
  const flatErrors = flattenErrors(errors);
  return (
    <div className="grid-container">
      <h1 className="font-heading-xl">Request description</h1>
      <div className="tablet:grid-col-9 margin-bottom-7">
        <FieldGroup
          scrollElement="bidnessNeed"
          error={!!flatErrors.bidnessNeed}
        >
          <Label htmlFor="BidnessCase-BidnessNeed">
            What is your bidness or user need?
          </Label>
          <HelpText className="margin-y-1">
            <span>Include:</span>
            <ul className="margin-top-1 padding-left-205">
              <li>
                a detailed explanation of the bidness need/issue/problem that
                the request will address
              </li>
              <li>
                any legislative mandates or regulations that needs to be met
              </li>
              <li>
                any expected benefits from the investment of organizational
                resources into the request
              </li>
              <li>
                relevant deadlines (e.g., statutory deadlines that CMS must
                meet)
              </li>
              <li>
                and the benefits of developing an IT solution for this need
              </li>
            </ul>
          </HelpText>
          <FieldErrorMsg>{flatErrors.bidnessNeed}</FieldErrorMsg>
          <Field
            as={TextAreaField}
            error={!!flatErrors.bidnessNeed}
            id="BidnessCase-BidnessNeed"
            maxLength={2000}
            name="bidnessNeed"
          />
          <HelpText className="margin-top-1">{`${2000 -
            values.bidnessNeed.length} characters left`}</HelpText>
        </FieldGroup>

        <FieldGroup scrollElement="cmsBenefit" error={!!flatErrors.cmsBenefit}>
          <Label htmlFor="BidnessCase-CmsBenefit">
            How will CMS benefit from this effort?
          </Label>
          <HelpText className="margin-y-1">
            Provide a summary of how this effort benefits CMS. Include any
            information on how it supports CMS&apos; mission and strategic
            goals, creates efficiencies and/or cost savings, or reduces risk
          </HelpText>
          <FieldErrorMsg>{flatErrors.cmsBenefit}</FieldErrorMsg>
          <Field
            as={TextAreaField}
            error={!!flatErrors.cmsBenefit}
            id="BidnessCase-CmsBenefit"
            maxLength={2000}
            name="cmsBenefit"
          />
          <HelpText className="margin-top-1">{`${2000 -
            values.cmsBenefit.length} characters left`}</HelpText>
        </FieldGroup>

        <FieldGroup
          scrollElement="priorityAlignment"
          error={!!flatErrors.priorityAlignment}
        >
          <Label htmlFor="BidnessCase-PriorityAlignment">
            How does this effort algin with organizational priorities?
          </Label>
          <HelpText className="margin-y-1">
            List out any administrator priorities or new legislative/regulatory
            mandates this effort supports. If applicable, include any relevant
            deadlines
          </HelpText>
          <FieldErrorMsg>{flatErrors.priorityAlignment}</FieldErrorMsg>
          <Field
            as={TextAreaField}
            error={!!flatErrors.priorityAlignment}
            id="BidnessCase-PriorityAlignment"
            maxLength={2000}
            name="priorityAlignment"
          />
          <HelpText className="margin-top-1">{`${2000 -
            values.priorityAlignment.length} characters left`}</HelpText>
        </FieldGroup>

        <FieldGroup
          scrollElement="successIndicators"
          error={!!flatErrors.successIndicators}
        >
          <Label htmlFor="BidnessCase-SuccessIndicators">
            How will you determine whether or not this effort is successful?
          </Label>
          <HelpText className="margin-y-1">
            Include any indicators that you think would demonstrate success
          </HelpText>
          <FieldErrorMsg>{flatErrors.successIndicators}</FieldErrorMsg>
          <Field
            as={TextAreaField}
            error={!!flatErrors.successIndicators}
            id="BidnessCase-SuccessIndicators"
            maxLength={2000}
            name="successIndicators"
          />
          <HelpText className="margin-top-1">{`${2000 -
            values.successIndicators.length} characters left`}</HelpText>
        </FieldGroup>
      </div>
    </div>
  );
};

export default RequestDescription;
