import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { ErrorMessage, FormGroup } from '@trussworks/react-uswds';
import classNames from 'classnames';

import CheckboxField from 'components/shared/CheckboxField';
import TruncatedContent from 'components/shared/TruncatedContent';
import contactRoles from 'constants/enums/contactRoles';
import { TRBAttendee } from 'queries/types/TRBAttendee';
import { CreateTRBRequestAttendeeInput } from 'types/graphql-global-types';
import toggleArrayValue from 'utils/toggleArrayValue';

import AddAttendeeForm from './AddAttendeeForm';

type EmailRecipientFieldsProps = {
  requester: TRBAttendee;
  attendees: TRBAttendee[];
  createAttendee: (input: CreateTRBRequestAttendeeInput) => Promise<void>;
  className?: string;
};

interface RecipientFields {
  trbRequestId: string;
  notifyEuaIds: string[];
  copyTrbMailbox: boolean;
}

const EmailRecipientFields = ({
  requester,
  attendees,
  createAttendee,
  className
}: EmailRecipientFieldsProps) => {
  const { t } = useTranslation('technicalAssistance');

  const {
    watch,
    getValues,
    formState: { errors }
  } = useFormContext<RecipientFields>();

  const selectedCount = watch(['notifyEuaIds', 'copyTrbMailbox'])
    .flat()
    .filter(item => item).length;

  return (
    <FormGroup error={!!errors.notifyEuaIds}>
      <fieldset className={classNames('usa-fieldset', className)}>
        <legend className="usa-label">
          <Trans
            i18nKey="technicalAssistance:emailRecipientFields.label"
            components={{ red: <span className="text-error" /> }}
          />
        </legend>

        {errors.notifyEuaIds && (
          <ErrorMessage>
            {t('emailRecipientFields.selectRecipientError')}
          </ErrorMessage>
        )}

        <p className="margin-bottom-0 margin-top-05">
          <Trans
            i18nKey="technicalAssistance:emailRecipientFields.selectedCount"
            components={{ bold: <span className="text-bold" /> }}
            count={selectedCount}
          />
        </p>

        <TruncatedContent
          initialCount={2}
          labelMore={t(`emailRecipientFields.showMore`, {
            number: attendees.length
          })}
          labelLess={t(`emailRecipientFields.showFewer`, {
            number: attendees.length
          })}
          buttonClassName="margin-top-2"
        >
          {/* Requester */}
          <Controller
            name="notifyEuaIds"
            render={({ field }) => {
              const { component } = requester;
              const { commonName, euaUserId } = requester?.userInfo || {};

              const label = `${commonName}, ${component} (Requester)`;
              const value = euaUserId || '';

              return (
                <CheckboxField
                  id={`${field.name}.0`}
                  label={label}
                  {...{ ...field, ref: null }}
                  onChange={e => {
                    field.onChange(
                      toggleArrayValue(field.value, e.target.value)
                    );
                  }}
                  value={value}
                  checked={!!field.value?.includes(value)}
                />
              );
            }}
          />

          {/* Copy TRB Mailbox */}
          <Controller
            name="copyTrbMailbox"
            render={({ field }) => {
              return (
                <CheckboxField
                  id={field.name}
                  label={t('emailRecipientFields.copyTrbMailbox')}
                  {...{ ...field, ref: null }}
                  checked={!!field.value}
                />
              );
            }}
          />

          {/* Recipients */}
          <Controller
            name="notifyEuaIds"
            render={({ field }) => {
              return (
                <>
                  {attendees.map((attendee, index) => {
                    const { commonName, euaUserId } = attendee.userInfo || {};
                    const value = euaUserId || '';

                    const role = attendee.role
                      ? contactRoles[attendee.role]
                      : '';

                    return (
                      <CheckboxField
                        key={attendee.id}
                        id={`${field.name}.${index + 1}`}
                        label={`${commonName} (${role})`}
                        {...{ ...field, ref: null }}
                        onChange={e =>
                          field.onChange(
                            toggleArrayValue(field.value, e.target.value)
                          )
                        }
                        value={value}
                        checked={!!field.value?.includes(value)}
                      />
                    );
                  })}
                </>
              );
            }}
          />

          <AddAttendeeForm
            createAttendee={createAttendee}
            trbRequestId={getValues('trbRequestId')}
          />
        </TruncatedContent>
      </fieldset>
    </FormGroup>
  );
};

export default EmailRecipientFields;
