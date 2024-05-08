import React, { useEffect, useMemo, useState } from 'react';
import { Controller, FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Checkbox,
  Dropdown,
  Form,
  FormGroup,
  Radio,
  TextInput
} from '@trussworks/react-uswds';
import { camelCase } from 'lodash';

import AdditionalContacts from 'components/AdditionalContacts';
import cmsDivisionsAndOfficesOptions from 'components/AdditionalContacts/cmsDivisionsAndOfficesOptions';
import CedarContactSelect from 'components/CedarContactSelect';
import FeedbackBanner from 'components/FeedbackBanner';
import MandatoryFieldsAlert from 'components/MandatoryFieldsAlert';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import PageNumber from 'components/PageNumber';
import Alert from 'components/shared/Alert';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
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
import {
  ContactDetailsForm,
  SystemIntakeContactProps,
  SystemIntakeRoleKeys
} from 'types/systemIntake';
import flattenFormErrors from 'utils/flattenFormErrors';
import SystemIntakeValidationSchema from 'validations/systemIntakeSchema';
import Pager from 'views/TechnicalAssistance/RequestForm/Pager';

import GovernanceTeams from './GovernanceTeams';

import './index.scss';

type ContactDetailsProps = {
  systemIntake: SystemIntake;
};

const ContactDetails = ({ systemIntake }: ContactDetailsProps) => {
  const { t } = useTranslation('intake');
  const history = useHistory();

  const [
    busOwnerSameAsRequester,
    setBusOwnerSameAsRequester
  ] = useState<boolean>(false);

  const [
    prodManagerSameAsRequester,
    setProdManagerSameAsRequester
  ] = useState<boolean>(false);

  const [
    activeContact,
    setActiveContact
  ] = useState<SystemIntakeContactProps | null>(null);

  const {
    contacts,
    createContact,
    updateContact
    // deleteContact
  } = useSystemIntakeContacts(systemIntake.id);

  const form = useEasiForm<ContactDetailsForm>({
    defaultValues: async () =>
      contacts
        .refetch()
        .then(({ requester, businessOwner, productManager, isso }) => ({
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
        })),
    resolver: yupResolver(SystemIntakeValidationSchema.contactDetails)
  });

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { defaultValues, dirtyFields, isDirty, errors }
  } = form;

  const [updateSystemIntake] = useMutation<
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

  /** Creates or updates contact in database and sets ID field for new contacts */
  const setContact = async (contact: SystemIntakeContactProps) => {
    const fieldName = camelCase(contact.role) as SystemIntakeRoleKeys;

    /** Checks if contact fields are set */
    const shouldUpdate =
      !!dirtyFields[fieldName] && !!contact.euaUserId && !!contact.component;

    if (!shouldUpdate) return null;

    /** If ID field is empty, creates new contact */
    const mutation = contact?.id ? updateContact : createContact;

    return mutation({ ...contact }).then(contactData =>
      // Set ID field for new contacts
      setValue(`${fieldName}.id`, contactData?.id)
    );
  };

  /** Update contacts and system intake form */
  const submit = handleSubmit(
    async ({
      requester,
      businessOwner,
      productManager,
      isso,
      governanceTeams
    }) => {
      if (!isDirty) return null;

      // Update contacts
      await Promise.all([
        setContact(requester),
        setContact(businessOwner),
        setContact(productManager),
        setContact(isso)
      ]);

      // Update system intake
      return updateSystemIntake({
        variables: {
          input: {
            id: systemIntake.id,
            requester: {
              name: requester.commonName,
              component: requester.component
            },
            businessOwner: {
              name: businessOwner.commonName,
              component: businessOwner.component
            },
            productManager: {
              name: productManager.commonName,
              component: productManager.component
            },
            isso: {
              isPresent: isso.isPresent,
              name: isso.commonName
            },
            governanceTeams
          }
        }
      })
        .then(() => history.push('request-details'))
        .catch(e => {
          setError('root', { message: t('error:encounteredIssueTryAgain') });
        });
    }
  );

  /**
   * Used to set contact details to match requester
   *
   * Resets contact fields when `values` is undefined
   * */
  const setContactDetails = (
    role: SystemIntakeRoleKeys,
    values?: SystemIntakeContactProps
  ) => {
    setValue(`${role}.euaUserId`, values ? values.euaUserId : '');
    setValue(`${role}.commonName`, values ? values.commonName : '');
    setValue(`${role}.email`, values ? values.email : '');
    setValue(`${role}.component`, values ? values.component : '');
  };

  const hasErrors = Object.keys(errors).length > 0;

  /** Flattened field errors, excluding any root errors */
  const fieldErrors = useMemo(() => flattenFormErrors(errors), [errors]);

  // Scroll errors into view on submit
  useEffect(() => {
    if (hasErrors) {
      const err = document.querySelector('.usa-alert--error');
      err?.scrollIntoView();
    }
  }, [errors, hasErrors]);

  // Wait until contacts are done loading and default values have been updated
  if (contacts.loading || !defaultValues) return <PageLoading />;

  return (
    <>
      {Object.keys(fieldErrors).length > 0 && (
        <ErrorAlert
          test-id="contact-details-errors"
          classNames="margin-top-3"
          heading={t('form:inputError.checkFix')}
        >
          {Object.entries(fieldErrors).map(([key, message]) => {
            return (
              <ErrorAlertMessage
                key={`Error.${key}`}
                errorKey={key}
                message={message}
              />
            );
          })}
        </ErrorAlert>
      )}

      {errors?.root?.message && (
        <Alert type="error">{errors.root.message}</Alert>
      )}

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
              {!!error && <FieldErrorMsg>t(error.message)</FieldErrorMsg>}
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
              {!!error?.message && (
                <FieldErrorMsg>{t(error.message)}</FieldErrorMsg>
              )}

              <Dropdown
                {...field}
                id="IntakeForm-RequesterComponent"
                onChange={e => {
                  field.onChange(e);

                  if (busOwnerSameAsRequester) {
                    setValue('businessOwner.component', e.target.value);
                  }

                  if (prodManagerSameAsRequester) {
                    setValue('productManager.component', e.target.value);
                  }
                }}
              >
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
          id="IntakeForm-busOwnerSameAsRequester"
          label="CMS Business Owner is same as requester"
          name="busOwnerSameAsRequester"
          checked={!!busOwnerSameAsRequester}
          onChange={e => {
            setContactDetails(
              'businessOwner',
              e.target.checked ? watch('requester') : undefined
            );

            setBusOwnerSameAsRequester(!busOwnerSameAsRequester);
          }}
        />

        <Controller
          control={control}
          name="businessOwner"
          render={({ field: { ref, ...field } }) => {
            const error = errors?.businessOwner?.commonName;

            return (
              <FormGroup error={!!error}>
                <Label htmlFor={field.name}>
                  {t('contactDetails.businessOwner.nameField')}
                </Label>
                {!!error?.message && (
                  <FieldErrorMsg>{t(error?.message)}</FieldErrorMsg>
                )}
                <CedarContactSelect
                  {...field}
                  id={field.name}
                  // Manually set value so that field rerenders when values are updated
                  value={{
                    euaUserId: watch('businessOwner.euaUserId'),
                    commonName: watch('businessOwner.commonName'),
                    email: watch('businessOwner.email')
                  }}
                  // Manually update fields so that email field rerenders
                  onChange={contact => {
                    setValue(
                      'businessOwner.commonName',
                      contact?.commonName || ''
                    );
                    setValue(
                      'businessOwner.euaUserId',
                      contact?.euaUserId || ''
                    );
                    setValue('businessOwner.email', contact?.email || '');
                  }}
                  disabled={busOwnerSameAsRequester}
                />
              </FormGroup>
            );
          }}
        />

        <Controller
          control={control}
          name="businessOwner.component"
          render={({ field: { ref, ...field }, fieldState: { error } }) => (
            <FormGroup error={!!error}>
              <Label htmlFor={field.name}>
                {t('contactDetails.businessOwner.component')}
              </Label>
              {!!error?.message && (
                <FieldErrorMsg>{t(error.message)}</FieldErrorMsg>
              )}

              <Dropdown
                {...field}
                id="IntakeForm-BusinessOwnerComponent"
                value={watch('businessOwner.component')}
              >
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
          render={({ field: { ref, ...field } }) => (
            <FormGroup>
              <Label htmlFor={field.name}>
                {t('contactDetails.businessOwner.email')}
              </Label>
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
          id="IntakeForm-prodManagerSameAsRequester"
          label="CMS Product Manager is same as requester"
          name="prodManagerSameAsRequester"
          checked={!!prodManagerSameAsRequester}
          onChange={e => {
            setContactDetails(
              'productManager',
              e.target.checked ? watch('requester') : undefined
            );

            setProdManagerSameAsRequester(!prodManagerSameAsRequester);
          }}
        />

        <Controller
          control={control}
          name="productManager"
          render={({ field: { ref, ...field } }) => {
            const error = errors?.productManager?.commonName;

            return (
              <FormGroup error={!!error}>
                <Label htmlFor={field.name}>
                  {t('contactDetails.productManager.nameField')}
                </Label>
                {!!error?.message && (
                  <FieldErrorMsg>{t(error.message)}</FieldErrorMsg>
                )}
                <CedarContactSelect
                  {...field}
                  id={field.name}
                  // Manually set value so that field rerenders when values are updated
                  value={{
                    euaUserId: watch('productManager.euaUserId'),
                    commonName: watch('productManager.commonName'),
                    email: watch('productManager.email')
                  }}
                  // Manually update fields so that email field rerenders
                  onChange={contact => {
                    setValue(
                      'productManager.commonName',
                      contact?.commonName || ''
                    );
                    setValue(
                      'productManager.euaUserId',
                      contact?.euaUserId || ''
                    );
                    setValue('productManager.email', contact?.email || '');
                  }}
                  disabled={prodManagerSameAsRequester}
                />
              </FormGroup>
            );
          }}
        />

        <Controller
          control={control}
          name="productManager.component"
          render={({ field: { ref, ...field }, fieldState: { error } }) => (
            <FormGroup error={!!error}>
              <Label htmlFor={field.name}>
                {t('contactDetails.productManager.component')}
              </Label>
              {!!error?.message && (
                <FieldErrorMsg>{t(error.message)}</FieldErrorMsg>
              )}

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
          render={({ field: { ref, ...field } }) => (
            <FormGroup>
              <Label htmlFor={field.name}>
                {t('contactDetails.productManager.email')}
              </Label>
              <TextInput
                {...field}
                id={field.name}
                type="text"
                value={watch('productManager.email')}
                disabled
              />
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
                      render={({ field: { ref, ...field } }) => {
                        const error = errors?.isso?.commonName;

                        return (
                          <FormGroup error={!!error}>
                            <Label htmlFor={field.name}>
                              {t('contactDetails.isso.name')}
                            </Label>
                            {!!error?.message && (
                              <FieldErrorMsg>{t(error.message)}</FieldErrorMsg>
                            )}
                            <CedarContactSelect
                              {...field}
                              id={field.name}
                              onChange={contact => {
                                field.onChange({
                                  ...field.value,
                                  commonName: contact?.commonName || '',
                                  euaUserId: contact?.euaUserId || '',
                                  email: contact?.email || ''
                                });
                              }}
                            />
                          </FormGroup>
                        );
                      }}
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
                          {!!error?.message && (
                            <FieldErrorMsg>{t(error.message)}</FieldErrorMsg>
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
                      render={({ field: { ref, ...field } }) => (
                        <FormGroup>
                          <Label htmlFor={field.name}>
                            {t('contactDetails.isso.email')}
                          </Label>
                          <TextInput
                            {...field}
                            id={field.name}
                            value={watch('isso.email')}
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

        {/* Add new contacts */}
        <AdditionalContacts
          contacts={contacts.data.additionalContacts}
          systemIntakeId={systemIntake.id}
          activeContact={activeContact}
          setActiveContact={setActiveContact}
          className="margin-top-4"
        />

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
