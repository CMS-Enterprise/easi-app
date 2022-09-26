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
import { useFlags } from 'launchdarkly-react-client-sdk';

import AdditionalContacts from 'components/AdditionalContacts';
import CedarContactSelect from 'components/CedarContactSelect';
import CheckboxField from 'components/shared/CheckboxField';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import TruncatedContent from 'components/shared/TruncatedContent';
import useSystemIntakeContacts from 'hooks/useSystemIntakeContacts';
import { EmailRecipientsFieldsProps } from 'types/action';
import {
  CreateContactType,
  SystemIntakeContactProps
} from 'types/systemIntake';

type RecipientProps = {
  contact: SystemIntakeContactProps;
  checked: boolean;
  updateRecipients: (value: string) => void;
  activeContact: SystemIntakeContactProps | null;
  setActiveContact: (value: SystemIntakeContactProps | null) => void;
  createContact: CreateContactType;
};

const Recipient = ({
  contact,
  checked,
  updateRecipients,
  activeContact,
  setActiveContact,
  createContact
}: RecipientProps) => {
  const { t } = useTranslation('action');
  const { commonName, euaUserId, role, component, email, id } = { ...contact };
  const [isActive, setActive] = useState(false);

  return (
    <div
      className="recipient-container"
      data-testid={`recipient-${role.replaceAll(' ', '')}-${euaUserId}`}
    >
      {/* Checkbox with label */}
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
      {/* Unverified alert with button to verify */}
      {!id && !isActive && (
        <div className="margin-left-4 margin-top-1 margin-bottom-2">
          <p className="text-base display-flex flex-align-center margin-y-1">
            <IconWarning className="text-warning margin-right-1" />
            {t('emailRecipients.unverifiedRecipient')}
          </p>
          <Button
            type="button"
            data-testid="button_verify-recipient"
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
      {/* CEDAR Contact select field to verify */}
      {!id && isActive && (
        <FieldGroup className="margin-left-4 margin-top-1 margin-bottom-2">
          <h4 className="margin-bottom-05 margin-top-2">
            {t('emailRecipients.verifyRecipient')}
          </h4>
          <Label htmlFor="test" className="text-normal margin-y-05">
            {t('emailRecipients.recipientName')}
          </Label>
          <HelpText className="margin-bottom-1">
            {t('emailRecipients.verifyHelpText')}
          </HelpText>
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
                setActiveContact(null);
                setActive(false);
              }}
            >
              {t('Save')}
            </Button>
            <Button
              type="button"
              outline
              onClick={() => {
                setActiveContact(null);
                setActive(false);
              }}
            >
              {t('Cancel')}
            </Button>
          </ButtonGroup>
        </FieldGroup>
      )}
    </div>
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
  const { contacts, createContact } = useSystemIntakeContacts(systemIntakeId);
  const {
    requester,
    businessOwner,
    productManager,
    isso,
    additionalContacts
  } = contacts.data;

  const defaultRecipients = useRef(recipients).current;

  /** Formatted array of contacts in order of display */
  const contactsArray = [
    requester,
    businessOwner,
    productManager,
    ...(isso.commonName ? [isso] : []), // Only include ISSO if present
    additionalContacts
  ].flat();

  const unverifiedRecipients = contactsArray.filter(({ id }) => !id);

  // Default recipients count
  const defaultRecipientsCount =
    (defaultRecipients.shouldNotifyITInvestment ? 3 : 2) +
    unverifiedRecipients.filter(({ role }) => role !== 'Requester').length;
  // Possible recipients count
  const contactsCount = contactsArray.length + 2;
  // Selected recipients count
  const selectedContacts = contactsArray.filter(({ email }) =>
    recipients.regularRecipientEmails.includes(email!)
  ).length;
  const selectedCount =
    selectedContacts +
    Number(recipients.shouldNotifyITGovernance) +
    Number(recipients.shouldNotifyITInvestment);

  /**
   * Update email recipients in system intake
   * */
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
  if (contacts.loading) return null;

  return (
    <div className={classnames(className)}>
      <h3 className={classnames('margin-y-2', headerClassName)}>
        {t('emailRecipients.email')} {optional && t('emailRecipients.optional')}
      </h3>

      {/* Email required alert */}
      {!optional && (
        <Alert type="info" slim className={classnames(alertClassName)}>
          {t('emailRecipients.emailRequired')}
        </Alert>
      )}

      {/* Unverified recipients alert */}
      {unverifiedRecipients.length > 0 && flags.notifyMultipleRecipients && (
        <Alert type="warning" slim data-testid="alert_unverified-recipients">
          {t('emailRecipients.unverifiedRecipientsWarning')}
        </Alert>
      )}

      {/* Recipients list */}
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
              {/* Requester */}
              <Recipient
                contact={requester}
                checked={recipients.regularRecipientEmails.includes(
                  requester.email
                )}
                updateRecipients={updateRecipients}
                activeContact={activeContact}
                setActiveContact={setActiveContact}
                createContact={createContact}
              />
              {/* IT Governance */}
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
              {/* IT Investment - if default */}
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
              {/* Unverified recipients */}
              {unverifiedRecipients.length > 0 &&
                unverifiedRecipients
                  .filter(({ role }) => role !== 'Requester') // filter out requester
                  .map((contact, index) => (
                    <Recipient
                      key={`unverified-${index}`} // eslint-disable-line react/no-array-index-key
                      contact={contact as SystemIntakeContactProps}
                      checked={
                        !!contact.email &&
                        recipients.regularRecipientEmails.includes(
                          contact.email
                        )
                      }
                      updateRecipients={updateRecipients}
                      activeContact={activeContact}
                      setActiveContact={setActiveContact}
                      createContact={createContact}
                    />
                  ))}
              {/* IT Investment - if not default */}
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
              {/* Verified contacts */}
              {contactsArray
                .filter(({ id, role }) => id && role !== 'Requester') // filter out requester & unverified recipients
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
              {/* Additional Contacts button/form */}
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
