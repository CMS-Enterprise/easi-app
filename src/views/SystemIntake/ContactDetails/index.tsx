import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Controller,
  FieldPath,
  FormProvider,
  UseFormSetValue
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Checkbox,
  Dropdown,
  Fieldset,
  Form,
  FormGroup,
  Radio,
  TextInput
} from '@trussworks/react-uswds';

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
  SystemIntakeCollaboratorInput,
  SystemIntakeFormState,
  SystemIntakeRequestType
} from 'types/graphql-global-types';
import { SystemIntakeContactProps } from 'types/systemIntake';
import flattenFormErrors from 'utils/flattenFormErrors';
import SystemIntakeValidationSchema from 'validations/systemIntakeSchema';
import Pager from 'views/TechnicalAssistance/RequestForm/Pager';

import GovernanceTeams from './GovernanceTeams';

import './index.scss';

type ContactDetailsProps = {
  systemIntake: SystemIntake;
};

type ContactFields = Omit<SystemIntakeContactProps, 'role' | 'systemIntakeId'>;

type ContactDetailsForm = {
  requester: ContactFields;
  businessOwner: ContactFields & { sameAsRequester: boolean };
  productManager: ContactFields & { sameAsRequester: boolean };
  isso: ContactFields & { isPresent: boolean };
  governanceTeams: {
    isPresent: boolean;
    teams: SystemIntakeCollaboratorInput[] | null;
  };
};

type SystemIntakeRoleKeys = keyof Omit<ContactDetailsForm, 'governanceTeams'>;

const systemIntakeRolesMap: Record<SystemIntakeRoleKeys, string> = {
  requester: 'Requester',
  businessOwner: 'Business Owner',
  productManager: 'Product Manager',
  isso: 'ISSO'
};

/** Removes `role` and `systemIntakeId` fields from `SystemIntakeContactProps` type */
const getContactFields = ({
  role,
  systemIntakeId,
  ...contact
}: SystemIntakeContactProps): ContactFields => contact;

