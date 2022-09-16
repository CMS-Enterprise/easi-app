import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from '@trussworks/react-uswds';
import classnames from 'classnames';
import { useFlags } from 'launchdarkly-react-client-sdk';

import AdditionalContacts from 'components/AdditionalContacts';
import CheckboxField from 'components/shared/CheckboxField';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import TruncatedContent from 'components/shared/TruncatedContent';
import useSystemIntake from 'hooks/useSystemIntake';
import useSystemIntakeContacts from 'hooks/useSystemIntakeContacts';
import { EmailRecipientsFieldsProps } from 'types/action';
import { SystemIntakeContactProps } from 'types/systemIntake';

const Recipient = ({
  contact,
  checked,
  updateRecipients
}: {
  contact: SystemIntakeContactProps;
  checked: boolean;
  updateRecipients: (value: string) => void;
}) => {
  const { t } = useTranslation('action');
  const { commonName, euaUserId, role, component, email } = { ...contact };
  return (
    <>
      <CheckboxField
        id={`${euaUserId}-${role.replaceAll(' ', '')}`}
        name={`${euaUserId}-${role.replaceAll(' ', '')}`}
        label={`${commonName}, ${component} (${role})`}
        value={email || ''}
        onChange={e => updateRecipients(e.target.value)}
        onBlur={() => null}
        checked={checked}
        disabled={!email}
      />
      {!email && (
        <Alert type="warning" slim className="margin-left-4 margin-top-05">
          {t('emailRecipients.invalidEmail')}
        </Alert>
      )}
    </>
  );
};

export default ({
  optional = true,
  className,
  headerClassName,
  alertClassName,
  systemIntakeId,
  activeContact,
  setActiveContact,
  recipients,
  setRecipients,
  error
}: EmailRecipientsFieldsProps) => {
  const { t } = useTranslation('action');
  const flags = useFlags();

  // Contacts query
  const { contacts } = useSystemIntakeContacts(systemIntakeId);
  // Get system intake from Apollo cache
  const { systemIntake } = useSystemIntake(systemIntakeId);

  // Get action type from path
  const defaultRecipientsCount = useRef(
    recipients.shouldNotifyITInvestment ? 3 : 2
  ).current;

  const requester = {
    euaUserId: systemIntake!.euaUserId,
    commonName: systemIntake!.requester.name,
    component: systemIntake!.requester.component!,
    email: systemIntake!.requester.email || '',
    role: 'Requester'
  };

  /** Formatted array of contacts in order of display */
  const contactsObject = contacts
    ? [
        requester,
        contacts.businessOwner,
        contacts.productManager,
        ...(contacts.isso.commonName ? [contacts.isso] : []), // Only include ISSO if present
        contacts.additionalContacts
      ].flat()
    : [];

  // Number of possible recipients
  const contactsCount = contactsObject.length + 2;
  // Number of selected contacts
  const selectedContacts = contactsObject.filter(({ email }) =>
    recipients.regularRecipientEmails.includes(email!)
  ).length;
  const selectedCount =
    selectedContacts +
    Number(recipients.shouldNotifyITGovernance) +
    Number(recipients.shouldNotifyITInvestment);

  /** Update email recipients in system intake */
  const updateRecipients = (value: string) => {
    const { regularRecipientEmails } = recipients;
    let updatedRecipients = [];

    // Update recipients
    if (regularRecipientEmails.includes(value)) {
      // If recipient already exists, remove email from array
      updatedRecipients = regularRecipientEmails.filter(
        email => email !== value
      );
    } else {
      // Add email to recipients array
      updatedRecipients = [...regularRecipientEmails, value];
    }

    setRecipients({
      ...recipients,
      regularRecipientEmails: updatedRecipients
    });
  };

  return (
    <div className={classnames(className)}>
      <h3 className={classnames('margin-y-2', headerClassName)}>
        {t('emailRecipients.email')} {optional && t('emailRecipients.optional')}
      </h3>
      {!optional && (
        <Alert type="info" slim className={classnames(alertClassName)}>
          {t('emailRecipients.emailRequired')}
        </Alert>
      )}
      {flags.notifyMultipleRecipients && (
        <FieldGroup error={!!error}>
          <h4 className="margin-bottom-0 margin-top-2">
            {t('emailRecipients.chooseRecipients')}
          </h4>
          <p className="margin-top-05">
            <strong>{selectedCount}</strong>
            {t(
              selectedCount > 1 ? ' recipients selected' : ' recipient selected'
            )}
          </p>
          <FieldErrorMsg>{error}</FieldErrorMsg>
          <div id="EmailRecipients-ContactsList" className="margin-bottom-4">
            <TruncatedContent
              initialCount={defaultRecipientsCount}
              labelMore={t(
                `Show ${contactsCount - defaultRecipientsCount} more recipients`
              )}
              labelLess={t(
                `Show ${
                  contactsCount - defaultRecipientsCount
                } fewer recipients`
              )}
              buttonClassName="margin-top-105"
            >
              <Recipient
                contact={requester as SystemIntakeContactProps}
                checked={recipients.regularRecipientEmails.includes(
                  requester.email
                )}
                updateRecipients={updateRecipients}
              />
              <CheckboxField
                label="IT Governance Mailbox"
                checked={recipients.shouldNotifyITGovernance}
                name="contact-itGovernanceMailbox"
                id="contact-itGovernanceMailbox"
                value="shouldNotifyITGovernance"
                onChange={e =>
                  setRecipients({
                    ...recipients,
                    shouldNotifyITGovernance: e.target.checked
                  })
                }
                onBlur={() => null}
              />
              <CheckboxField
                label="IT Investment Mailbox"
                checked={recipients.shouldNotifyITInvestment}
                name="contact-itInvestmentMailbox"
                id="contact-itInvestmentMailbox"
                value="shouldNotifyITInvestment"
                onChange={e =>
                  setRecipients({
                    ...recipients,
                    shouldNotifyITInvestment: e.target.checked
                  })
                }
                onBlur={() => null}
              />
              {contactsObject.slice(1).map((contact, index) => {
                return (
                  <Recipient
                    key={index} // eslint-disable-line react/no-array-index-key
                    contact={contact as SystemIntakeContactProps}
                    checked={
                      !!contact.email &&
                      recipients.regularRecipientEmails.includes(contact.email)
                    }
                    updateRecipients={updateRecipients}
                  />
                );
              })}
              <AdditionalContacts
                systemIntakeId={systemIntakeId}
                activeContact={activeContact}
                setActiveContact={setActiveContact}
                type="recipient"
                className="margin-top-3"
              />
            </TruncatedContent>
          </div>
        </FieldGroup>
      )}
    </div>
  );
};
