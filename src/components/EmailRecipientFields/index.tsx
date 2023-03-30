import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import classNames from 'classnames';

import CheckboxField from 'components/shared/CheckboxField';
import TruncatedContent from 'components/shared/TruncatedContent';
import { TRBAttendee } from 'queries/types/TRBAttendee';
import toggleArrayValue from 'utils/toggleArrayValue';

type EmailRecipientFieldsProps = {
  requester: TRBAttendee;
  attendees: TRBAttendee[];
  className?: string;
};

interface Recipientfields {
  notifyEuaIds: string[];
  copyTrbMailbox: boolean;
}

const EmailRecipientFields = ({
  requester,
  attendees,
  className
}: EmailRecipientFieldsProps) => {
  const { t } = useTranslation('technicalAssistance');

  const { watch } = useFormContext<Recipientfields>();

  const selectedCount = watch(['notifyEuaIds', 'copyTrbMailbox'])
    .flat()
    .filter(item => item).length;

  return (
    <fieldset className={classNames('usa-fieldset', className)}>
      <legend className="usa-label">
        {t('emailRecipientFields.label')} <span className="text-error">*</span>
      </legend>
      <p className="margin-bottom-0 margin-top-05">
        <Trans
          i18nKey="technicalAssistance:emailRecipientFields.selectedCount"
          count={selectedCount}
        >
          <span className="text-bold">count</span>
          recipients selected
        </Trans>
      </p>
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
                onChange={e => {
                  field.onChange(toggleArrayValue(field.value, e.target.value));
                }}
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

                  return (
                    <CheckboxField
                      key={attendee.id}
                      id={`${field.name}.${index + 1}`}
                      label={`${commonName} (${t(
                        'emailRecipientFields.projectTeamMember'
                      )})`}
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
    </fieldset>
  );
};

export default EmailRecipientFields;
