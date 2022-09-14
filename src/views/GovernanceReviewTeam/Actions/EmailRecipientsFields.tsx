import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Button,
  ButtonGroup,
  IconWarning,
  Label
} from '@trussworks/react-uswds';
import classnames from 'classnames';

// import { useFlags } from 'launchdarkly-react-client-sdk';
import AdditionalContacts from 'components/AdditionalContacts';
import CedarContactSelect from 'components/CedarContactSelect';
import CheckboxField from 'components/shared/CheckboxField';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import TruncatedContent from 'components/shared/TruncatedContent';
import useSystemIntake from 'hooks/useSystemIntake';
import useSystemIntakeContacts from 'hooks/useSystemIntakeContacts';
import { EmailRecipientsFieldsProps } from 'types/action';
import {
  CreateContactType,
  SystemIntakeContactProps
} from 'types/systemIntake';

const Recipient = ({
  contact,
  checked,
  updateRecipients,
  activeContact,
  setActiveContact,
  createContact
}: {
  contact: SystemIntakeContactProps;
  checked: boolean;
  updateRecipients: (value: string) => void;
  activeContact: SystemIntakeContactProps | null;
  setActiveContact: (value: SystemIntakeContactProps | null) => void;
  createContact: CreateContactType;
}) => {
  const { t } = useTranslation('action');
  const [isActive, setActive] = useState(false);
  const { commonName, euaUserId, role, component, email, id } = { ...contact };

  return (
    <>
      <CheckboxField
        id={`${euaUserId || 'contact'}-${role.replaceAll(' ', '')}`}
        name={`${euaUserId}-${role.replaceAll(' ', '')}`}
        label={`${commonName}, ${component} (${role})`}
        value={email || ''}
        onChange={e => updateRecipients(e.target.value)}
        onBlur={() => null}
        checked={checked}
        disabled={!id}
      />
      {!id && !isActive && (
        <div className="margin-left-4 margin-top-1 margin-bottom-2">
          <p className="text-base display-flex flex-align-center margin-y-1">
            <IconWarning className="text-warning margin-right-1" />
            {t('emailRecipients.unverifiedRecipient')}
          </p>
          <Button
            type="button"
            unstyled
            onClick={() => {
              setActiveContact(contact);
              setActive(true);
            }}
          >
            {t('emailRecipients.verifyRecipient')}
          </Button>
        </div>
      )}
      {!id && isActive && (
        <FieldGroup className="margin-left-4 margin-top-1 margin-bottom-2">
          <h4 className="margin-bottom-05 margin-top-2">
            {t('emailRecipients.verifyRecipient')}
          </h4>
          <Label htmlFor="test" className="text-normal margin-y-05">
            Recipient Name
          </Label>
          <HelpText>{t('emailRecipients.verifyHelpText')}</HelpText>
          <CedarContactSelect
            id="IntakeForm-ContactCommonName"
            name="systemIntakeContact.commonName"
            value={activeContact}
            onChange={cedarContact => {
              setActiveContact(
                cedarContact ? { ...activeContact!, ...cedarContact } : null
              );
            }}
            autoSearch
          />
          <ButtonGroup className="margin-top-2">
            <Button
              type="button"
              disabled={!(activeContact?.euaUserId && activeContact?.email)}
              onClick={() => {
                createContact(activeContact!);
                setActive(false);
                setActiveContact(null);
              }}
            >
              Save
            </Button>
            <Button
              type="button"
              outline
              onClick={() => {
                setActiveContact(null);
                setActive(false);
              }}
            >
              Cancel
            </Button>
          </ButtonGroup>
        </FieldGroup>
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
  // const flags = useFlags();

  // Contacts query
  const { contacts, createContact } = useSystemIntakeContacts(systemIntakeId);
  // Get system intake from Apollo cache
  const { systemIntake } = useSystemIntake(systemIntakeId);
  const { requester } = systemIntake || {};

  const defaultRecipients = useRef(recipients).current;

  /** Formatted array of contacts in order of display */
  const contactsArray = contacts
    ? [
        contacts.businessOwner,
        contacts.productManager,
        ...(contacts.isso.commonName ? [contacts.isso] : []), // Only include ISSO if present
        contacts.additionalContacts
      ].flat()
    : [];

  const unverifiedRecipients = contactsArray.filter(({ id }) => !id);

  const defaultRecipientsCount =
    (defaultRecipients.shouldNotifyITInvestment ? 3 : 2) +
    unverifiedRecipients.length;

  // Number of possible recipients
  const contactsCount = contactsArray.length + 3;
  // Number of selected contacts
  const selectedContacts = contactsArray.filter(({ email }) =>
    recipients.regularRecipientEmails.includes(email!)
  ).length;
  const selectedCount =
    selectedContacts +
    Number(recipients.regularRecipientEmails.includes(requester?.email!)) +
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

  // Check if contacts have loaded
  if (!contactsArray) return null;

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
      <Alert type="warning" slim>
        {t('emailRecipients.unverifiedRecipientsWarning')}
      </Alert>
      {/* {flags.notifyMultipleRecipients && ( */}
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
              `Show ${contactsCount - defaultRecipientsCount} fewer recipients`
            )}
            buttonClassName="margin-top-105"
          >
            <CheckboxField
              label={`${requester?.name}, ${requester?.component} (Requester)`}
              checked={recipients.regularRecipientEmails.includes(
                requester?.email!
              )}
              name="contact-requester"
              id="contact-requester"
              value={requester?.email!}
              onChange={() => updateRecipients(requester?.email!)}
              onBlur={() => null}
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
            {defaultRecipients.shouldNotifyITInvestment && (
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
            )}
            {unverifiedRecipients.length > 0 &&
              unverifiedRecipients.map((contact, index) => (
                <Recipient
                  key={`unverified-${index}`} // eslint-disable-line react/no-array-index-key
                  contact={contact as SystemIntakeContactProps}
                  checked={
                    !!contact.email &&
                    recipients.regularRecipientEmails.includes(contact.email)
                  }
                  updateRecipients={updateRecipients}
                  activeContact={activeContact}
                  setActiveContact={setActiveContact}
                  createContact={createContact}
                />
              ))}
            {!defaultRecipients.shouldNotifyITInvestment && (
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
            )}
            {contactsArray
              .filter(({ id }) => id) // filter out unverified recipients
              .map((contact, index) => (
                <Recipient
                  key={`verified-${index}`} // eslint-disable-line react/no-array-index-key
                  contact={contact as SystemIntakeContactProps}
                  checked={
                    !!contact.email &&
                    recipients.regularRecipientEmails.includes(contact.email)
                  }
                  updateRecipients={updateRecipients}
                  activeContact={activeContact}
                  setActiveContact={setActiveContact}
                  createContact={createContact}
                />
              ))}
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
      {/* )} */}
    </div>
  );
};
