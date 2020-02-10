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
    <div className="width-card">
      <Field
        as={TextField}
        id="IntakeForm-Acronym"
        label="Acronym"
        name="acronym"
      />
    </div>
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
      value=""
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
    </fieldset>
  </>
);

export default Page1;
