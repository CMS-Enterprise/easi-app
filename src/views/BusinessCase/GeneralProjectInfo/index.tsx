import React from 'react';
import { Field, FormikProps } from 'formik';
import Label from 'components/shared/Label';
import TextField from 'components/shared/TextField';
import FieldGroup from 'components/shared/FieldGroup';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import { BusinessCaseModel } from 'types/businessCase';

type GeneralProjectInfoProps = {
  formikProps: FormikProps<BusinessCaseModel>;
};
const GeneralProjectInfo = ({ formikProps }: GeneralProjectInfoProps) => {
  return (
    <>
      <h1 className="font-heading-xl">General Project Info</h1>
      <p className="line-height-body-6">
        The next step is for the Business Owner to select an approved solution
        alternative and notify the Governance Review Team (GRT) of their
        selection. The GRT will issue an investment life cycle ID number, which
        the business owner can use to request or allocate funding. You can
        complete this information on your own or with a GRT member during your
        consult.
      </p>
      <div className="tablet:grid-col-9 margin-bottom-7">
        <FieldGroup scrollElement="projectName" error={false}>
          <Label htmlFor="BusinessCase-ProjectName">Project Name</Label>
          <FieldErrorMsg />
          <Field
            as={TextField}
            error={false}
            id="BusinessCase-ProjectName"
            maxLength={50}
            name="projectName"
          />
        </FieldGroup>

        <FieldGroup scrollElement="requestor.name" error={false}>
          <Label htmlFor="BusinessCase-RequestorName">Requestor</Label>
          <FieldErrorMsg />
          <Field
            as={TextField}
            error={false}
            id="BusinessCase-RequestorName"
            maxLength={50}
            name="projectName"
          />
        </FieldGroup>

        <FieldGroup scrollElement="budgetNumber" error={false}>
          <Label htmlFor="BusinessCase-BudgetNumber">
            Operating Plan Budget Number - Optional
          </Label>
          <FieldErrorMsg />
          <Field
            as={TextField}
            error={false}
            id="BusinessCase-BudgetNumber"
            maxLength={50}
            name="budgetNumber"
          />
        </FieldGroup>

        <FieldGroup scrollElement="businessOwner.name" error={false}>
          <Label htmlFor="BusinessCase-BusinessOwnerName">Business Owner</Label>
          <FieldErrorMsg />
          <Field
            as={TextField}
            error={false}
            id="BusinessCase-BusinessOwnerName"
            maxLength={50}
            name="businessOwner.name"
          />
        </FieldGroup>

        <div className="width-card-lg">
          <FieldGroup scrollElement="requestor.phoneNumber" error={false}>
            <Label htmlFor="BusinessCase-RequestorPhoneNumber">
              Requestor Phone Number
            </Label>
            <FieldErrorMsg />
            <Field
              as={TextField}
              error={false}
              id="BusinessCase-RequestorPhoneNumber"
              maxLength={20}
              name="requestor.phoneNumber"
            />
          </FieldGroup>
        </div>
      </div>
    </>
  );
};

export default GeneralProjectInfo;
