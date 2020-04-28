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
      <div className="tablet:grid-col-6 margin-bottom-7">
        <h1 className="font-heading-xl margin-top-4">Contact Details</h1>

        {/* Requester Name */}
        <FieldGroup
          scrollElement="requester.name"
          error={!!flatErrors['requester.name']}
        >
          <Label htmlFor="IntakeForm-Requester">Requester</Label>
          <FieldErrorMsg>{flatErrors['requester.name']}</FieldErrorMsg>
          <Field
            as={TextField}
            error={!!flatErrors['requester.name']}
            id="IntakeForm-Requester"
            maxLength={50}
            name="requester.name"
            onChange={(e: any) => {
              if (isReqAndBusOwnerSame) {
                setFieldValue('businessOwner.name', e.target.value);
              }
              setFieldValue('requester.name', e.target.value);
            }}
          />
        </FieldGroup>

        {/* Requester Component */}
        <FieldGroup
          scrollElement="requester.component"
          error={!!flatErrors['requester.component']}
        >
          <Label htmlFor="IntakeForm-RequesterComponent">
            Requester Component
          </Label>
          <FieldErrorMsg>{flatErrors['requester.component']}</FieldErrorMsg>
          <Field
            as={DropdownField}
            error={!!flatErrors['requester.component']}
            id="IntakeForm-RequesterComponent"
            name="requester.component"
            onChange={(e: any) => {
              if (isReqAndBusOwnerSame) {
                setFieldValue('businessOwner.component', e.target.value);
              }
              setFieldValue('requester.component', e.target.value);
            }}
          >
            <Field as={DropdownItem} name="Select an option" value="" />
            {cmsDivisionsAndOffices.map((office: any) => (
              <Field
                as={DropdownItem}
                key={`RequesterComponent-${office.acronym}`}
                name={office.name}
                value={office.name}
              />
            ))}
          </Field>
        </FieldGroup>

        {/* Business Owner Name */}
        <FieldGroup
          scrollElement="businessOwner.name"
          error={!!flatErrors['businessOwner.name']}
        >
          <Label className="margin-bottom-1" htmlFor="IntakeForm-BusinessOwner">
            CMS Business/Product Owner&apos;s Name
          </Label>
          <Field
            as={CheckboxField}
            id="IntakeForm-IsBusinessOwnerSameAsRequester"
            label="Same as Requester"
            name="isBusinessOwnerSameAsRequester"
            onChange={(e: any) => {
              if (e.target.checked) {
                setReqAndBusOwnerSame(true);
                setFieldValue('businessOwner.name', values.requester.name);
                setFieldValue(
                  'businessOwner.component',
                  values.requester.component
                );
              } else {
                setReqAndBusOwnerSame(false);
              }
            }}
            value=""
          />
          <FieldErrorMsg>{flatErrors['businessOwner.name']}</FieldErrorMsg>
          <Field
            as={TextField}
            error={!!flatErrors['businessOwner.name']}
            disabled={isReqAndBusOwnerSame}
            id="IntakeForm-BusinessOwner"
            maxLength={50}
            name="businessOwner.name"
          />
        </FieldGroup>

        {/* Business Owner Component */}
        <FieldGroup
          scrollElement="businessOwner.component"
          error={!!flatErrors['businessOwner.component']}
        >
          <Label htmlFor="IntakeForm-BusinessOwnerComponent">
            Business Owner Component
          </Label>
          <FieldErrorMsg>{flatErrors['businessOwner.component']}</FieldErrorMsg>
          <Field
            as={DropdownField}
            disabled={isReqAndBusOwnerSame}
            error={!!flatErrors['businessOwner.component']}
            id="IntakeForm-BusinessOwnerComponent"
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
        </FieldGroup>

        {/* Product Manager Name */}
        <FieldGroup
          scrollElement="productManager.name"
          error={!!flatErrors['productManager.name']}
        >
          <Label htmlFor="IntakeForm-ProductManager">
            CMS Project/Product Manager, or lead
          </Label>
          <FieldErrorMsg>{flatErrors['productManager.name']}</FieldErrorMsg>
          <Field
            as={TextField}
            error={!!flatErrors['productManager.name']}
            id="IntakeForm-ProductManager"
            maxLength={50}
            name="productManager.name"
          />
        </FieldGroup>

        {/* Product Manager Component */}
        <FieldGroup
          scrollElement="productManager.component"
          error={!!flatErrors['productManager.component']}
        >
          <Label htmlFor="IntakeForm-ProductManagerComponent">
            Product Manager Component
          </Label>
          <FieldErrorMsg>
            {flatErrors['productManager.component']}
          </FieldErrorMsg>
          <Field
            as={DropdownField}
            error={!!flatErrors['productManager.component']}
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
        </FieldGroup>

        {/* ISSO */}
        <FieldGroup
          scrollElement="isso.isPresent"
          error={!!flatErrors['isso.isPresent']}
        >
          <fieldset className="usa-fieldset margin-top-4">
            <legend className="usa-label margin-bottom-1">
              Does your project have an Information System Security Officer
              (ISSO)?
            </legend>
            <HelpText className="margin-bottom-2">
              If yes, please tell use the name of your ISSO so we can get in
              touch with them
            </HelpText>
            <FieldErrorMsg>{flatErrors['isso.isPresent']}</FieldErrorMsg>

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
              <div className="width-card-lg margin-top-neg-2 margin-left-4 margin-bottom-1">
                <FieldGroup
                  scrollElement="isso.name"
                  error={!!flatErrors['isso.name']}
                >
                  <Label htmlFor="IntakeForm-IssoName">ISSO Name</Label>
                  <FieldErrorMsg>{flatErrors['isso.name']}</FieldErrorMsg>
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
        </FieldGroup>

        {/* Governance Teams */}
        <FieldGroup
          scrollElement="governanceTeams.isPresent"
          error={flatErrors['governanceTeams.isPresent']}
        >
          <fieldset className="usa-fieldset margin-top-3">
            <legend className="usa-label margin-bottom-1">
              My project team is currently collaborating/consulting with:
            </legend>
            <HelpText className="margin-bottom-2">
              Please disclose the name of each person you&apos;ve worked with.
              This helps us locate any additional information on your request
            </HelpText>
            <FieldErrorMsg>
              {flatErrors['governanceTeams.isPresent']}
            </FieldErrorMsg>

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
              <FieldGroup
                scrollElement="governanceTeams.teams"
                error={!!flatErrors['governanceTeams.teams']}
              >
                <FieldErrorMsg>
                  {flatErrors['governanceTeams.teams']}
                </FieldErrorMsg>
                <GovernanceTeamOptions formikProps={formikProps} />
              </FieldGroup>
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
        </FieldGroup>
      </div>
    </>
  );
};

export default ContactDetails;
