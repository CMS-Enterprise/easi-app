import React, { useEffect, useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  ButtonGroup,
  Fieldset,
  Label,
  ModalHeading,
  Select
} from '@trussworks/react-uswds';
import { ExternalRecipientAlert } from 'features/TechnicalAssistance/Admin/_components/ActionFormWrapper/Recipients';
import {
  SystemIntakeContactRole,
  useCreateSystemIntakeContactMutation,
  useUpdateSystemIntakeContactMutation
} from 'gql/generated/graphql';
import { capitalize } from 'lodash';

import Alert from 'components/Alert';
import CedarContactSelect from 'components/CedarContactSelect';
import { useEasiForm } from 'components/EasiForm';
import FieldErrorMsg from 'components/FieldErrorMsg';
import FieldGroup from 'components/FieldGroup';
import HelpText from 'components/HelpText';
import Modal from 'components/Modal';
import MultiSelect from 'components/MultiSelect';
import RequiredFieldsText from 'components/RequiredFieldsText';
import { getNonLegacyComponents } from 'constants/cmsComponentsMap';
import { ContactFormFields } from 'types/systemIntake';
import { ContactFormSchema } from 'validations/systemIntakeSchema';

type ContactFormModalProps = {
  systemIntakeId: string;
  type: 'contact' | 'recipient';
  closeModal: () => void;
  isOpen: boolean;
  initialValues?: ContactFormFields | null;
  createContactCallback?: (contact: ContactFormFields) => void;
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

const ContactFormModal = ({
  systemIntakeId,
  type,
  closeModal,
  isOpen,
  initialValues,
  createContactCallback
}: ContactFormModalProps) => {
  const { t } = useTranslation('intake');

  const [create] = useCreateSystemIntakeContactMutation({
    refetchQueries: ['GetSystemIntakeContacts'],
    awaitRefetchQueries: true
  });

  const [update] = useUpdateSystemIntakeContactMutation({
    refetchQueries: ['GetSystemIntakeContacts'],
    awaitRefetchQueries: true
  });

  const {
    control,
    handleSubmit,
    register,
    watch,
    reset,
    setError,
    formState: { errors, isValid, defaultValues, isSubmitSuccessful }
  } = useEasiForm<ContactFormFields>({
    resolver: yupResolver(ContactFormSchema)
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

        closeModal();
      })
      .catch(() =>
        setError('root', {
          message: t('contactDetails.additionalContacts.errors.root', {
            action,
            type
          })
        })
      );
  });

  // Reset default values
  // This is needed to ensure that form defaults are set when edit button is clicked
  useEffect(() => {
    reset(initialValues || emptyContactFields);
  }, [initialValues, reset, isSubmitSuccessful]);

  return (
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
      className="font-body-md maxw-mobile-lg"
    >
      <Fieldset>
        <legend>
          <ModalHeading className="margin-bottom-0">
            {t(`contactDetails.additionalContacts.${action}`, {
              type
            })}
          </ModalHeading>
        </legend>

        <RequiredFieldsText className="margin-y-0" />

        <ErrorMessage errors={errors} name="root" as={<Alert type="error" />} />

        <FieldGroup className="margin-top-2" error={!!errors.userAccount}>
          <Label
            className="text-normal"
            htmlFor="react-select-userAccount-input"
          >
            {t('contactDetails.additionalContacts.name', {
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
          <Label className="text-normal" htmlFor="component">
            {t('contactDetails.additionalContacts.component', {
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
          <Label className="text-normal" htmlFor="roles-combobox">
            {t('contactDetails.additionalContacts.roles', {
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

        <ExternalRecipientAlert email={watch('userAccount.email')} />

        <ButtonGroup className="margin-top-205">
          <Button
            className="margin-right-2"
            type="button"
            onClick={submit}
            disabled={!isValid}
          >
            {t('contactDetails.additionalContacts.submit', {
              context: action,
              type
            })}
          </Button>
          <Button
            className="text-error"
            type="button"
            onClick={() => closeModal()}
            unstyled
          >
            {t('Cancel')}
          </Button>
        </ButtonGroup>
      </Fieldset>
    </Modal>
  );
};

export default ContactFormModal;