const ContactDetails = ({ systemIntake }: ContactDetailsProps) => {
  const { t } = useTranslation('intake');
  const history = useHistory();

  const taskListUrl =
    systemIntake.requestType === SystemIntakeRequestType.SHUTDOWN
      ? '/'
      : `/governance-task-list/${systemIntake.id}`;

  const [
    activeContact,
    setActiveContact
  ] = useState<SystemIntakeContactProps | null>(null);

  const {
    contacts,
    createContact,
    updateContact,
    deleteContact
  } = useSystemIntakeContacts(systemIntake.id);

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

  const form = useEasiForm<ContactDetailsForm>({
    resolver: yupResolver(SystemIntakeValidationSchema.contactDetails),
    defaultValues: async () =>
      contacts.refetch().then(values => {
        const requester = getContactFields(values.requester);
        const businessOwner = getContactFields(values.businessOwner);
        const productManager = getContactFields(values.productManager);
        const isso = getContactFields(values.isso);

        return {
          requester,
          businessOwner: {
            ...businessOwner,
            sameAsRequester:
              businessOwner.euaUserId === requester.euaUserId &&
              businessOwner.component === requester.component
          },
          productManager: {
            ...productManager,
            sameAsRequester:
              productManager.euaUserId === requester.euaUserId &&
              productManager.component === requester.component
          },
          isso: {
            isPresent: !!systemIntake.isso.isPresent,
            ...isso
          },
          governanceTeams: {
            isPresent: !!systemIntake.governanceTeams.isPresent,
            teams:
              systemIntake.governanceTeams.teams?.map(team => ({
                collaborator: team.collaborator,
                name: team.name,
                key: team.key
              })) || []
          }
        };
      })
  });

  const {
    control,
    handleSubmit,
    partialSubmit,
    setError,
    watch,
    getValues,
    register,
    formState: {
      defaultValues,
      dirtyFields,
      isDirty,
      errors,
      isSubmitting,
      isSubmitted
    }
  } = form;

  /**
   * RHF's `setValue` function with default options:
   *
   * `shouldDirty`, `shouldTouch` = true
   *
   * `shouldValidate` = true when form has already been submitted
   * */
  const setValue: UseFormSetValue<ContactDetailsForm> = useCallback(
    (name, value, options) =>
      form.setValue<FieldPath<ContactDetailsForm>>(name, value, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: isSubmitted,
        ...options
      }),
    [form.setValue, isSubmitted] // eslint-disable-line react-hooks/exhaustive-deps
  );

  /** Creates or updates contact in database and sets ID field for new contacts */
  const setContact = async (
    role: SystemIntakeRoleKeys,
    contact?: ContactFields
  ) => {
    /** Checks if contact fields are set */
    const shouldUpdate =
      !!dirtyFields[role] && !!contact?.euaUserId && !!contact?.component;

    if (!contact || !shouldUpdate) return null;

    /** If ID field is empty, creates new contact */
    const mutation = contact?.id ? updateContact : createContact;

    return mutation({
      ...contact,
      systemIntakeId: systemIntake.id,
      role: systemIntakeRolesMap[role]
    }).then(contactData =>
      // Set ID field for new contacts
      setValue(`${role}.id`, contactData?.id)
    );
  };

  /** Update contacts and system intake form */
  const submit = async (values: Partial<ContactDetailsForm>) => {
    // Update contacts
    await Promise.all([
      setContact('requester', values?.requester),
      setContact('businessOwner', values?.businessOwner),
      setContact('productManager', values?.productManager),
      // If ISSO is not present, send undefined `values` prop
      setContact('isso', values?.isso?.isPresent ? values?.isso : undefined)
    ]);

    /** Combines existing form values with (possibly partial) submitted values object */
    const formValuesObject: ContactDetailsForm = { ...getValues(), ...values };

    const {
      requester,
      businessOwner,
      productManager,
      isso,
      governanceTeams
    } = formValuesObject;

    // If ISSO is not present in field values but was previously added, delete contact
    if (!isso?.isPresent && contacts.data.isso.id) {
      deleteContact(contacts.data.isso.id);
    }

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
    });
  };

  const requester = watch('requester');
  const businessOwner = watch('businessOwner');
  const productManager = watch('productManager');

  /** Set contact fields from requester values */
  const setFieldsFromRequester = useCallback(
    (
      role: 'businessOwner' | 'productManager',
      /** If false, only component will be set */
      setNameFields: boolean = true
    ) => {
      if (watch(`${role}.sameAsRequester`)) {
        setValue(`${role}.component`, requester.component);

        if (setNameFields) {
          setValue(`${role}.euaUserId`, requester.euaUserId);
          setValue(`${role}.commonName`, requester.commonName);
          setValue(`${role}.email`, requester.email);
        }
      }
    },
    [requester, setValue, watch]
  );

  const hasErrors = Object.keys(errors).length > 0;

  /** Flattened field errors, excluding any root errors */
  const fieldErrors = useMemo(() => flattenFormErrors(errors), [errors]);

  // Scroll errors into view on submit
  useEffect(() => {
    if (hasErrors && isSubmitting) {
      const err = document.querySelector('.usa-alert--error');
      err?.scrollIntoView();
    }
  }, [errors, hasErrors, isSubmitting]);

  // Sync contact fields when "same as requester" checkbox is checked
  useEffect(() => {
    setFieldsFromRequester('businessOwner');
    setFieldsFromRequester('productManager');
  }, [
    businessOwner?.sameAsRequester,
    productManager?.sameAsRequester,
    requester?.component,
    setFieldsFromRequester
  ]);

  // Wait until default values have been updated
  if (!defaultValues) return <PageLoading />;

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
                message={t(message)}
              />
            );
          })}
        </ErrorAlert>
      )}

      <ErrorMessage errors={errors} name="root" as={<Alert type="error" />} />

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
        onSubmit={handleSubmit(values => {
          if (!isDirty) return history.push('request-details');

          return submit(values)
            .then(() => history.push('request-details'))
            .catch(() => {
              setError('root', {
                message: t('error:encounteredIssueTryAgain')
              });
            });
        })}
        className="maxw-none tablet:grid-col-6 margin-bottom-7"
      >
        {/* Requester */}
        <FormGroup>
          <Label htmlFor="requester.commonName">
            {t('contactDetails.requester')}
          </Label>
          <TextInput
            {...register('requester.commonName')}
            ref={null}
            id="requester.commonName"
            type="text"
            disabled
          />
        </FormGroup>

        <FormGroup error={!!errors?.requester?.component}>
          <Label htmlFor="requester.component">
            {t('contactDetails.requesterComponent')}
          </Label>
          <ErrorMessage
            errors={errors}
            name="requester.component"
            as={FieldErrorMsg}
          />

          <Dropdown
            {...register('requester.component')}
            ref={null}
            id="requester.component"
          >
            <option value="" disabled>
              {t('Select an option')}
            </option>
            {cmsDivisionsAndOfficesOptions('requester.component')}
          </Dropdown>
        </FormGroup>

        {/* Business Owner */}

        <h4 className="margin-bottom-1">
          {t('contactDetails.businessOwner.name')}
        </h4>

        <HelpText id="IntakeForm-BusinessOwnerHelp">
          {t('contactDetails.businessOwner.helpText')}
        </HelpText>

        <Checkbox
          {...register('businessOwner.sameAsRequester')}
          ref={null}
          id="businessOwner.sameAsRequester"
          label={t('contactDetails.businessOwner.sameAsRequester')}
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
                <ErrorMessage
                  errors={errors}
                  name="businessOwner.commonName"
                  as={FieldErrorMsg}
                />
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
                  disabled={watch('businessOwner.sameAsRequester')}
                  autoSearch
                />
              </FormGroup>
            );
          }}
        />

        <FormGroup error={!!errors?.businessOwner?.component}>
          <Label htmlFor="businessOwner.component">
            {t('contactDetails.businessOwner.component')}
          </Label>
          <ErrorMessage
            errors={errors}
            name="businessOwner.component"
            as={FieldErrorMsg}
          />

          <Dropdown
            {...register('businessOwner.component')}
            ref={null}
            id="businessOwner.component"
            disabled={watch('businessOwner.sameAsRequester')}
          >
            <option value="" disabled>
              {t('Select an option')}
            </option>
            {cmsDivisionsAndOfficesOptions('businessOwner.component')}
          </Dropdown>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="businessOwner.email">
            {t('contactDetails.businessOwner.email')}
          </Label>
          <TextInput
            {...register('businessOwner.email')}
            ref={null}
            id="businessOwner.email"
            type="text"
            disabled
          />
        </FormGroup>

        {/* Product Manager */}

        <h4 className="margin-bottom-1">
          {t('contactDetails.productManager.name')}
        </h4>

        <HelpText id="IntakeForm-ProductManagerHelp">
          {t('contactDetails.productManager.helpText')}
        </HelpText>

        <Checkbox
          {...register('productManager.sameAsRequester')}
          ref={null}
          id="productManager.sameAsRequester"
          label={t('contactDetails.productManager.sameAsRequester')}
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
                <ErrorMessage
                  errors={errors}
                  name="productManager.commonName"
                  as={FieldErrorMsg}
                />
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
                  disabled={watch('productManager.sameAsRequester')}
                  autoSearch
                />
              </FormGroup>
            );
          }}
        />

        <FormGroup error={!!errors?.productManager?.component}>
          <Label htmlFor="productManager.component">
            {t('contactDetails.productManager.component')}
          </Label>
          <ErrorMessage
            errors={errors}
            name="productManager.component"
            as={FieldErrorMsg}
          />

          <Dropdown
            {...register('productManager.component')}
            ref={null}
            id="productManager.component"
            disabled={watch('productManager.sameAsRequester')}
          >
            <option value="" disabled>
              {t('Select an option')}
            </option>
            {cmsDivisionsAndOfficesOptions('productManager.component')}
          </Dropdown>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="productManager.email">
            {t('contactDetails.productManager.email')}
          </Label>
          <TextInput
            {...register('productManager.email')}
            ref={null}
            id="productManager.email"
            type="text"
            disabled
          />
        </FormGroup>

        {/* ISSO */}

        <FormGroup>
          <Fieldset>
            <legend className="usa-label margin-bottom-1">
              {t('contactDetails.isso.label')}
            </legend>
            <HelpText id="IntakeForm-ISSOHelp">
              {t('contactDetails.isso.helpText')}
            </HelpText>

            <Controller
              control={control}
              name="isso.isPresent"
              render={({ field: { ref, value, ...field } }) => (
                <Radio
                  {...field}
                  inputRef={ref}
                  id={`${field.name}True`}
                  label={t('Yes')}
                  checked={value}
                  onChange={() => field.onChange(true)}
                />
              )}
            />

            {watch('isso.isPresent') && (
              <Fieldset className="margin-left-4 margin-bottom-3">
                <Controller
                  control={control}
                  name="isso"
                  shouldUnregister
                  render={({ field: { ref, ...field } }) => {
                    const error = errors?.isso?.commonName;

                    return (
                      <FormGroup error={!!error}>
                        <Label htmlFor={field.name}>
                          {t('contactDetails.isso.name')}
                        </Label>
                        <ErrorMessage
                          errors={errors}
                          name="isso.commonName"
                          as={FieldErrorMsg}
                        />
                        <CedarContactSelect
                          {...field}
                          id={field.name}
                          // Manually update fields so that email field rerenders
                          onChange={contact => {
                            setValue(
                              'isso.commonName',
                              contact?.commonName || ''
                            );
                            setValue(
                              'isso.euaUserId',
                              contact?.euaUserId || ''
                            );
                            setValue('isso.email', contact?.email || '');
                          }}
                          autoSearch
                        />
                      </FormGroup>
                    );
                  }}
                />

                <FormGroup error={!!errors?.isso?.component}>
                  <Label htmlFor="isso.component">
                    {t('contactDetails.isso.component')}
                  </Label>
                  <ErrorMessage
                    errors={errors}
                    name="isso.component"
                    as={FieldErrorMsg}
                  />

                  <Dropdown
                    {...register('isso.component')}
                    ref={null}
                    id="isso.component"
                  >
                    <option value="" disabled>
                      {t('Select an option')}
                    </option>
                    {cmsDivisionsAndOfficesOptions('isso.component')}
                  </Dropdown>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="isso.email">
                    {t('contactDetails.isso.email')}
                  </Label>
                  <TextInput
                    {...register('isso.email')}
                    ref={null}
                    id="isso.email"
                    type="text"
                    disabled
                  />
                </FormGroup>
              </Fieldset>
            )}

            <Controller
              control={control}
              name="isso.isPresent"
              render={({ field: { ref, value, ...field } }) => (
                <Radio
                  {...field}
                  inputRef={ref}
                  id={`${field.name}False`}
                  label={t('No')}
                  checked={!value}
                  onChange={() => field.onChange(false)}
                />
              )}
            />
          </Fieldset>
        </FormGroup>

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
          taskListUrl={taskListUrl}
          submit={() =>
            partialSubmit({
              update: submit,
              callback: () => history.push(taskListUrl)
            })
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
