import React, { useCallback, useEffect, useState } from 'react';
import { Controller, FieldPath, UseFormSetValue } from 'react-hook-form';
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
import { EasiFormProvider, useEasiForm } from 'components/EasiForm';
import FeedbackBanner from 'components/FeedbackBanner';
import MandatoryFieldsAlert from 'components/MandatoryFieldsAlert';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import PageNumber from 'components/PageNumber';
import Alert from 'components/shared/Alert';
import AutoSave from 'components/shared/AutoSave';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
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
  SystemIntakeGovernanceTeamInput,
  SystemIntakeRequestType
} from 'types/graphql-global-types';
import {
  ContactDetailsForm,
  ContactFields,
  SystemIntakeContactProps
} from 'types/systemIntake';
import flattenFormErrors from 'utils/flattenFormErrors';
import SystemIntakeValidationSchema from 'validations/systemIntakeSchema';
import Pager from 'views/TechnicalAssistance/RequestForm/Pager';

import GovernanceTeams from './GovernanceTeams';
import {
  formatContactFields,
  formatGovernanceTeamsInput,
  formatGovTeamsField
} from './utils';

import './index.scss';

type ContactDetailsProps = {
  systemIntake: SystemIntake;
};

type SystemIntakeRoleKeys = keyof Omit<ContactDetailsForm, 'governanceTeams'>;

const systemIntakeRolesMap: Record<SystemIntakeRoleKeys, string> = {
  requester: 'Requester',
  businessOwner: 'Business owner',
  productManager: 'Product Manager',
  isso: 'ISSO'
};

