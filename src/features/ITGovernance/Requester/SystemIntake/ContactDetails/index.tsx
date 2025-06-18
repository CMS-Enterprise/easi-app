import React, { useCallback, useEffect, useState } from 'react';
import { Controller, FieldPath, UseFormSetValue } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Checkbox,
  Fieldset,
  Form,
  FormGroup,
  Radio,
  Select,
  TextInput
} from '@trussworks/react-uswds';
import Pager from 'features/TechnicalAssistance/Requester/RequestForm/Pager';
import {
  GetSystemIntakeDocument,
  SystemIntakeFormState,
  SystemIntakeFragmentFragment,
  SystemIntakeGovernanceTeamInput,
  SystemIntakeRequestType,
  useUpdateSystemIntakeContactDetailsMutation
} from 'gql/generated/graphql';

import AdditionalContacts from 'components/AdditionalContacts';
import cmsDivisionsAndOfficesOptions from 'components/AdditionalContacts/cmsDivisionsAndOfficesOptions';
import Alert from 'components/Alert';
import AutoSave from 'components/AutoSave';
import CedarContactSelect from 'components/CedarContactSelect';
import { EasiFormProvider, useEasiForm } from 'components/EasiForm';
import { ErrorAlert, ErrorAlertMessage } from 'components/ErrorAlert';
import FeedbackBanner from 'components/FeedbackBanner';
import FieldErrorMsg from 'components/FieldErrorMsg';
import HelpText from 'components/HelpText';
import Label from 'components/Label';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import PageNumber from 'components/PageNumber';
import RequiredFieldsText from 'components/RequiredFieldsText';
import useSystemIntakeContacts from 'hooks/useSystemIntakeContacts';
import {
  ContactDetailsForm,
  ContactFields,
  SystemIntakeContactProps
} from 'types/systemIntake';
import flattenFormErrors from 'utils/flattenFormErrors';
import SystemIntakeValidationSchema from 'validations/systemIntakeSchema';

import GovernanceTeams from './GovernanceTeams';
import {
  formatContactFields,
  formatGovernanceTeamsInput,
  formatGovTeamsField
} from './utils';

import './index.scss';

type ContactDetailsProps = {
  systemIntake: SystemIntakeFragmentFragment;
};

type SystemIntakeRoleKeys = keyof Omit<ContactDetailsForm, 'governanceTeams'>;

