import React, { useEffect, useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  ButtonGroup,
  Fieldset,
  Label,
  Select
} from '@trussworks/react-uswds';
import { ExternalRecipientAlert } from 'features/TechnicalAssistance/Admin/_components/ActionFormWrapper/Recipients';
import {
  GetSystemIntakeContactsDocument,
  SystemIntakeContactRole,
  useCreateSystemIntakeContactMutation,
  useUpdateSystemIntakeContactMutation
} from 'gql/generated/graphql';
import { capitalize } from 'lodash';

import Alert from 'components/Alert';
import CedarContactSelect from 'components/CedarContactSelect';
import CheckboxField from 'components/CheckboxField';
import { useEasiForm } from 'components/EasiForm';
import FieldErrorMsg from 'components/FieldErrorMsg';
import FieldGroup from 'components/FieldGroup';
import HelpText from 'components/HelpText';
import MultiSelect from 'components/MultiSelect';
import { getNonLegacyComponents } from 'constants/cmsComponentsMap';
import useMessage from 'hooks/useMessage';
import { ContactFormFields } from 'types/systemIntake';
import { ContactFormSchema } from 'validations/systemIntakeSchema';

type ContactFormProps = {
  systemIntakeId: string;
  type: 'contact' | 'recipient';
  initialValues?: ContactFormFields | null;
  createContactCallback?: (contact: ContactFormFields) => void;
  // Controls copy and UI differences when used in a modal vs page
  copyVariant?: 'requestHome' | 'additionalContacts';
  showExternalRecipientAlert?: boolean;
  onCancel?: () => void;
  onSuccess?: (values: ContactFormFields) => void;
  onError?: (message: React.ReactNode) => void;
};

const emptyContactFields: ContactFormFields = {
  id: '',
  userAccount: {
    username: '',
    commonName: '',
    email: ''
  },
  component: null,
  roles: [],
  isRequester: false
};

