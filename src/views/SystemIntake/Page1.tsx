import React from 'react';
import { Field, FieldArray, useField } from 'formik';
import TextField from 'components/shared/TextField';
import CheckboxField from 'components/shared/CheckboxField';
import { DropdownField, DropdownItem } from 'components/shared/DropdownField';
import cmsDivisionsAndOffices from 'constants/enums/cmsDivisionsAndOffices';
import cmsGovernanceTeams from 'constants/enums/cmsGovernanceTeams';

const CustomCheckboxField = (props: any) => {
  const [field, meta, helpers] = useField(props);
  const { setValue } = helpers;

  return (
    <CheckboxField
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      onChange={e => {
        if (e.target.checked) {
          setValue([]);
        }
      }}
    />
  );
};

type Page1Props = {
  values: any;
};

const Page1 = ({ values }: Page1Props) => (
  <>
    <Field as={TextField} id="IntakeForm-Name" label="Name" name="name" />
    <Field
      as={TextField}
      id="IntakeForm-Acronym"
      label="Acronym"
      name="acronym"
    />
    <Field
      as={TextField}
      id="IntakeForm-Requestor"
      label="Requestor"
      name="requestor"
    />

    <Field
      as={DropdownField}
      id="IntakeForm-RequestorComponent"
      label="Requestor Component"
      name="requestorComponent"
    >
      <Field as={DropdownItem} name="Select an option" value="" />
      {cmsDivisionsAndOffices.map(office => (
        <Field
          as={DropdownItem}
          key={`RequestorComponent-${office.acronym}`}
          name={office.name}
          value={office.name}
        />
      ))}
    </Field>

    {/* Using span because label is associated with control elements */}
    <span className="usa-label">CMS Business/Product Owner&apos;s Name</span>
    <Field
      as={CheckboxField}
      id="IntakeForm-IsBusinessOwnerSameAsRequestor"
      label="Same as Requestor"
      name="isBusinessOwnerSameAsRequestor"
    />
    <Field as={TextField} id="IntakeForm-BusinessOwner" name="businessOwner" />
    <Field
      as={DropdownField}
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
      as={DropdownField}
      id="IntakeForm-ProductManagerComponent"
      label="Product Manager Component"
      name="productManagerComponent"
    >
      <Field as={DropdownItem} name="Select an option" value="" />
      {cmsDivisionsAndOffices.map(office => (
        <Field
          as={DropdownItem}
          key={`ProductManagerComponent-${office.acronym}`}
          name={office.name}
          value={office.name}
        />
      ))}
    </Field>

    <FieldArray name="governanceTeams">
      {arrayHelpers => (
        <>
          {cmsGovernanceTeams.map(team => {
            const kebabValue = team.value.split(' ').join('-');
            return (
              <CheckboxField
                checked={values.governanceTeams.includes(team.value)}
                id={`governanceTeam-${kebabValue}`}
                label={team.name}
                name="governanceTeam"
                onBlur={() => {}}
                onChange={e => {
                  if (e.target.checked) {
                    arrayHelpers.push(e.target.value);
                  } else {
                    const index = values.governanceTeams.indexOf(team.value);
                    arrayHelpers.remove(index);
                  }
                }}
                value={team.value}
              />
            );
          })}
          <CustomCheckboxField
            id="governanceTeam-None"
            label="None"
            name="governanceTeams"
            value=""
          />
        </>
      )}
    </FieldArray>
  </>
);

export default Page1;