const systemIntakeRolesMap: Record<SystemIntakeRoleKeys, string> = {
  requester: 'Requester',
  businessOwner: 'Business Owner',
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

  const [mutate] = useUpdateSystemIntakeContactDetailsMutation({
    refetchQueries: [
      {
        query: GetSystemIntakeDocument,
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

      <PageHeading className="margin-top-4 margin-bottom-1">
        {t('contactDetails.heading')}
      </PageHeading>

      <p className="font-body-lg line-height-body-5 margin-top-0 margin-bottom-1">
        {t('contactDetails.intakeProcessDescription')}
      </p>

      <RequiredFieldsText className="margin-top-0 margin-bottom-5" />

      {systemIntake.requestFormState ===
        SystemIntakeFormState.EDITS_REQUESTED && (
        <FeedbackBanner id={systemIntake.id} type="Intake Request" />
      )}

      <Form
        onSubmit={handleSubmit(() =>
          submit(() => history.push('request-details'), true)
        )}
        className="maxw-none tablet:grid-col-9 margin-bottom-7"
      >
        {/* Requester */}
        <FormGroup className="border-top border-base-light padding-top-1">
          <p className="text-bold margin-y-0">
            {t('contactDetails.requesterInformation')}
          </p>
          <Label
            htmlFor="requesterCommonName"
            required
            className="margin-top-3 text-normal"
          >
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
          <Label htmlFor="requesterComponent" required className="text-normal">
            {t('contactDetails.requesterComponent')}
          </Label>
          <ErrorMessage
            errors={errors}
            name="requester.component"
            as={FieldErrorMsg}
          />
          <Select
            {...register('requester.component')}
            ref={null}
            id="requesterComponent"
          >
            <option value="" disabled>
              {t('Select an option')}
            </option>
            {cmsDivisionsAndOfficesOptions('requester.component')}
          </Select>
        </FormGroup>

        {/* Business Owner */}

        <Fieldset className="margin-top-3 border-top border-base-light padding-top-1">
          <p className="margin-y-1 text-bold">
            {t('contactDetails.businessOwner.info')}
          </p>
          <HelpText id="businessOwnerHelpText" className="margin-bottom-3">
            {t('contactDetails.businessOwner.helpText')}
          </HelpText>

          <Checkbox
            {...register('businessOwner.sameAsRequester')}
            ref={null}
            id="businessOwnerSameAsRequester"
            label={t('contactDetails.businessOwner.sameAsRequester')}
          />

          <FormGroup
            error={!!errors?.businessOwner?.commonName}
            className="margin-bottom-3"
          >
            <Label
              htmlFor="businessOwnerCommonName"
              required
              className="text-normal"
            >
              {t('contactDetails.businessOwner.nameField')}
            </Label>
            <HelpText id="businessOwnerCommonName">
              {t('contactDetails.businessOwner.searchesEUADatabase')}
            </HelpText>
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

          <FormGroup
            error={!!errors?.businessOwner?.component}
            className="margin-bottom-3"
          >
            <Label
              htmlFor="businessOwnerComponent"
              required
              className="text-normal"
            >
              {t('contactDetails.businessOwner.component')}
            </Label>
            <ErrorMessage
              errors={errors}
              name="businessOwner.component"
              as={FieldErrorMsg}
            />
            <Select
              {...register('businessOwner.component')}
              ref={null}
              id="businessOwnerComponent"
              disabled={watch('businessOwner.sameAsRequester')}
            >
              <option value="" disabled>
                {t('Select an option')}
              </option>
              {cmsDivisionsAndOfficesOptions('businessOwner.component')}
            </Select>
          </FormGroup>
        </Fieldset>

        {/* Product Manager */}
        <Fieldset className="margin-top-3 border-top border-base-light padding-top-1">
          <p className="margin-y-1 text-bold">
            {t('contactDetails.productManager.name')}
          </p>

          <HelpText id="productManagerHelpText" className="margin-bottom-3">
            {t('contactDetails.productManager.helpText')}
          </HelpText>

          <Checkbox
            {...register('productManager.sameAsRequester')}
            ref={null}
            id="productManagerSameAsRequester"
            label={t('contactDetails.productManager.sameAsRequester')}
          />

          <FormGroup error={!!errors?.productManager?.commonName}>
            <Label
              htmlFor="productManagerCommonName"
              required
              className="text-normal
            "
            >
              {t('contactDetails.productManager.nameField')}
            </Label>
            <HelpText id="productManagerCommonName">
              {t('contactDetails.businessOwner.searchesEUADatabase')}
            </HelpText>
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
            <Label
              htmlFor="productManagerComponent"
              required
              className="text-normal"
            >
              {t('contactDetails.productManager.component')}
            </Label>
            <ErrorMessage
              errors={errors}
              name="productManager.component"
              as={FieldErrorMsg}
            />
            <Select
              {...register('productManager.component')}
              ref={null}
              id="productManagerComponent"
              disabled={watch('productManager.sameAsRequester')}
            >
              <option value="" disabled>
                {t('Select an option')}
              </option>
              {cmsDivisionsAndOfficesOptions('productManager.component')}
            </Select>
          </FormGroup>
        </Fieldset>

        {/* ISSO */}
        {/* TODO: ITGO Request to remove this section */}

        <Fieldset className="margin-top-3 border-top border-base-light padding-top-1">
          <p className="margin-y-1 text-bold">
            {t('contactDetails.isso.label')}
          </p>

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
                <Select
                  {...register('isso.component')}
                  ref={null}
                  id="issoComponent"
                >
                  <option value="" disabled>
                    {t('Select an option')}
                  </option>
                  {cmsDivisionsAndOfficesOptions('isso.component')}
                </Select>
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
        <Fieldset className="margin-top-3 border-top border-base-light padding-top-1">
          <AdditionalContacts
            contacts={contacts.data.additionalContacts}
            systemIntakeId={systemIntake.id}
            activeContact={activeContact}
            setActiveContact={setActiveContact}
            className="margin-top-4"
          />
        </Fieldset>

        {/* Governance Teams */}

        {/* TODO: remove EA option and add 508 clearance officer */}
        <EasiFormProvider<ContactDetailsForm> {...form}>
          <GovernanceTeams />
        </EasiFormProvider>

        <Pager
          next={{
            type: 'submit'
          }}
          border
          taskListUrl={saveExitLink}
          submit={() => submit(() => history.push(saveExitLink))}
          className="margin-top-5"
        />
      </Form>

      <AutoSave values={watch()} onSave={submit} debounceDelay={3000} />

      <PageNumber currentPage={1} totalPages={5} className="margin-bottom-15" />
    </>
  );
};

export default ContactDetails;
