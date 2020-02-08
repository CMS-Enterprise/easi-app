import React from 'react';
import { withRouter } from 'react-router-dom';
import { Formik, Form, Field, FieldArray, useField } from 'formik';

import Header from 'components/Header';
import HeaderWrapper from 'components/Header/HeaderWrapper';
import TextField from 'components/shared/TextField';
import CheckboxField from 'components/shared/CheckboxField';
import { DropdownField, DropdownItem } from 'components/shared/DropdownField';
import cmsDivisionsAndOffices from 'constants/enums/cmsDivisionsAndOffices';
import cmsGovernanceTeams from 'constants/enums/cmsGovernanceTeams';
import './index.scss';

type SystemProfileProps = {
  match: any;
};

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

export const SystemIntake = ({ match }: SystemProfileProps) => {
  const initialData: any = {
    name: '',
    acronym: '',
    requestor: '',
    requestorComponent: '',
    businessOwner: '',
    businessOwnerComponent: '',
    productManager: '',
    productManagerComponent: '',
    governanceTeams: [],
    description: '',
    currentStage: '',
    needsEaSupport: null,
    hasContract: null,
    isBusinessOwnerSameAsRequestor: null
  };
  return (
    <div className="system-profile">
      <Header activeNavListItem={match.params.profileId} name="INTAKE">
        <HeaderWrapper className="grid-container margin-bottom-3">
          <button
            type="button"
            className="easi-header__save-button usa-button"
            id="save-button"
          >
            <span>Save & Exit</span>
          </button>
        </HeaderWrapper>
      </Header>
      <div className="grid-container">
        <p className="system-profile__text">
          The EASi System Intake process can guide you through all stages of
          your project, connecting you with the resources, people and services
          that you need. Please complete and submit this CMS IT Intake form to
          engage with the CMS IT Governance review process. This is the first
          step to receive a CMS IT LifeCycle ID. Upon submission, you will
          receive an email promptly from the IT_Governance mailbox, and an IT
          Governance Team member will reach out regarding next steps.
        </p>

        <Formik
          initialValues={initialData}
          onSubmit={(data: any) => {
            console.log('Submitted Data: ', data);
          }}
        >
          {({ values }) => (
            <Form>
              <pre>{JSON.stringify(values, null, 2)}</pre>
              <Field
                as={TextField}
                id="IntakeForm-Name"
                label="Name"
                name="name"
              />
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
              <span className="usa-label">
                CMS Business/Product Owner&apos;s Name
              </span>
              <Field
                as={CheckboxField}
                id="IntakeForm-IsBusinessOwnerSameAsRequestor"
                label="Same as Requestor"
                name="isBusinessOwnerSameAsRequestor"
              />
              <Field
                as={TextField}
                id="IntakeForm-BusinessOwner"
                name="businessOwner"
              />
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
                              const index = values.governanceTeams.indexOf(
                                team.value
                              );
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
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default withRouter(SystemIntake);
