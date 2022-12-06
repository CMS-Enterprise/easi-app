import React, { useMemo, useRef, useState } from 'react';
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
import { GetSystemIntakeContacts_systemIntakeContacts_systemIntakeContacts as AugmentedSystemIntakeContact } from 'queries/types/GetSystemIntakeContacts';
import { EmailRecipientsFieldsProps } from 'types/action';
import { EmailNotificationRecipients } from 'types/graphql-global-types';
import { SystemIntakeContactProps } from 'types/systemIntake';

type RecipientProps = {
  contact: SystemIntakeContactProps;
  checked: boolean;
  updateRecipients: (value: string) => void;
  activeContact: SystemIntakeContactProps | null;
  setActiveContact: (value: SystemIntakeContactProps | null) => void;
  verifyContact: () => Promise<void>;
};

/**
 * Individual recipient component with verify recipient form
 */
const Recipient = ({
  /** Contact object */
  contact,
  /** Whether or not the contact has been added as a recipient */
  checked,
  /** Update notification recipients */
  updateRecipients,
  /** Current active contact, set when adding or verifying */
  activeContact,
  /** Set active contact when verifying */
  setActiveContact,
  /** Creates a new system intake contact and adds it to the recipients list */
  verifyContact
}: RecipientProps) => {
  const { t } = useTranslation('action');

  const { commonName, euaUserId, role, component, email, id } = contact;

  // Whether or not to show verify recipient form
  const [isActive, setActive] = useState(false);

  return (
    <div
      className="recipient-container"
      data-testid={`recipient-${role.replaceAll(' ', '')}-${euaUserId}`}
    >
      {/* Checkbox with label */}
      <CheckboxField
        id={`${euaUserId || 'contact'}-${role.replaceAll(' ', '')}`}
        name={`${euaUserId || 'contact'}-${role.replaceAll(' ', '')}`}
        label={`${commonName}, ${component} (${role})`}
        value={email || ''}
        onChange={e => updateRecipients(e.target.value)}
        onBlur={() => null}
        checked={checked}
        disabled={!id}
      />
      {/* Unverified recipient alert */}
      {!id && !isActive && (
        <div className="margin-left-4 margin-top-1 margin-bottom-2">
          <p className="text-base display-flex flex-align-center margin-y-1">
            <IconWarning className="text-warning margin-right-1" />
            {t('emailRecipients.unverifiedRecipient')}
          </p>
          {/* Button to open form to verify recipient */}
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
      {/* CEDAR contact select field to verify recipient */}
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
              // If contact is selected, add commonName and euaUserId to activeContact
              if (cedarContact) {
                setActiveContact({ ...activeContact!, ...cedarContact });
              } else {
                // If select field is cleared, reset commonName and euaUserId
                setActiveContact({
                  ...activeContact!,
                  commonName: '',
                  euaUserId: ''
                });
              }
            }}
            autoSearch
          />
          <ButtonGroup className="margin-top-2">
            {/* Save recipient */}
            <Button
              type="button"
              // Disable if contact object does not include EUA or email
              disabled={!(activeContact?.euaUserId && activeContact?.email)}
              onClick={() => {
                verifyContact().then(() => {
                  setActive(false);
                  setActiveContact(null);
                });
              }}
            >
              {t('Save')}
            </Button>
            {/* Cancel */}
            <Button
              type="button"
              outline
              onClick={() => {
                // Close verify recipient form
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

/**
 * Email recipient fields with functionality to verify and add recipients
 */
export default ({
  /** Whether email is optional */
  optional = true,
  /** Container className */
  className,
  /** Header className */
  headerClassName,
  /** Alert className */
  alertClassName,
  /** System intake ID */
  systemIntakeId,
  /** Current active contact, set when adding or verifying */
  activeContact,
  /** Set active contact */
  setActiveContact,
  /** Formatted system intake contacts */
  contacts,
  /** Email notification recipients object */
  recipients,
  /** Set email notification recipients */
  setRecipients,
  /** Field error */
  error
}: EmailRecipientsFieldsProps) => {
  const { t } = useTranslation('action');
  const flags = useFlags();

  // Create contact mutation
  const { createContact } = useSystemIntakeContacts(systemIntakeId);

  // Requester object
  const { requester } = contacts;

  const contactsArray = useMemo(() => {
    return [
      contacts.businessOwner,
      contacts.productManager,
      ...(contacts.isso.commonName ? [contacts.isso] : []),
      ...contacts.additionalContacts
    ];
  }, [contacts]);

  /**
   * Verified contacts - contains all initial verified contacts and any additional contacts
   */
  const [verifiedContacts, setVerifiedContacts] = useState<
    SystemIntakeContactProps[]
  >(contactsArray.filter(contact => contact.id));

  /**
   * Unverified contacts - contains all initial unverified contacts
   *
   * Newly verified contacts remain in this array to preserve display order
   */
  const [unverifiedContacts, setUnverifiedContacts] = useState<
    SystemIntakeContactProps[]
  >(contactsArray.filter(contact => !contact.id));

  /** Initial default recipients */
  const defaultRecipients: EmailNotificationRecipients = useRef(recipients)
    .current;

  /** Number of selected recipients */
  const selectedCount = Object.values(recipients)
    .flat()
    .filter(value => value).length;

  /**
   * Updates email recipients in system intake
   */
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

    // Update recipients
    setRecipients({
      ...recipients,
      regularRecipientEmails: updatedRecipients
    });
  };

  /**
   * Creates system intake contact, adds contact as notification recipient, and updates data in unverifiedContacts state
   */
  const verifyContact = async (
    /** Contact to be verified */
    contact: SystemIntakeContactProps,
    /** Index of contact in unverifiedContacts array - used to preserve display order */
    index: number
  ): Promise<void> => {
    // Create system intake contact
    return createContact(contact).then(response => {
      // Check for response
      if (response) {
        // Newly verified contacts should automatically be selected as recipients
        if (
          // Check if response from CEDAR includes email
          response?.email &&
          // Check if contact is already selected as recipient
          !recipients.regularRecipientEmails.includes(response.email)
        ) {
          // Add contact email to recipients array
          setRecipients({
            ...recipients,
            regularRecipientEmails: [
              ...recipients.regularRecipientEmails,
              response.email
            ]
          });
        }

        /** Updated unverified contacts array */
        // Shallow copy unverifiedContacts state array so that it can be modified
        const updatedUnverifiedContacts = [...unverifiedContacts];
        // Overwrite existing contact with new data from mutation response
        updatedUnverifiedContacts[index] = {
          ...response,
          commonName: response.commonName || '',
          email: response.email || ''
        };
        // Update unverified contacts to reflect verification
        setUnverifiedContacts(updatedUnverifiedContacts);
      }
    });
  };

  /**
   * Callback after a new additional contact is created
   *
   * Adds contact as recipient and to verifiedContacts array
   */
  const createContactCallback = (contact: AugmentedSystemIntakeContact) => {
    // Add contact to verified contacts array
    setVerifiedContacts([
      ...verifiedContacts,
      contact as SystemIntakeContactProps
    ]);

    // New contacts should automatically be selected as recipients
    if (
      // Check if response from CEDAR includes email
      contact.email &&
      // Check if contact is already selected as recipient
      !recipients.regularRecipientEmails.includes(contact.email)
    ) {
      // Add contact email to recipients array
      setRecipients({
        ...recipients,
        regularRecipientEmails: [
          ...recipients.regularRecipientEmails,
          contact.email
        ]
      });
    }
  };

  /**
   * Number of contacts to hide behind view more button
   */
  const hiddenContactsCount =
    Number(!defaultRecipients.shouldNotifyITInvestment) +
    (verifiedContacts ? verifiedContacts?.length : 0);

  return (
    <div className={classnames(className)} id="grtActionEmailRecipientFields">
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
      {unverifiedContacts.length > 0 && flags.notifyMultipleRecipients && (
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

          {/* Requester */}
          <CheckboxField
            id={`${requester?.euaUserId}-requester`}
            name={`${requester?.euaUserId}-requester`}
            label={`${requester?.commonName}, ${requester?.component} (Requester)`}
            value={requester?.email || ''}
            onChange={e => updateRecipients(e.target.value)}
            onBlur={() => null}
            checked={
              !!requester?.email &&
              recipients.regularRecipientEmails.includes(requester.email)
            }
            disabled={!requester?.email} // Disable if no email provided - only applies to test data
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
          {unverifiedContacts.length > 0 &&
            unverifiedContacts.map((contact, index) => (
              <Recipient
                key={`unverified-${index}`} // eslint-disable-line react/no-array-index-key
                contact={contact as SystemIntakeContactProps}
                updateRecipients={updateRecipients}
                activeContact={activeContact}
                setActiveContact={setActiveContact}
                verifyContact={() =>
                  verifyContact({ ...contact, ...activeContact }, index)
                }
                checked={
                  contact.email
                    ? !!recipients.regularRecipientEmails.includes(
                        contact.email
                      )
                    : false
                }
              />
            ))}

          <div id="EmailRecipients-ContactsList" className="margin-bottom-4">
            <TruncatedContent
              initialCount={0}
              labelMore={t(
                `Show ${
                  hiddenContactsCount > 0 ? `${hiddenContactsCount} ` : ''
                }more recipients`
              )}
              labelLess={t(
                `Show ${
                  hiddenContactsCount > 0 ? `${hiddenContactsCount} ` : ''
                }fewer recipients`
              )}
              buttonClassName="margin-top-105"
            >
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
              {verifiedContacts &&
                verifiedContacts.map((contact, index) => {
                  if (contact.id) {
                    return (
                      <CheckboxField
                        key={`verified-${index}`} // eslint-disable-line react/no-array-index-key
                        id={contact.id}
                        name={`${contact.euaUserId}-${contact.role}`}
                        label={`${contact?.commonName}, ${contact?.component} (${contact?.role})`}
                        value={contact?.email || ''}
                        onChange={e => updateRecipients(e.target.value)}
                        onBlur={() => null}
                        checked={
                          !!contact?.email &&
                          recipients.regularRecipientEmails.includes(
                            contact.email
                          )
                        }
                        disabled={!contact?.email} // Disable if no email provided - only applies to test data
                      />
                    );
                  }
                  return null;
                })}
              {/* Additional Contacts button/form */}
              <AdditionalContacts
                systemIntakeId={systemIntakeId}
                activeContact={activeContact}
                setActiveContact={setActiveContact}
                createContactCallback={createContactCallback}
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
