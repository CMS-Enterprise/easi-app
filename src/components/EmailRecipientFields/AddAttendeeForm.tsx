import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Button,
  ButtonGroup,
  Dropdown,
  FormGroup
} from '@trussworks/react-uswds';

import cmsDivisionsAndOfficesOptions from 'components/AdditionalContacts/cmsDivisionsAndOfficesOptions';
import CedarContactSelect from 'components/CedarContactSelect';
import Label from 'components/shared/Label';
import contactRoles from 'constants/enums/contactRoles';
import {
  CreateTRBRequestAttendeeInput,
  PersonRole
} from 'types/graphql-global-types';
import { TRBAttendeeFields } from 'types/technicalAssistance';

type AddAttendeeFormProps = {
  trbRequestId: string;
  createAttendee: (input: CreateTRBRequestAttendeeInput) => Promise<void>;
};

export default function AddAttendeeForm({
  trbRequestId,
  createAttendee
}: AddAttendeeFormProps) {
  const { t } = useTranslation('technicalAssistance');

  const [showForm, setShowForm] = useState(false);

  const {
    control,
    handleSubmit,
    reset
    // formState: { errors }
  } = useForm<TRBAttendeeFields>();

  const submitForm = (formData: TRBAttendeeFields) => {
    const { euaUserId, component, role } = formData;

    createAttendee({
      trbRequestId,
      euaUserId,
      component: component || '',
      role: role as PersonRole
    }).then(result => {
      reset();
      setShowForm(false);
    });
  };

  if (showForm) {
    return (
      <fieldset className="usa-fieldset">
        {/* Name */}
        <Controller
          name="euaUserId"
          control={control}
          render={({ field }) => {
            return (
              <FormGroup>
                <Label htmlFor={field.name}>
                  {t('emailRecipientFields.newRecipientName')}
                </Label>
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
          render={({ field }) => {
            return (
              <FormGroup>
                <Label htmlFor={field.name}>
                  {t('emailRecipientFields.newRecipientComponent')}
                </Label>
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
          render={({ field }) => {
            return (
              <FormGroup>
                <Label htmlFor={field.name}>
                  {t('emailRecipientFields.newRecipientRole')}
                </Label>
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
          >
            {t('emailRecipientFields.addRecipient')}
          </Button>
        </ButtonGroup>
      </fieldset>
    );
  }

  // Add another recipient button
  return (
    <Button type="button" outline onClick={() => setShowForm(true)}>
      {t('emailRecipientFields.addAnotherRecipient')}
    </Button>
  );
}
