import React, { useState } from 'react';
import { Field, FormikProps } from 'formik';
import TextField from 'components/shared/TextField';
import CheckboxField from 'components/shared/CheckboxField';
import { DropdownField, DropdownItem } from 'components/shared/DropdownField';
import HelpText from 'components/shared/HelpText';
import { RadioField } from 'components/shared/RadioField';
import FieldGroup from 'components/shared/FieldGroup';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import Label from 'components/shared/Label';
import cmsDivisionsAndOffices from 'constants/enums/cmsDivisionsAndOffices';
import flattenErrors from 'utils/flattenErrors';
import { SystemIntakeForm } from 'types/systemIntake';
import GovernanceTeamOptions from './GovernanceTeamOptions';

type ContactDetailsProps = {
  formikProps: FormikProps<SystemIntakeForm>;
};

const ContactDetails = ({ formikProps }: ContactDetailsProps) => {
  const { values, setFieldValue, errors } = formikProps;
  const flatErrors = flattenErrors(errors);
  const [isReqAndBusOwnerSame, setReqAndBusOwnerSame] = useState(false);
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
        <FieldGroup error={!!flatErrors['requestor.name']}>
          <Label
            error={!!flatErrors['requestor.name']}
            htmlFor="IntakeForm-Requestor"
          >
            Requestor
          </Label>
          <FieldErrorMsg errorMsg={flatErrors['requestor.name']} />
          <Field
            as={TextField}
            error={!!flatErrors['requestor.name']}
            id="IntakeForm-Requestor"
            maxLength={50}
            name="requestor.name"
            onChange={(e: any) => {
              if (isReqAndBusOwnerSame) {
                setFieldValue('businessOwner.name', e.target.value);
              }
              setFieldValue('requestor.name', e.target.value);
            }}
          />
        </FieldGroup>

        <Field
          as={DropdownField}
          id="IntakeForm-RequestorComponent"
          label="Requestor Component"
          name="requestor.component"
          onChange={(e: any) => {
            if (isReqAndBusOwnerSame) {
              setFieldValue('businessOwner.component', e.target.value);
            }
            setFieldValue('requestor.component', e.target.value);
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

        <FieldGroup error={!!flatErrors['businessOwner.name']}>
          <Label
            className="margin-bottom-1"
            htmlFor="IntakeForm-BusinessOwner"
            error={!!flatErrors['businessOwner.name']}
          >
            CMS Business/Product Owner&apos;s Name
          </Label>
          <Field
            as={CheckboxField}
            id="IntakeForm-IsBusinessOwnerSameAsRequestor"
            label="Same as Requestor"
            name="isBusinessOwnerSameAsRequestor"
            onChange={(e: any) => {
              if (e.target.checked) {
                setReqAndBusOwnerSame(true);
                setFieldValue('businessOwner.name', values.requestor.name);
                setFieldValue(
                  'businessOwner.component',
                  values.requestor.component
                );
              } else {
                setReqAndBusOwnerSame(false);
              }
            }}
            value=""
          />
          <FieldErrorMsg errorMsg={flatErrors['businessOwner.name']} />
          <Field
            as={TextField}
            error={!!flatErrors['businessOwner.name']}
            disabled={isReqAndBusOwnerSame}
            id="IntakeForm-BusinessOwner"
            maxLength={50}
            name="businessOwner.name"
          />
        </FieldGroup>
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
        <FieldGroup error={!!flatErrors['productManager.name']}>
          <Label
            htmlFor="IntakeForm-ProductManager"
            error={!!flatErrors['productManager.name']}
          >
            CMS Project/Product Manager, or lead
          </Label>
          <FieldErrorMsg errorMsg={flatErrors['productManager.name']} />
          <Field
            as={TextField}
            error={!!flatErrors['productManager.name']}
            id="IntakeForm-ProductManager"
            maxLength={50}
            name="productManager.name"
          />
        </FieldGroup>
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
            checked={values.isso.isPresent === true}
            id="IntakeForm-HasIssoYes"
            name="isso.isPresent"
            label="Yes"
            onChange={() => {
              setFieldValue('isso.isPresent', true);
            }}
            value
          />
          {values.isso.isPresent && (
            <div className="width-card margin-top-neg-2 margin-left-3 margin-bottom-1">
              <FieldGroup error={!!flatErrors['isso.name']}>
                <Label
                  htmlFor="IntakeForm-IssoName"
                  error={!!flatErrors['isso.name']}
                >
                  ISSO Name
                </Label>
                <FieldErrorMsg errorMsg={flatErrors['isso.name']} />
                <Field
                  as={TextField}
                  error={!!flatErrors['isso.name']}
                  id="IntakeForm-IssoName"
                  maxLength={50}
                  name="isso.name"
                />
              </FieldGroup>
            </div>
          )}
          <Field
            as={RadioField}
            checked={values.isso.isPresent === false}
            id="IntakeForm-HasIssoNo"
            name="isso.isPresent"
            label="No"
            onChange={() => {
              setFieldValue('isso.isPresent', false);
              setFieldValue('isso.name', '');
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
            checked={values.governanceTeams.isPresent === true}
            id="IntakeForm-NoGovernanceTeams"
            name="governanceTeams.isPresent"
            label="1 or more of the following in OIT (select all that apply)"
            onChange={() => {
              setFieldValue('governanceTeams.isPresent', true);
            }}
            value
          />
          <div className="margin-left-3">
            <GovernanceTeamOptions
              values={values}
              setFieldValue={setFieldValue}
            />
          </div>
          <Field
            as={RadioField}
            checked={values.governanceTeams.isPresent === false}
            id="IntakeForm-YesGovernanceTeam"
            name="governanceTeams.isPresent"
            label="None of the above"
            onChange={() => {
              setFieldValue('governanceTeams.isPresent', false);
              setFieldValue('governanceTeams.teams', []);
            }}
            value={false}
          />
        </fieldset>
      </div>
    </>
  );
};

export default ContactDetails;
