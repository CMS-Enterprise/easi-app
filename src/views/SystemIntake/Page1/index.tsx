import React, { Fragment, useState } from 'react';
import { Field, FieldArray, FormikProps } from 'formik';
import TextField from 'components/shared/TextField';
import CheckboxField from 'components/shared/CheckboxField';
import { DropdownField, DropdownItem } from 'components/shared/DropdownField';
import HelpText from 'components/shared/HelpText';
import { RadioField } from 'components/shared/RadioField';
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
      <p className="line-height-body-6">
        The EASi System Intake process can guide you through all stages of your
        project, connecting you with the resources, people and services that you
        need. Please complete and submit this CMS IT Intake form to engage with
        the CMS IT Governance review process. This is the first step to receive
        a CMS IT LifeCycle ID. Upon submission, you will receive an email
        promptly from the IT_Governance mailbox, and an IT Governance Team
        member will reach out regarding next steps.
      </p>
      <p className="text-italic">
        **All fields are required unless marked &apos;Optional&apos;
      </p>
      <div className="grid-col-6 margin-bottom-7">
        <h2 className="font-heading-xl">Contact Details</h2>
        <Field
          as={TextField}
          id="IntakeForm-Requestor"
          label="Requestor"
          maxLength={50}
          name="requestor.name"
          onChange={(e: any) => {
            if (isReqAndBusOwnerSame) {
              formikProps.setFieldValue('businessOwner.name', e.target.value);
            }
            formikProps.setFieldValue('requestor.name', e.target.value);
          }}
        />

        <Field
          as={DropdownField}
          id="IntakeForm-RequestorComponent"
          label="Requestor Component"
          name="requestor.component"
          onChange={(e: any) => {
            if (isReqAndBusOwnerSame) {
              formikProps.setFieldValue(
                'businessOwner.component',
                e.target.value
              );
            }
            formikProps.setFieldValue('requestor.component', e.target.value);
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
                'businessOwner.name',
                formikProps.values.requestor.name
              );
              formikProps.setFieldValue(
                'businessOwner.component',
                formikProps.values.requestor.component
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
          name="businessOwner.name"
        />
        <Field
          as={DropdownField}
          disabled={isReqAndBusOwnerSame}
          id="IntakeForm-BusinessOwnerComponent"
          label="Business Owner Component"
          name="businessOwner.component"
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
          name="productManager.name"
        />
        <Field
          as={DropdownField}
          id="IntakeForm-ProductManagerComponent"
          label="Product Manager Component"
          name="productManager.component"
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
            Does your project have an ISSO?
          </legend>
          <HelpText>
            If yes, please tell use the name of your ISSO so we can get in touch
            with them
          </HelpText>

          <Field
            as={RadioField}
            checked={formikProps.values.isso.isPresent === true}
            id="IntakeForm-HasIssoYes"
            name="isso.isPresent"
            label="Yes"
            onChange={() => {
              formikProps.setFieldValue('isso.isPresent', true);
            }}
            value={true}
          />
          {formikProps.values.isso.isPresent && (
            <div className="width-card margin-top-neg-2 margin-left-3 margin-bottom-1">
              <Field
                as={TextField}
                id="IntakeForm-IssoName"
                label="ISSO Name"
                maxLength={50}
                name="isso.name"
              />
            </div>
          )}
          <Field
            as={RadioField}
            checked={formikProps.values.isso.isPresent === false}
            id="IntakeForm-HasIssoNo"
            name="isso.isPresent"
            label="No"
            onChange={() => {
              formikProps.setFieldValue('isso.isPresent', false);
              formikProps.setFieldValue('isso.name', '');
            }}
            value={false}
          />
        </fieldset>

        <fieldset className="usa-fieldset margin-top-3">
          <legend className="usa-label margin-bottom-1">
            My project team is currently collaborating/consulting with:
          </legend>
          <HelpText>
            Please disclose the name of each person you&apos;ve worked with.
            This helps us locate any additional information on your request
          </HelpText>
          <Field
            as={RadioField}
            checked={formikProps.values.governanceTeams.isPresent === true}
            id="IntakeForm-NoGovernanceTeams"
            name="governanceTeams.isPresent"
            label="1 or more of the following in OIT (select all that apply)"
            onChange={() => {
              formikProps.setFieldValue('governanceTeams.isPresent', true);
            }}
            value={true}
          />
          <div className="margin-left-3">
            <FieldArray name="governanceTeams.teams">
              {arrayHelpers => (
                <>
                  {cmsGovernanceTeams.map(team => {
                    const kebabValue = team.value.split(' ').join('-');
                    return (
                      <Fragment key={kebabValue}>
                        <CheckboxField
                          checked={
                            formikProps.values.governanceTeams.teams
                              .map(t => t.name)
                              .indexOf(team.value) > -1
                          }
                          disabled={
                            formikProps.values.governanceTeams.isPresent ===
                            false
                          }
                          id={`governanceTeam-${kebabValue}`}
                          label={team.name}
                          name={team.name}
                          onBlur={() => {}}
                          onChange={e => {
                            if (e.target.checked) {
                              arrayHelpers.push({
                                name: e.target.value,
                                collaborator: ''
                              });

                              // Check parent radio if it's not already checked
                              if (
                                !formikProps.values.governanceTeams.isPresent
                              ) {
                                formikProps.setFieldValue(
                                  'governanceTeams.isPresent',
                                  true
                                );
                              }
                            } else {
                              const index = formikProps.values.governanceTeams.teams
                                .map(t => t.name)
                                .indexOf(e.target.value);

                              arrayHelpers.remove(index);
                            }
                          }}
                          value={team.value}
                        />
                        {formikProps.values.governanceTeams.teams.map(
                          (t, index) => {
                            if (team.value === t.name) {
                              const id = t.name.split(' ').join('-');
                              return (
                                <div
                                  key={`${id}-Collaborator`}
                                  className="width-card-lg margin-top-neg-2 margin-left-3 margin-bottom-2"
                                >
                                  <Field
                                    as={TextField}
                                    id={`IntakeForm-${id}-Collaborator`}
                                    label="Collaborator Name"
                                    maxLength={50}
                                    name={`governanceTeams.teams[${index}].collaborator`}
                                  />
                                </div>
                              );
                            }
                            return null;
                          }
                        )}
                      </Fragment>
                    );
                  })}
                </>
              )}
            </FieldArray>
          </div>
          <Field
            as={RadioField}
            checked={formikProps.values.governanceTeams.isPresent === false}
            id="IntakeForm-YesGovernanceTeam"
            name="governanceTeams.isPresent"
            label="None of the above"
            onChange={() => {
              formikProps.setFieldValue('governanceTeams.isPresent', false);
              formikProps.setFieldValue('governanceTeams.teams', []);
            }}
            value={false}
          />
        </fieldset>
      </div>
    </>
  );
};

export default Page1;
