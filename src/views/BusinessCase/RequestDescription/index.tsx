import React from 'react';
import { Field, FormikProps } from 'formik';

import CharacterCounter from 'components/CharacterCounter';
import MandatoryFieldsAlert from 'components/MandatoryFieldsAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import { BusinessCaseModel } from 'types/businessCase';
import flattenErrors from 'utils/flattenErrors';

type RequestDescriptionProps = {
  formikProps: FormikProps<BusinessCaseModel>;
};

const RequestDescription = ({ formikProps }: RequestDescriptionProps) => {
  const { values, errors } = formikProps;
  const flatErrors = flattenErrors(errors);
  return (
    <div className="grid-container">
      <h1 className="font-heading-xl">Request description</h1>
      <div className="tablet:grid-col-5">
        <MandatoryFieldsAlert />
      </div>
      <div className="tablet:grid-col-9 margin-bottom-7">
        <FieldGroup
          scrollElement="businessNeed"
          error={!!flatErrors.businessNeed}
        >
          <Label htmlFor="BusinessCase-BusinessNeed">
            What is your business or user need?
          </Label>
          <HelpText className="margin-y-1">
            <span>Include:</span>
            <ul className="margin-top-1 padding-left-205">
              <li>
                a detailed explanation of the business need/issue/problem that
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
          <FieldErrorMsg>{flatErrors.businessNeed}</FieldErrorMsg>
          <Field
            as={TextAreaField}
            error={!!flatErrors.businessNeed}
            id="BusinessCase-BusinessNeed"
            maxLength={2000}
            name="businessNeed"
            aria-describedby="BusinessCase-BusinessNeedCounter"
          />
          <CharacterCounter
            id="BusinessCase-BusinessNeedCounter"
            characterCount={2000 - values.businessNeed.length}
          />
        </FieldGroup>

        <FieldGroup scrollElement="cmsBenefit" error={!!flatErrors.cmsBenefit}>
          <Label htmlFor="BusinessCase-CmsBenefit">
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
            id="BusinessCase-CmsBenefit"
            maxLength={2000}
            name="cmsBenefit"
            aria-describedby="BusinessCase-CmsBenefitCounter"
          />
          <CharacterCounter
            id="BusinessCase-CmsBenefitCounter"
            characterCount={2000 - values.cmsBenefit.length}
          />
        </FieldGroup>

        <FieldGroup
          scrollElement="priorityAlignment"
          error={!!flatErrors.priorityAlignment}
        >
          <Label htmlFor="BusinessCase-PriorityAlignment">
            How does this effort align with organizational priorities?
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
            id="BusinessCase-PriorityAlignment"
            maxLength={2000}
            name="priorityAlignment"
            aria-describedby="BusinessCase-PriorityAlignmentCounter"
          />
          <CharacterCounter
            id="BusinessCase-PriorityAlignmentCounter"
            characterCount={2000 - values.priorityAlignment.length}
          />
        </FieldGroup>

        <FieldGroup
          scrollElement="successIndicators"
          error={!!flatErrors.successIndicators}
        >
          <Label htmlFor="BusinessCase-SuccessIndicators">
            How will you determine whether or not this effort is successful?
          </Label>
          <HelpText className="margin-y-1">
            Include any indicators that you think would demonstrate success
          </HelpText>
          <FieldErrorMsg>{flatErrors.successIndicators}</FieldErrorMsg>
          <Field
            as={TextAreaField}
            error={!!flatErrors.successIndicators}
            id="BusinessCase-SuccessIndicators"
            maxLength={2000}
            name="successIndicators"
            aria-describedby="BusinessCase-SuccessIndicatorsCounter"
          />
          <CharacterCounter
            id="BusinessCase-SuccessIndicatorsCounter"
            characterCount={2000 - values.successIndicators.length}
          />
          <HelpText className="margin-top-1">{`${2000 -
            values.successIndicators.length} characters left`}</HelpText>
        </FieldGroup>
      </div>
    </div>
  );
};

export default RequestDescription;
