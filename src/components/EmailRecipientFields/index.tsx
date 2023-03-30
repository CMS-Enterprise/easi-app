import React from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import CheckboxField from 'components/shared/CheckboxField';
import TruncatedContent from 'components/shared/TruncatedContent';
import { TRBAttendee } from 'queries/types/TRBAttendee';
import toggleArrayValue from 'utils/toggleArrayValue';

type EmailRecipientFieldsProps = {
  requester: TRBAttendee;
  attendees: TRBAttendee[];
};

const EmailRecipientFields = ({
  requester,
  attendees
}: EmailRecipientFieldsProps) => {
  const { t } = useTranslation('');

  return (
    <TruncatedContent
      initialCount={2}
      labelMore={t(`Show ${attendees.length} more recipients`)}
      labelLess={t(`Show ${attendees.length} fewer recipients`)}
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
              onChange={e =>
                field.onChange(toggleArrayValue(field.value, e.target.value))
              }
              value={value}
              checked={!!field.value?.includes(value)}
            />
          );
        }}
      />

      {/* Mailbox */}
      <Controller
        name="copyTrbMailbox"
        render={({ field }) => {
          return (
            <CheckboxField
              id={field.name}
              label={t('Copy TRB Mailbox')}
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

                return (
                  <CheckboxField
                    key={attendee.id}
                    id={`${field.name}.${index + 1}`}
                    label={`${commonName} (${t('Project team member')})`}
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
    </TruncatedContent>
  );
};

export default EmailRecipientFields;
