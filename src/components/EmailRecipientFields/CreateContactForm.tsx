import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  ButtonGroup,
  Dropdown,
  ErrorMessage,
  Fieldset,
  FormGroup
} from '@trussworks/react-uswds';

import cmsDivisionsAndOfficesOptions from 'components/AdditionalContacts/cmsDivisionsAndOfficesOptions';
import CedarContactSelect from 'components/CedarContactSelect';
import Label from 'components/shared/Label';
import contactRoles from 'constants/enums/contactRoles';
import { PersonRole } from 'types/graphql-global-types';
import { TRBAttendeeFields } from 'types/technicalAssistance';
import { trbAttendeeSchema } from 'validations/trbRequestSchema';

type CreateContactFormProps = {
  createContact: (input: {
    euaUserId: string;
    component: string;
    role: PersonRole;
  }) => Promise<any>;
};

export default function CreateContactForm({
  createContact
}: CreateContactFormProps) {
  const { t } = useTranslation('technicalAssistance');

  const [showForm, setShowForm] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting, dirtyFields }
  } = useForm<TRBAttendeeFields>({ resolver: yupResolver(trbAttendeeSchema) });

  const submitForm = (formData: TRBAttendeeFields) => {
    const { euaUserId, component, role } = formData;

    createContact({
      euaUserId,
      component: component || '',
      role: role as PersonRole
    })
      .then(() => {
        reset();
        setShowForm(false);
      })
      .catch(e => {
        if (e.message.includes('duplicate key')) {
          setError('euaUserId', {
            message: 'Recipient has already been added'
          });
        }
      });
  };

  if (showForm) {
    return (
      <Fieldset
        className="margin-top-4"
        legend={t('emailRecipientFields.addAnotherRecipient')}
      >
        {/* Name */}
        <Controller
          name="euaUserId"
          control={control}
          render={({ field, fieldState: { error } }) => {
            return (
              <FormGroup error={!!error} className="margin-top-2">
                <Label htmlFor={field.name} className="text-normal">
                  {t('emailRecipientFields.newRecipientName')}
                </Label>
                {error && (
                  <ErrorMessage>
                    {t(error.message || 'errors.makeSelection')}
                  </ErrorMessage>
                )}
                <CedarContactSelect
                  id={field.name}
                  {...{ ...field, ref: null }}
                  value={null}
                  onChange={cedarContact => {
                    if (cedarContact) {
                      field.onChange(cedarContact.euaUserId);
                    }
                  }}
                  className="maxw-none"
                />
              </FormGroup>
            );
          }}
        />
        {/* Component */}
        <Controller
          name="component"
          control={control}
          render={({ field, fieldState: { error } }) => {
            return (
              <FormGroup error={!!error} className="margin-top-2">
                <Label htmlFor={field.name} className="text-normal">
                  {t('emailRecipientFields.newRecipientComponent')}
                </Label>
                {error && (
                  <ErrorMessage>{t('errors.makeSelection')}</ErrorMessage>
                )}
                <Dropdown
                  id={field.name}
                  {...field}
                  ref={null}
                  value={field.value || ''}
                >
                  <option label={`- ${t('basic.options.select')} -`} disabled />
                  {cmsDivisionsAndOfficesOptions('component')}
                </Dropdown>
              </FormGroup>
            );
          }}
        />
        {/* Role */}
        <Controller
          name="role"
          control={control}
          render={({ field, fieldState: { error } }) => {
            return (
              <FormGroup error={!!error} className="margin-top-2">
                <Label htmlFor={field.name} className="text-normal">
                  {t('emailRecipientFields.newRecipientRole')}
                </Label>
                {error && (
                  <ErrorMessage>{t('errors.makeSelection')}</ErrorMessage>
                )}
                <Dropdown
                  id={field.name}
                  {...field}
                  ref={null}
                  value={(field.value as PersonRole) || ''}
                >
                  <option label={`- ${t('basic.options.select')} -`} disabled />
                  {(Object.keys(contactRoles) as PersonRole[]).map(key => (
                    <option key={key} value={key} label={contactRoles[key]} />
                  ))}
                </Dropdown>
              </FormGroup>
            );
          }}
        />

        <ButtonGroup>
          <Button type="button" onClick={() => setShowForm(false)} outline>
            {t('Cancel')}
          </Button>
          <Button
            type="button"
            onClick={() => handleSubmit(formData => submitForm(formData))()}
            disabled={isSubmitting || Object.values(dirtyFields).length < 3}
          >
            {t('emailRecipientFields.addRecipient')}
          </Button>
        </ButtonGroup>
      </Fieldset>
    );
  }

  // Add another recipient button
  return (
    <Button type="button" outline onClick={() => setShowForm(true)}>
      {t('emailRecipientFields.addAnotherRecipient')}
    </Button>
  );
}