const ContactForm = ({
  systemIntakeId,
  type,
  initialValues,
  createContactCallback,
  copyVariant = 'requestHome',
  showExternalRecipientAlert = false,
  onCancel,
  onSuccess,
  onError
}: ContactFormProps) => {
  const { t } = useTranslation('intake');

  const history = useHistory();
  const { showMessage, showMessageOnNextPage } = useMessage();
  const [create] = useCreateSystemIntakeContactMutation({
    refetchQueries: [
      {
        query: GetSystemIntakeContactsDocument,
        variables: { id: systemIntakeId }
      }
    ],
    awaitRefetchQueries: true
  });

  const [update] = useUpdateSystemIntakeContactMutation({
    refetchQueries: [
      {
        query: GetSystemIntakeContactsDocument,
        variables: { id: systemIntakeId }
      }
    ],
    awaitRefetchQueries: true
  });

  const {
    control,
    handleSubmit,
    register,
    watch,
    reset,
    formState: { errors, isValid, defaultValues, isSubmitSuccessful }
  } = useEasiForm<ContactFormFields>({
    resolver: yupResolver(ContactFormSchema),
    defaultValues: initialValues || emptyContactFields
  });

  /** Set form action to edit if default values has an id */
  const action: 'add' | 'edit' = useMemo(
    () => (defaultValues?.id ? 'edit' : 'add'),
    [defaultValues]
  );

  const handleCreateContact = (values: ContactFormFields) =>
    create({
      variables: {
        input: {
          systemIntakeId,
          euaUserId: values.userAccount.username,
          component: values.component!,
          roles: values.roles,
          isRequester: values.isRequester
        }
      }
    });

  const handleUpdateContact = (values: ContactFormFields) =>
    update({
      variables: {
        input: {
          id: values.id,
          component: values.component!,
          roles: values.roles,
          isRequester: values.isRequester
        }
      }
    });

  const submit = handleSubmit(async values => {
    const mutate =
      action === 'edit' ? handleUpdateContact : handleCreateContact;

    return mutate(values)
      .then(() => {
        if (action === 'add') {
          createContactCallback?.(values);
        }
        if (onSuccess) {
          onSuccess(values);
          return;
        }
        // Default page behavior
        showMessageOnNextPage(
          <Trans
            t={t}
            i18nKey="requestHome:addPOC.successAlert"
            values={{
              name: values.userAccount.commonName
            }}
            components={{
              bold: <strong />
            }}
          />,
          {
            type: 'success'
          }
        );
        history.push('request-home');
      })
      .catch(() => {
        const errorNode = (
          <Trans
            t={t}
            i18nKey="contactDetails.additionalContacts.errors.root"
            values={{
              action,
              type
            }}
          />
        );

        if (onError) {
          onError(errorNode);
          return;
        }

        window.scrollTo(0, 0);
        showMessage(errorNode, {
          type: 'error'
        });
      });
  });

  // Reset default values
  // This is needed to ensure that form defaults are set when edit button is clicked
  useEffect(() => {
    reset(initialValues || emptyContactFields);
  }, [initialValues, reset, isSubmitSuccessful]);

  return (
    <>
      <Fieldset>
        <ErrorMessage errors={errors} name="root" as={<Alert type="error" />} />

        <FieldGroup className="margin-top-2" error={!!errors.userAccount}>
          <Label
            className={
              copyVariant === 'requestHome' ? 'text-bold' : 'text-normal'
            }
            htmlFor="react-select-userAccount-input"
            requiredMarker
          >
            {copyVariant === 'requestHome'
              ? t('requestHome:sharedPOC.name', { context: action })
              : t('contactDetails.additionalContacts.name', {
                  type: action === 'edit' ? capitalize(type) : type,
                  context: action
                })}
          </Label>
          <HelpText className="margin-top-05" id="userAccountHelpText">
            {t('contactDetails.additionalContacts.nameHelpText')}
          </HelpText>

          <ErrorMessage
            errors={errors}
            name="userAccount"
            as={<FieldErrorMsg />}
          />

          <Controller
            control={control}
            name="userAccount"
            render={({ field: { ref, ...field } }) => {
              return (
                <CedarContactSelect
                  {...field}
                  disabled={action === 'edit'}
                  id="userAccount"
                  name="userAccount"
                  ariaDescribedBy="userAccountHelpText"
                  value={{
                    euaUserId: field.value.username,
                    commonName: field.value.commonName,
                    email: field.value.email
                  }}
                  onChange={contact => {
                    field.onChange({
                      username: contact?.euaUserId || '',
                      commonName: contact?.commonName || '',
                      email: contact?.email || ''
                    });
                  }}
                />
              );
            }}
          />
        </FieldGroup>

        <FieldGroup className="margin-top-2" error={!!errors.component}>
          <Label
            className={
              copyVariant === 'requestHome' ? 'text-bold' : 'text-normal'
            }
            htmlFor="component"
            requiredMarker
          >
            {copyVariant === 'requestHome'
              ? t('requestHome:sharedPOC.component', { context: action })
              : t('contactDetails.additionalContacts.component', {
                  type: action === 'edit' ? capitalize(type) : type,
                  context: action
                })}
          </Label>

          <ErrorMessage
            errors={errors}
            name="component"
            as={<FieldErrorMsg />}
          />

          <Select
            {...register('component')}
            ref={null}
            id="component"
            data-testid="component-select"
            className="maxw-full"
          >
            <option value="" disabled>
              {t('contactDetails.additionalContacts.select')}
            </option>
            {getNonLegacyComponents().map(
              ({ labelKey, acronym, enum: enumValue }) => {
                const label = t(labelKey);
                return (
                  <option key={enumValue} value={enumValue}>
                    {acronym ? `${label} (${acronym})` : label}
                  </option>
                );
              }
            )}
          </Select>
        </FieldGroup>

        <FieldGroup className="margin-top-2" error={!!errors.roles}>
          <Label
            className={
              copyVariant === 'requestHome' ? 'text-bold' : 'text-normal'
            }
            htmlFor="roles-combobox"
            requiredMarker
          >
            {copyVariant === 'requestHome'
              ? t('requestHome:sharedPOC.roles')
              : t('contactDetails.additionalContacts.roles', {
                  type: action === 'edit' ? capitalize(type) : type,
                  context: action
                })}
          </Label>

          <ErrorMessage errors={errors} name="roles" as={<FieldErrorMsg />} />

          <Controller
            control={control}
            name="roles"
            render={({ field: { ref, ...field } }) => (
              <MultiSelect
                {...field}
                id="roles"
                inputId="roles-combobox"
                initialValues={field.value}
                options={Object.keys(SystemIntakeContactRole).map(role => ({
                  value: role,
                  label: t(`contactDetails.systemIntakeContactRoles.${role}`)
                }))}
              />
            )}
          />
        </FieldGroup>

        <FieldGroup className="margin-top-2">
          <Controller
            control={control}
            name="isRequester"
            render={({ field: { ref, onChange, ...field } }) => {
              return (
                <CheckboxField
                  {...field}
                  id={field.name}
                  value="true"
                  checked={field.value ?? false}
                  disabled={!!defaultValues?.isRequester}
                  onChange={e => onChange(e.target.checked)}
                  label={t('requestHome:addPOC.isRequester')}
                  labelDescription={
                    <p
                      className={`margin-y-0 padding-left-4 font-sans-xs ${defaultValues?.isRequester ? 'text-gray-50' : ''}`}
                    >
                      {action === 'add' &&
                        t('requestHome:addPOC.isRequesterHint')}
                      {action === 'edit' &&
                        (defaultValues?.isRequester
                          ? t('requestHome:editPOC.notRemovePrimary')
                          : t('requestHome:editPOC.changePrimary'))}
                    </p>
                  }
                />
              );
            }}
          />
        </FieldGroup>

        {showExternalRecipientAlert && (
          <ExternalRecipientAlert email={watch('userAccount.email')} />
        )}

        {copyVariant === 'requestHome' && action === 'add' && (
          <Alert type="info" className="margin-top-8 margin-bottom-4">
            {t('requestHome:addPOC.addAlert')}
          </Alert>
        )}

        <ButtonGroup className="margin-top-205">
          <Button
            className="margin-right-2"
            type="button"
            onClick={submit}
            disabled={!isValid}
          >
            {t('contactDetails.additionalContacts.submit', {
              context: action,
              type: copyVariant === 'requestHome' ? 'point of contact' : type
            })}
          </Button>
          {onCancel && (
            <Button
              className="text-error"
              type="button"
              onClick={() => onCancel()}
              unstyled
            >
              {t('Cancel')}
            </Button>
          )}
        </ButtonGroup>
      </Fieldset>
    </>
  );
};

export default ContactForm;
