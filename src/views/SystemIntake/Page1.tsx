import React, { useState } from 'react';
import { Field, FieldArray, FormikProps } from 'formik';
import TextField from 'components/shared/TextField';
import CheckboxField from 'components/shared/CheckboxField';
import { DropdownField, DropdownItem } from 'components/shared/DropdownField';
import cmsDivisionsAndOffices from 'constants/enums/cmsDivisionsAndOffices';
import cmsGovernanceTeams from 'constants/enums/cmsGovernanceTeams';
import { SystemIntakeForm } from 'types/systemIntake';

type Page1Props = {
  formikProps: FormikProps<SystemIntakeForm>;
};

const Page1 = ({ formikProps }: Page1Props) => {
  const [isReqAndBusOwnerSame, setSameness] = useState(false);
  return (
    <>
      <Field
        as={TextField}
        id="IntakeForm-Name"
        label="Name"
        maxLength={50}
        name="name"
      />
      <div className="width-card">
        <Field
          as={TextField}
          id="IntakeForm-Acronym"
          label="Acronym"
          maxLength={10}
          name="acronym"
        />
      </div>
      <Field
        as={TextField}
        id="IntakeForm-Requestor"
        label="Requestor"
        maxLength={50}
        name="requestor"
        onChange={(e: any) => {
          if (isReqAndBusOwnerSame) {
            formikProps.setFieldValue('businessOwner', e.target.value);
          }
          formikProps.setFieldValue('requestor', e.target.value);
        }}
      />

      <Field
        as={DropdownField}
        id="IntakeForm-RequestorComponent"
        label="Requestor Component"
        name="requestorComponent"
        onChange={(e: any) => {
          if (isReqAndBusOwnerSame) {
            formikProps.setFieldValue('businessOwnerComponent', e.target.value);
          }
          formikProps.setFieldValue('requestorComponent', e.target.value);
        }}
      >
        <Field as={DropdownItem} name="Select an option" value="" />
        {cmsDivisionsAndOffices.map((office: any) => (
          <Field
            as={DropdownItem}
            key={`RequestorComponent-${office.acronym}`}
            name={office.name}
            value={office.name}
          />
        ))}
      </Field>

      <label
        className="usa-label margin-bottom-1"
        htmlFor="IntakeForm-BusinessOwner"
      >
        CMS Business/Product Owner&apos;s Name
      </label>
      <Field
        as={CheckboxField}
        id="IntakeForm-IsBusinessOwnerSameAsRequestor"
        label="Same as Requestor"
        name="isBusinessOwnerSameAsRequestor"
        onChange={(e: any) => {
          if (e.target.checked) {
            setSameness(true);
            formikProps.setFieldValue(
              'businessOwner',
              formikProps.values.requestor
            );
            formikProps.setFieldValue(
              'businessOwnerComponent',
              formikProps.values.requestorComponent
            );
          } else {
            setSameness(false);
          }
        }}
        value=""
      />
      <Field
        as={TextField}
        disabled={isReqAndBusOwnerSame}
        id="IntakeForm-BusinessOwner"
        maxLength={50}
        name="businessOwner"
      />
      <Field
        as={DropdownField}
        disabled={isReqAndBusOwnerSame}
        id="IntakeForm-BusinessOwnerComponent"
        label="Business Owner Component"
        name="businessOwnerComponent"
      >
        <Field as={DropdownItem} name="Select an option" value="" />
        {cmsDivisionsAndOffices.map(office => (
          <Field
            as={DropdownItem}
            key={`BusinessOwnerComponent-${office.acronym}`}
            name={office.name}
            value={office.name}
          />
        ))}
      </Field>
      <Field
        as={TextField}
        id="IntakeForm-ProductManager"
        label="CMS Project/Product Manager, or lead"
        maxLength={50}
        name="productManager"
      />
      <Field
        as={DropdownField}
        id="IntakeForm-ProductManagerComponent"
        label="Product Manager Component"
        name="productManagerComponent"
      >
        <Field as={DropdownItem} name="Select an option" value="" />
        {cmsDivisionsAndOffices.map((office: any) => (
          <Field
            as={DropdownItem}
            key={`ProductManagerComponent-${office.acronym}`}
            name={office.name}
            value={office.name}
          />
        ))}
      </Field>

      <fieldset className="usa-fieldset margin-top-3">
        <legend className="usa-label margin-bottom-1">
          Is your project team currently collaborating/consulting with anyone of
          the following?
        </legend>
        <FieldArray name="governanceTeams">
          {arrayHelpers => (
            <>
              {cmsGovernanceTeams.map(team => {
                const kebabValue = team.value.split(' ').join('-');
                return (
                  <CheckboxField
                    key={team.value}
                    checked={formikProps.values.governanceTeams.includes(
                      team.value
                    )}
                    id={`governanceTeam-${kebabValue}`}
                    label={team.name}
                    name="governanceTeam"
                    onBlur={() => {}}
                    onChange={e => {
                      if (e.target.checked) {
                        arrayHelpers.push(e.target.value);
                        if (
                          formikProps.values.governanceTeams.includes('None')
                        ) {
                          const newValue = formikProps.values.governanceTeams.filter(
                            item => item !== 'None'
                          );
                          formikProps.setFieldValue('governanceTeams', [
                            ...newValue,
                            e.target.value
                          ]);
                        }
                      } else {
                        const index = formikProps.values.governanceTeams.indexOf(
                          team.value
                        );
                        arrayHelpers.remove(index);
                      }
                    }}
                    value={team.value}
                  />
                );
              })}
              <Field
                as={CheckboxField}
                checked={formikProps.values.governanceTeams.includes('None')}
                id="governanceTeam-None"
                label="None"
                name="governanceTeam"
                onChange={(e: any) => {
                  if (e.target.checked) {
                    formikProps.setFieldValue('governanceTeams', ['None']);
                  } else {
                    const index = formikProps.values.governanceTeams.indexOf(
                      'None'
                    );
                    arrayHelpers.remove(index);
                  }
                }}
                value="None"
              />
            </>
          )}
        </FieldArray>
      </fieldset>
    </>
  );
};

export default Page1;
