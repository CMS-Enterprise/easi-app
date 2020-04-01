import React from 'react';
import { Field, FormikProps } from 'formik';
import Label from 'components/shared/Label';
import TextField from 'components/shared/TextField';
import FieldGroup from 'components/shared/FieldGroup';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import { BusinessCaseModel } from 'types/businessCase';
import flattenErrors from 'utils/flattenErrors';

type GeneralProjectInfoProps = {
  formikProps: FormikProps<BusinessCaseModel>;
};
const GeneralProjectInfo = ({ formikProps }: GeneralProjectInfoProps) => {
  const { errors } = formikProps;
  const flatErrors = flattenErrors(errors);
  const allowedPhoneNumberCharacters = /[\d- ]+/g;

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
        <FieldGroup
          scrollElement="projectName"
          error={!!flatErrors.projectName}
        >
          <Label htmlFor="BusinessCase-ProjectName">Project Name</Label>
          <FieldErrorMsg>{flatErrors.projectName}</FieldErrorMsg>
          <Field
            as={TextField}
            error={!!flatErrors.projectName}
            id="BusinessCase-ProjectName"
            maxLength={50}
            name="projectName"
          />
        </FieldGroup>

        <FieldGroup
          scrollElement="requester.name"
          error={!!flatErrors['requester.name']}
        >
          <Label htmlFor="BusinessCase-RequesterName">Requester</Label>
          <FieldErrorMsg>{flatErrors['requester.name']}</FieldErrorMsg>
          <Field
            as={TextField}
            error={!!flatErrors['requester.name']}
            id="BusinessCase-RequesterName"
            maxLength={50}
            name="requester.name"
          />
        </FieldGroup>

        <FieldGroup scrollElement="budgetNumber">
          <Label htmlFor="BusinessCase-BudgetNumber">
            Operating Plan Budget Number - Optional
          </Label>
          <Field
            as={TextField}
            id="BusinessCase-BudgetNumber"
            maxLength={50}
            name="budgetNumber"
          />
        </FieldGroup>

        <FieldGroup
          scrollElement="businessOwner.name"
          error={!!flatErrors['businessOwner.name']}
        >
          <Label htmlFor="BusinessCase-BusinessOwnerName">Business Owner</Label>
          <FieldErrorMsg>{flatErrors['businessOwner.name']}</FieldErrorMsg>
          <Field
            as={TextField}
            error={!!flatErrors['businessOwner.name']}
            id="BusinessCase-BusinessOwnerName"
            maxLength={50}
            name="businessOwner.name"
          />
        </FieldGroup>

        <FieldGroup
          scrollElement="requester.phoneNumber"
          error={!!flatErrors['requester.phoneNumber']}
        >
          <Label htmlFor="BusinessCase-RequesterPhoneNumber">
            Requester Phone Number
          </Label>
          <FieldErrorMsg>{flatErrors['requester.phoneNumber']}</FieldErrorMsg>
          <div className="width-card-lg">
            <Field
              as={TextField}
              error={!!flatErrors['requester.phoneNumber']}
              id="BusinessCase-RequesterPhoneNumber"
              maxLength={20}
              name="requester.phoneNumber"
              match={allowedPhoneNumberCharacters}
            />
          </div>
        </FieldGroup>
      </div>
    </>
  );
};

export default GeneralProjectInfo;
