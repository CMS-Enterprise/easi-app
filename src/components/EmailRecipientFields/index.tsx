import React, { useEffect, useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { ErrorMessage, FormGroup } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { orderBy } from 'lodash';

import CheckboxField from 'components/shared/CheckboxField';
import TruncatedContent from 'components/shared/TruncatedContent';
import Spinner from 'components/Spinner';
import contactRoles from 'constants/enums/contactRoles';
import { PersonRole } from 'types/graphql-global-types';
import toggleArrayValue from 'utils/toggleArrayValue';

import CreateContactForm from './CreateContactForm';

type Mailbox = {
  key: string;
  label: string;
};

export type EmailRecipient = {
  id: string;
  userInfo: {
    euaUserId: string;
    commonName: string;
    email: string;
  } | null;
  component: string | null;
  role: PersonRole | null;
  createdAt: string;
};

type Contact = {
  euaUserId: string;
  component: string;
  role: PersonRole;
};

export type CreateContact = (contact: Contact) => Promise<any>;

type EmailRecipientFieldsProps = {
  requester: EmailRecipient;
  contacts: EmailRecipient[];
  mailboxes: Mailbox[];
  createContact: CreateContact;
  className?: string;
};

const EmailRecipientFields = ({
  requester,
  contacts,
  mailboxes,
  createContact,
  className
}: EmailRecipientFieldsProps) => {
  const { t } = useTranslation('technicalAssistance');

  const {
    watch,
    getValues,
    setValue,
    reset,
    formState: { errors, isDirty }
  } = useFormContext();

  const notifyEuaIds: string[] = watch('notifyEuaIds');

  const defaultMailboxes: Mailbox[] = useRef(
    mailboxes.map(({ key }) => getValues(key))
  ).current;

  const selectedCount = watch([
    'notifyEuaIds',
    ...mailboxes.map(({ key }) => key)
  ])
    .flat()
    .filter(item => item).length;

  // Add requester as default recipient
  useEffect(() => {
    if (
      !isDirty &&
      notifyEuaIds.length === 0 &&
      requester?.userInfo?.euaUserId
    ) {
      reset({
        ...getValues(),
        notifyEuaIds: [requester.userInfo.euaUserId]
      });
    }
  }, [isDirty, notifyEuaIds, requester, reset, getValues]);

  if (!requester?.userInfo?.euaUserId) {
    return (
      <Spinner
        data-testid="emailRecipients-spinner"
        className="display-block margin-top-2"
      />
    );
  }

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
          initialCount={1 + defaultMailboxes.length}
          labelMore={t(`emailRecipientFields.showMore`, {
            number: contacts.length
          })}
          labelLess={t(`emailRecipientFields.showFewer`, {
            number: contacts.length
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

          {mailboxes.map(mailbox => {
            return (
              <Controller
                key={mailbox.key}
                name={mailbox.key}
                render={({ field }) => {
                  return (
                    <CheckboxField
                      id={field.name}
                      label={t(mailbox.label)}
                      {...{ ...field, ref: null }}
                      checked={!!field.value}
                    />
                  );
                }}
              />
            );
          })}

          {/* Recipients */}
          <Controller
            name="notifyEuaIds"
            render={({ field }) => {
              return (
                <>
                  {orderBy(contacts, 'createdAt').map((contact, index) => {
                    const { commonName, euaUserId } = contact.userInfo || {};
                    const value = euaUserId || '';

                    const role = contact.role ? contactRoles[contact.role] : '';

                    return (
                      <CheckboxField
                        key={contact.id}
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

          <CreateContactForm
            createContact={contact =>
              createContact(contact).then(() =>
                setValue('notifyEuaIds', [...notifyEuaIds, contact.euaUserId])
              )
            }
          />
        </TruncatedContent>
      </fieldset>
    </FormGroup>
  );
};

export default EmailRecipientFields;