const ContactDetails = ({ systemIntake }: ContactDetailsProps) => {
  const { t } = useTranslation('intake');
  const history = useHistory();

  const saveExitLink =
    systemIntake.requestType === SystemIntakeRequestType.SHUTDOWN
      ? '/'
      : `/governance-task-list/${systemIntake.id}`;

  const [activeContact, setActiveContact] =
    useState<SystemIntakeContactProps | null>(null);

  const { contacts, createContact, updateContact, deleteContact } =
    useSystemIntakeContacts(systemIntake.id);

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

  const form = useEasiForm<ContactDetailsForm>({
    resolver: yupResolver(SystemIntakeValidationSchema.contactDetails)
  });

  const {
    control,
    handleSubmit,
    setError,
    watch,
    register,
    setFocus,
    reset,
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

  const updateSystemIntake = async () => {
    const values = watch();

    const { requester, businessOwner, productManager, isso } = values;

    const governanceTeams: SystemIntakeGovernanceTeamInput = {
      isPresent: values.governanceTeams.isPresent,
      teams: formatGovernanceTeamsInput(values.governanceTeams.teams)
    };

    // Update contacts
    await Promise.all([
      setContact('requester', requester),
      setContact('businessOwner', businessOwner),
      setContact('productManager', productManager),
      // If ISSO is not present, send undefined `values` prop
      setContact('isso', isso?.isPresent ? isso : undefined)
    ]);

    // If ISSO is not present in field values but was previously added, delete contact
    if (!isso?.isPresent && contacts.data.isso.id) {
      deleteContact(contacts.data.isso.id);
    }

    // Update system intake
    return mutate({
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

  /** Update contacts and system intake form */
  const submit = async (
    callback: () => void = () => {},
    validate: boolean = false
  ) => {
    if (!isDirty) return callback();

    // Update intake
    const result = await updateSystemIntake();

    if (!result?.errors) return callback();

    // If validating form, show error on server error
    if (validate) {
      return setError('root', {
        message: t('error:encounteredIssueTryAgain')
      });
    }

    // If skipping errors, return callback
    return callback();
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
  const fieldErrors = flattenFormErrors<ContactDetailsForm>(errors);

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

  // Set default form values after contacts are loaded
  useEffect(() => {
    if (!contacts.loading && !defaultValues) {
      const { data } = contacts;

      reset({
        requester: formatContactFields(data.requester),
        businessOwner: {
          ...formatContactFields(data.businessOwner),
          sameAsRequester:
            data.businessOwner.euaUserId === data.requester.euaUserId &&
            data.businessOwner.component === data.requester.component
        },
        productManager: {
          ...formatContactFields(data.productManager),
          sameAsRequester:
            data.productManager.euaUserId === data.requester.euaUserId &&
            data.productManager.component === data.requester.component
        },
        isso: {
          isPresent: !!systemIntake.isso.isPresent,
          ...formatContactFields(data.isso)
        },
        governanceTeams: {
          isPresent: !!systemIntake.governanceTeams.isPresent,
          teams: formatGovTeamsField(systemIntake.governanceTeams.teams)
        }
      });
    }
  }, [
    contacts,
    defaultValues,
    reset,
    systemIntake.governanceTeams,
    systemIntake.isso.isPresent
  ]);

  // Wait until default values have been updated
  if (!defaultValues) return <PageLoading />;

  return (
    <>
      {Object.keys(errors).length > 0 && (
        <ErrorAlert
          testId="contact-details-errors"
          classNames="margin-top-3"
          heading={t('form:inputError.checkFix')}
          autoFocus={false}
        >
          {Object.keys(fieldErrors).map(key => {
            return (
              <ErrorMessage
                errors={errors}
                name={key}
                key={key}
                render={({ message }) => (
                  <ErrorAlertMessage
                    message={message}
                    onClick={() =>
                      setFocus(key as FieldPath<ContactDetailsForm>)
                    }
                  />
                )}
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
        onSubmit={handleSubmit(() =>
          submit(() => history.push('request-details'), true)
        )}
        className="maxw-none tablet:grid-col-6 margin-bottom-7"
      >
        {/* Requester */}
        <FormGroup>
          <Label htmlFor="requesterCommonName">
            {t('contactDetails.requester')}
          </Label>
          <TextInput
            {...register('requester.commonName')}
            ref={null}
            id="requesterCommonName"
            type="text"
            disabled
          />
        </FormGroup>

        <FormGroup error={!!errors?.requester?.component}>
          <Label htmlFor="requesterComponent">
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
            id="requesterComponent"
          >
            <option value="" disabled>
              {t('Select an option')}
            </option>
            {cmsDivisionsAndOfficesOptions('requester.component')}
          </Dropdown>
        </FormGroup>

        {/* Business owner */}

        <Fieldset className="margin-top-3">
          <legend
            className="text-bold margin-bottom-1"
            aria-describedby="businessOwnerHelpText"
          >
            {t('contactDetails.businessOwner.name')}
          </legend>

          <HelpText id="businessOwnerHelpText">
            {t('contactDetails.businessOwner.helpText')}
          </HelpText>

          <Checkbox
            {...register('businessOwner.sameAsRequester')}
            ref={null}
            id="businessOwnerSameAsRequester"
            label={t('contactDetails.businessOwner.sameAsRequester')}
          />

          <FormGroup error={!!errors?.businessOwner?.commonName}>
            <Label htmlFor="businessOwnerCommonName">
              {t('contactDetails.businessOwner.nameField')}
            </Label>
            <ErrorMessage
              errors={errors}
              name="businessOwner.commonName"
              as={FieldErrorMsg}
            />
            <Controller
              control={control}
              name="businessOwner.commonName"
              render={({ field: { ref, ...field } }) => {
                return (
                  <CedarContactSelect
                    {...field}
                    inputRef={ref}
                    id="businessOwnerCommonName"
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
                );
              }}
            />
          </FormGroup>

          <FormGroup error={!!errors?.businessOwner?.component}>
            <Label htmlFor="businessOwnerComponent">
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
              id="businessOwnerComponent"
              disabled={watch('businessOwner.sameAsRequester')}
            >
              <option value="" disabled>
                {t('Select an option')}
              </option>
              {cmsDivisionsAndOfficesOptions('businessOwner.component')}
            </Dropdown>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="businessOwnerEmail">
              {t('contactDetails.businessOwner.email')}
            </Label>
            <TextInput
              {...register('businessOwner.email')}
              ref={null}
              id="businessOwnerEmail"
              type="text"
              disabled
            />
          </FormGroup>
        </Fieldset>

        {/* Product Manager */}
        <Fieldset className="margin-top-3">
          <legend
            className="text-bold margin-bottom-1"
            aria-describedby="productManagerHelpText"
          >
            {t('contactDetails.productManager.name')}
          </legend>

          <HelpText id="productManagerHelpText">
            {t('contactDetails.productManager.helpText')}
          </HelpText>

          <Checkbox
            {...register('productManager.sameAsRequester')}
            ref={null}
            id="productManagerSameAsRequester"
            label={t('contactDetails.productManager.sameAsRequester')}
          />

          <FormGroup error={!!errors?.productManager?.commonName}>
            <Label htmlFor="productManagerCommonName">
              {t('contactDetails.productManager.nameField')}
            </Label>
            <ErrorMessage
              errors={errors}
              name="productManager.commonName"
              as={FieldErrorMsg}
            />
            <Controller
              control={control}
              name="productManager.commonName"
              render={({ field: { ref, ...field } }) => {
                return (
                  <CedarContactSelect
                    {...field}
                    inputRef={ref}
                    id="productManagerCommonName"
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
                );
              }}
            />
          </FormGroup>

          <FormGroup error={!!errors?.productManager?.component}>
            <Label htmlFor="productManagerComponent">
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
              id="productManagerComponent"
              disabled={watch('productManager.sameAsRequester')}
            >
              <option value="" disabled>
                {t('Select an option')}
              </option>
              {cmsDivisionsAndOfficesOptions('productManager.component')}
            </Dropdown>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="productManagerEmail">
              {t('contactDetails.productManager.email')}
            </Label>
            <TextInput
              {...register('productManager.email')}
              ref={null}
              id="productManagerEmail"
              type="text"
              disabled
            />
          </FormGroup>
        </Fieldset>

        {/* ISSO */}

        <Fieldset className="margin-top-3">
          <legend
            className="text-bold margin-bottom-1"
            aria-describedby="issoHelpText"
          >
            {t('contactDetails.isso.label')}
          </legend>

          <HelpText id="issoHelpText">
            {t('contactDetails.isso.helpText')}
          </HelpText>

          <Controller
            control={control}
            name="isso.isPresent"
            render={({ field: { ref, value, ...field } }) => (
              <Radio
                {...field}
                inputRef={ref}
                id="issoIsPresentTrue"
                label={t('Yes')}
                checked={value}
                onChange={() => field.onChange(true)}
              />
            )}
          />

          {watch('isso.isPresent') && (
            <div className="margin-left-4 margin-bottom-3">
              <FormGroup error={!!errors?.isso?.commonName}>
                <Label htmlFor="issoCommonName">
                  {t('contactDetails.isso.name')}
                </Label>
                <ErrorMessage
                  errors={errors}
                  name="isso.commonName"
                  as={FieldErrorMsg}
                />
                <Controller
                  control={control}
                  name="isso.commonName"
                  render={({ field: { ref, ...field } }) => {
                    return (
                      <CedarContactSelect
                        {...field}
                        inputRef={ref}
                        id="issoCommonName"
                        // Manually set value
                        value={{
                          euaUserId: watch('isso.euaUserId'),
                          commonName: watch('isso.commonName'),
                          email: watch('isso.email')
                        }}
                        // Manually update fields so that email field rerenders
                        onChange={contact => {
                          setValue(
                            'isso.commonName',
                            contact?.commonName || ''
                          );
                          setValue('isso.euaUserId', contact?.euaUserId || '');
                          setValue('isso.email', contact?.email || '');
                        }}
                        autoSearch
                      />
                    );
                  }}
                />
              </FormGroup>

              <FormGroup error={!!errors?.isso?.component}>
                <Label htmlFor="issoComponent">
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
                  id="issoComponent"
                >
                  <option value="" disabled>
                    {t('Select an option')}
                  </option>
                  {cmsDivisionsAndOfficesOptions('isso.component')}
                </Dropdown>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="issoEmail">
                  {t('contactDetails.isso.email')}
                </Label>
                <TextInput
                  {...register('isso.email')}
                  ref={null}
                  id="issoEmail"
                  type="text"
                  disabled
                />
              </FormGroup>
            </div>
          )}

          <Controller
            control={control}
            name="isso.isPresent"
            render={({ field: { ref, value, ...field } }) => (
              <Radio
                {...field}
                inputRef={ref}
                id="issoIsPresentFalse"
                label={t('No')}
                checked={!value}
                onChange={() => {
                  field.onChange(false);

                  // Reset ISSO fields
                  setValue('isso.commonName', '');
                  setValue('isso.euaUserId', '');
                  setValue('isso.email', '');
                  setValue('isso.component', '');
                }}
              />
            )}
          />
        </Fieldset>

        {/* Add new contacts */}
        <AdditionalContacts
          contacts={contacts.data.additionalContacts}
          systemIntakeId={systemIntake.id}
          activeContact={activeContact}
          setActiveContact={setActiveContact}
          className="margin-top-4"
        />

        {/* Governance Teams */}

        <EasiFormProvider<ContactDetailsForm> {...form}>
          <GovernanceTeams />
        </EasiFormProvider>

        <Pager
          next={{
            type: 'submit'
          }}
          border={false}
          taskListUrl={saveExitLink}
          submit={() => submit(() => history.push(saveExitLink))}
          className="margin-top-4"
        />
      </Form>

      <AutoSave values={watch()} onSave={submit} debounceDelay={3000} />

      <PageNumber currentPage={1} totalPages={5} />
    </>
  );
};

export default ContactDetails;
