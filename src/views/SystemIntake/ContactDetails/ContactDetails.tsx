import React, { useMemo } from 'react';
import { Controller, FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import {
  Checkbox,
  Dropdown,
  Form,
  FormGroup,
  Radio,
  TextInput
} from '@trussworks/react-uswds';

import cmsDivisionsAndOfficesOptions from 'components/AdditionalContacts/cmsDivisionsAndOfficesOptions';
import CedarContactSelect from 'components/CedarContactSelect';
import FeedbackBanner from 'components/FeedbackBanner';
import MandatoryFieldsAlert from 'components/MandatoryFieldsAlert';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import PageNumber from 'components/PageNumber';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import useEasiForm from 'hooks/useEasiForm';
import useSystemIntakeContacts from 'hooks/useSystemIntakeContacts';
import GetSystemIntakeQuery from 'queries/GetSystemIntakeQuery';
import { UpdateSystemIntakeContactDetails as UpdateSystemIntakeContactDetailsQuery } from 'queries/SystemIntakeQueries';
import { SystemIntake } from 'queries/types/SystemIntake';
import {
  UpdateSystemIntakeContactDetails,
  UpdateSystemIntakeContactDetailsVariables
} from 'queries/types/UpdateSystemIntakeContactDetails';
import {
  SystemIntakeFormState,
  SystemIntakeRequestType
} from 'types/graphql-global-types';
import { ContactDetailsForm, SystemIntakeRoleKeys } from 'types/systemIntake';
import Pager from 'views/TechnicalAssistance/RequestForm/Pager';

import GovernanceTeams from './GovernanceTeams';

type ContactDetailsProps = {
  systemIntake: SystemIntake;
};

const ContactDetails = ({ systemIntake }: ContactDetailsProps) => {
  const { t } = useTranslation('intake');
  const history = useHistory();

  const {
    contacts,
    createContact,
    updateContact
    // deleteContact
  } = useSystemIntakeContacts(systemIntake.id);
  const { requester, businessOwner, productManager, isso } = contacts.data;

  const defaultValues: ContactDetailsForm = useMemo(
    () => ({
      requester,
      businessOwner,
      productManager,
      isso: {
        isPresent: !!isso?.euaUserId,
        ...isso
      },
      governanceTeams: {
        isPresent: systemIntake.governanceTeams.isPresent,
        teams:
          systemIntake.governanceTeams.teams?.map(team => ({
            collaborator: team.collaborator,
            name: team.name,
            key: team.key
          })) || []
      }
    }),
    [
      requester,
      businessOwner,
      productManager,
      isso,
      systemIntake.governanceTeams
    ]
  );

  const form = useEasiForm<ContactDetailsForm>({
    defaultValues
  });

  const { control, handleSubmit, setValue } = form;

  const [mutate] = useMutation<
    UpdateSystemIntakeContactDetails,
    UpdateSystemIntakeContactDetailsVariables
  >(UpdateSystemIntakeContactDetailsQuery, {
    refetchQueries: [
      {
        query: GetSystemIntakeQuery,
        variables: {
          id: systemIntake.id
        }
      }
    ]
  });

  const submit = handleSubmit(async values => {
    /**
     * Create or update contact in database
     * */
    const updateSystemIntakeContact = async (type: SystemIntakeRoleKeys) => {
      // Only run mutations when contact has been verified via CEDAR and component is set
      if (values[type].euaUserId && values[type].component) {
        // If contact has ID, update values
        if (values?.[type].id) {
          return updateContact({ ...values[type] });
        }
        // If contact does not have id, create new contact
        return createContact(values[type]).then(newContact => {
          // Set ID field value from new contact data
          setValue(`${type}.id`, newContact?.id);
        });
      }
      return null;
    };

    await Promise.all([
      updateSystemIntakeContact('requester'),
      updateSystemIntakeContact('businessOwner'),
      updateSystemIntakeContact('productManager'),
      updateSystemIntakeContact('isso')
    ]);
    return mutate({
      variables: {
        input: {
          id: systemIntake.id,
          requester: {
            name: values.requester.commonName,
            component: values.requester.component
          },
          businessOwner: {
            name: values.businessOwner.commonName,
            component: values.businessOwner.component
          },
          productManager: {
            name: values.productManager.commonName,
            component: values.productManager.component
          },
          isso: {
            isPresent: values.isso.isPresent,
            name: values.isso.commonName
          },
          governanceTeams: values.governanceTeams
        }
      }
    }).then(() => history.push('request-details'));
  });

  if (contacts.loading) return <PageLoading />;

  return (
    <>
      {/* TODO: errors summary */}

      <p className="line-height-body-5">
        {t('contactDetails.intakeProcessDescription')}
      </p>

      <MandatoryFieldsAlert className="tablet:grid-col-6" />

      <PageHeading className="margin-bottom-3">
        {t('contactDetails.heading')}
      </PageHeading>

      {systemIntake.requestFormState ===
        SystemIntakeFormState.EDITS_REQUESTED && (
        <FeedbackBanner id={systemIntake.id} type="Intake Request" />
      )}

      <Form
        onSubmit={submit}
        className="maxw-none tablet:grid-col-6 margin-bottom-7"
      >
        {/* Requester */}
        <Controller
          control={control}
          name="requester.commonName"
          render={({ field: { ref, ...field }, fieldState: { error } }) => (
            <FormGroup error={!!error}>
              <Label htmlFor={field.name}>
                {t('contactDetails.requester')}
              </Label>
              {!!error && <FieldErrorMsg>{t('Error')}</FieldErrorMsg>}
              <TextInput {...field} id={field.name} type="text" disabled />
            </FormGroup>
          )}
        />

        <Controller
          control={control}
          name="requester.component"
          render={({ field: { ref, ...field }, fieldState: { error } }) => (
            <FormGroup error={!!error}>
              <Label htmlFor={field.name}>
                {t('contactDetails.requesterComponent')}
              </Label>
              {!!error && <FieldErrorMsg>{t('Error')}</FieldErrorMsg>}

              <Dropdown {...field} id="IntakeForm-RequesterComponent">
                <option value="" disabled>
                  {t('Select an option')}
                </option>
                {cmsDivisionsAndOfficesOptions('RequesterComponent')}
              </Dropdown>
            </FormGroup>
          )}
        />

        {/* Business Owner */}

        <h4 className="margin-bottom-1">
          {t('contactDetails.businessOwner.name')}
        </h4>

        <HelpText id="IntakeForm-BusinessOwnerHelp">
          {t('contactDetails.businessOwner.helpText')}
        </HelpText>

        <Checkbox
          id="IntakeForm-IsBusinessOwnerSameAsRequester"
          label="CMS Business Owner is same as requester"
          name="isBusinessOwnerSameAsRequester"
          onChange={() => null}
        />

        <Controller
          control={control}
          name="businessOwner"
          render={({ field: { ref, ...field }, fieldState: { error } }) => (
            <FormGroup error={!!error}>
              <Label htmlFor={field.name}>
                {t('contactDetails.businessOwner.nameField')}
              </Label>
              {!!error && <FieldErrorMsg>{t('Error')}</FieldErrorMsg>}
              <CedarContactSelect {...field} id={field.name} />
            </FormGroup>
          )}
        />

        <Controller
          control={control}
          name="businessOwner.component"
          render={({ field: { ref, ...field }, fieldState: { error } }) => (
            <FormGroup error={!!error}>
              <Label htmlFor={field.name}>
                {t('contactDetails.businessOwner.component')}
              </Label>
              {!!error && <FieldErrorMsg>{t('Error')}</FieldErrorMsg>}

              <Dropdown {...field} id="IntakeForm-BusinessOwnerComponent">
                <option value="" disabled>
                  {t('Select an option')}
                </option>
                {cmsDivisionsAndOfficesOptions('BusinessOwnerComponent')}
              </Dropdown>
            </FormGroup>
          )}
        />

        <Controller
          control={control}
          name="businessOwner.email"
          render={({ field: { ref, ...field }, fieldState: { error } }) => (
            <FormGroup error={!!error}>
              <Label htmlFor={field.name}>
                {t('contactDetails.businessOwner.email')}
              </Label>
              {!!error && <FieldErrorMsg>{t('Error')}</FieldErrorMsg>}
              <TextInput {...field} id={field.name} type="text" disabled />
            </FormGroup>
          )}
        />

        {/* Product Manager */}

        <h4 className="margin-bottom-1">
          {t('contactDetails.productManager.name')}
        </h4>

        <HelpText id="IntakeForm-ProductManagerHelp">
          {t('contactDetails.productManager.helpText')}
        </HelpText>

        <Checkbox
          id="IntakeForm-IsProductManagerSameAsRequester"
          label="CMS Product Manager is same as requester"
          name="isProductManagerSameAsRequester"
          onChange={() => null}
        />

        <Controller
          control={control}
          name="productManager"
          render={({ field: { ref, ...field }, fieldState: { error } }) => (
            <FormGroup error={!!error}>
              <Label htmlFor={field.name}>
                {t('contactDetails.productManager.nameField')}
              </Label>
              {!!error && <FieldErrorMsg>{t('Error')}</FieldErrorMsg>}
              <CedarContactSelect {...field} id={field.name} />
            </FormGroup>
          )}
        />

        <Controller
          control={control}
          name="productManager.component"
          render={({ field: { ref, ...field }, fieldState: { error } }) => (
            <FormGroup error={!!error}>
              <Label htmlFor={field.name}>
                {t('contactDetails.productManager.component')}
              </Label>
              {!!error && <FieldErrorMsg>{t('Error')}</FieldErrorMsg>}

              <Dropdown {...field} id="IntakeForm-ProductManagerComponent">
                <option value="" disabled>
                  {t('Select an option')}
                </option>
                {cmsDivisionsAndOfficesOptions('ProductManagerComponent')}
              </Dropdown>
            </FormGroup>
          )}
        />

        <Controller
          control={control}
          name="productManager.email"
          render={({ field: { ref, ...field }, fieldState: { error } }) => (
            <FormGroup error={!!error}>
              <Label htmlFor={field.name}>
                {t('contactDetails.productManager.email')}
              </Label>
              {!!error && <FieldErrorMsg>{t('Error')}</FieldErrorMsg>}
              <TextInput {...field} id={field.name} type="text" disabled />
            </FormGroup>
          )}
        />

        {/* ISSO */}

        <Controller
          control={control}
          name="isso.isPresent"
          render={({ field: issoField }) => (
            <FormGroup>
              <fieldset className="usa-fieldset">
                <legend className="usa-label margin-bottom-1">
                  {t('contactDetails.isso.label')}
                </legend>
                <HelpText id="IntakeForm-ISSOHelp">
                  {t('contactDetails.isso.helpText')}
                </HelpText>
                <Radio
                  {...issoField}
                  ref={null}
                  id={`${issoField.name}True`}
                  label={t('Yes')}
                  value="true"
                  checked={issoField.value === true}
                  onChange={() => issoField.onChange(true)}
                />

                {issoField.value === true && (
                  <div
                    data-testid="isso-name-container"
                    className="margin-left-4 margin-bottom-3"
                  >
                    <Controller
                      control={control}
                      name="isso"
                      render={({
                        field: { ref, ...field },
                        fieldState: { error }
                      }) => (
                        <FormGroup error={!!error}>
                          <Label htmlFor={field.name}>
                            {t('contactDetails.isso.name')}
                          </Label>
                          {!!error && (
                            <FieldErrorMsg>{t('Error')}</FieldErrorMsg>
                          )}
                          <CedarContactSelect {...field} id={field.name} />
                        </FormGroup>
                      )}
                    />

                    <Controller
                      control={control}
                      name="isso.component"
                      render={({
                        field: { ref, ...field },
                        fieldState: { error }
                      }) => (
                        <FormGroup error={!!error}>
                          <Label htmlFor={field.name}>
                            {t('contactDetails.isso.component')}
                          </Label>
                          {!!error && (
                            <FieldErrorMsg>{t('Error')}</FieldErrorMsg>
                          )}

                          <Dropdown {...field} id="IntakeForm-IssoComponent">
                            <option value="" disabled>
                              {t('Select an option')}
                            </option>
                            {cmsDivisionsAndOfficesOptions('IssoComponent')}
                          </Dropdown>
                        </FormGroup>
                      )}
                    />

                    <Controller
                      control={control}
                      name="isso.email"
                      render={({
                        field: { ref, ...field },
                        fieldState: { error }
                      }) => (
                        <FormGroup error={!!error}>
                          <Label htmlFor={field.name}>
                            {t('contactDetails.isso.email')}
                          </Label>
                          {!!error && (
                            <FieldErrorMsg>{t('Error')}</FieldErrorMsg>
                          )}
                          <TextInput
                            {...field}
                            id={field.name}
                            type="text"
                            disabled
                          />
                        </FormGroup>
                      )}
                    />
                  </div>
                )}

                <Radio
                  {...issoField}
                  ref={null}
                  id={`${issoField.name}False`}
                  label={t('No')}
                  value="false"
                  checked={issoField.value === false}
                  onChange={() => issoField.onChange(false)}
                />
              </fieldset>
            </FormGroup>
          )}
        />

        {/* TODO: Additional contacts */}

        {/* Governance Teams */}

        <FormProvider<ContactDetailsForm> {...form}>
          <GovernanceTeams />
        </FormProvider>

        <Pager
          next={{
            type: 'submit'
          }}
          border={false}
          taskListUrl={
            systemIntake.requestType === SystemIntakeRequestType.SHUTDOWN
              ? '/'
              : `/governance-task-list/${systemIntake.id}`
          }
          className="margin-top-4"
        />
      </Form>

      {/*
        TODO: Fix autosave
        <AutoSave values={values} onSave={() => null} debounceDelay={3000} /> 
      */}

      <PageNumber currentPage={1} totalPages={5} />
    </>
  );
};

export default ContactDetails;
