import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
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
  if (!commonName) return null;
  return (
    <>
      <CheckboxField
        id={`${commonName}-${role}`}
        name={`${commonName}-${role}`}
        label={`${commonName}, ${component} (${role})`}
        value={email || ''}
        onChange={e => updateRecipients(e.target.value)}
        onBlur={() => null}
        checked={email ? checked : false}
        disabled={!email}
        data-testid={`contact-${euaUserId}`}
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
  const [initialContacts] = useSystemIntakeContacts(systemIntakeId);
  // Get system intake from Apollo cache
  const { systemIntake } = useSystemIntake(systemIntakeId);

  // Get action type from path
  const { pathname } = useLocation();
  const defaultITInvestment = useMemo(() => {
    return (
      pathname.endsWith('issue-lcid') ||
      pathname.endsWith('extend-lcid') ||
      pathname.endsWith('no-governance')
    );
  }, [pathname]);

  /** Formatted array of contacts in order of display */
  const contacts = initialContacts
    ? [
        initialContacts.businessOwner,
        initialContacts.productManager,
        initialContacts.isso,
        initialContacts.additionalContacts
      ].flat()
    : [];

  // Get requester from system intake
  const requester = {
    euaUserId: systemIntake?.euaUserId,
    commonName: systemIntake?.requester.name!,
    component: systemIntake?.requester.component!,
    email: systemIntake?.requester.email!,
    role: 'Requester'
  };

  // Number of recipients
  const contactsCount = contacts.length + 3;
  // Number of selected contacts (including mailboxes)
  const selectedCount =
    recipients.regularRecipientEmails.length +
    (recipients.shouldNotifyITGovernance ? 1 : 0) +
    (recipients.shouldNotifyITInvestment ? 1 : 0);

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
              initialCount={defaultITInvestment ? 3 : 2}
              labelMore={t(
                `Show ${
                  contactsCount - (defaultITInvestment ? 3 : 2)
                } more recipients`
              )}
              labelLess={t(
                `Show ${
                  contactsCount - (defaultITInvestment ? 3 : 2)
                } fewer recipients`
              )}
              buttonClassName="margin-top-105"
            >
              <Recipient
                contact={requester as SystemIntakeContactProps}
                checked={recipients.regularRecipientEmails.includes(
                  requester?.email!
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
              {contacts.map((contact, index) => (
                <Recipient
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  contact={contact as SystemIntakeContactProps}
                  checked={recipients.regularRecipientEmails.includes(
                    contact?.email!
                  )}
                  updateRecipients={updateRecipients}
                />
              ))}
              <AdditionalContacts
                systemIntakeId={systemIntakeId}
                activeContact={activeContact}
                setActiveContact={setActiveContact}
                type="recipient"
                className="margin-top-2"
              />
            </TruncatedContent>
          </div>
        </FieldGroup>
      )}
    </div>
  );
};
