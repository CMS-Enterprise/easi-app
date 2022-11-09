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
import { GetSystemIntakeContacts_systemIntakeContacts_systemIntakeContacts as AugmentedSystemIntakeContact } from 'queries/types/GetSystemIntakeContacts';
import { EmailRecipientsFieldsProps } from 'types/action';
import { EmailNotificationRecipients } from 'types/graphql-global-types';
import {
  CreateContactType,
  SystemIntakeContactProps
} from 'types/systemIntake';

type RecipientProps = {
  contact: SystemIntakeContactProps;
  recipients: string[];
  updateRecipients: (value: string) => void;
  activeContact: SystemIntakeContactProps | null;
  setActiveContact: (value: SystemIntakeContactProps | null) => void;
  createContact: CreateContactType;
};

type VerifiedContactsObject = {
  verifiedContacts: SystemIntakeContactProps[];
  unverifiedContacts: SystemIntakeContactProps[];
};

/**
 * Individual recipient component with verify recipient form
 */
const Recipient = ({
  /** Contact object */
  contact,
  /** Array of recipient emails */
  recipients,
  /** Update notification recipients */
  updateRecipients,
  /** Current active contact, set when adding or verifying */
  activeContact,
  /** Set active contact when verifying */
  setActiveContact,
  /** Create new system intake contact */
  createContact
}: RecipientProps) => {
  const { t } = useTranslation('action');

  const [contactDetails, setContactDetails] = useState(contact);
  const { commonName, euaUserId, role, component, email, id } = contactDetails;

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
        name={`${euaUserId}-${role.replaceAll(' ', '')}`}
        label={`${commonName}, ${component} (${role})`}
        value={email || ''}
        onChange={e => updateRecipients(e.target.value)}
        onBlur={() => null}
        checked={!!email && recipients.includes(email)}
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
                // Create system intake contact
                createContact(activeContact!).then(response => {
                  if (response?.email) {
                    setContactDetails({
                      ...response,
                      commonName: response.commonName || '',
                      email: response.email
                    });
                    updateRecipients(response.email);
                    setActiveContact(null);
                    setActive(false);
                  }
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
  /** Email notification recipients object */
  recipients,
  /** Set email notification recipients */
  setRecipients,
  /** Field error */
  error
}: EmailRecipientsFieldsProps) => {
  const { t } = useTranslation('action');
  const flags = useFlags();

  // Contacts query
  const { contacts, createContact } = useSystemIntakeContacts(systemIntakeId);

  // Requester object
  const { requester } = contacts.data;

  /** Initial default recipients */
  const defaultRecipients: EmailNotificationRecipients = useRef(recipients)
    .current;

  /** Number of default recipients to display */
  const defaultRecipientsCount: number = Object.values(defaultRecipients)
    .flat()
    .filter(value => value).length;

  /**
   * Object to display verified and unverified contacts
   */
  const contactsList: VerifiedContactsObject = Object.values(contacts.data)
    .flat()
    .reduce(
      (acc: VerifiedContactsObject, contact: SystemIntakeContactProps) => {
        if (contact.role === 'Requester') return acc;
        return {
          verifiedContacts: [
            ...acc.verifiedContacts,
            ...(contact.id ? [contact] : [])
          ],
          unverifiedContacts: [
            ...acc.unverifiedContacts,
            ...(!contact.id ? [contact] : [])
          ]
        };
      },
      {
        verifiedContacts: [],
        unverifiedContacts: []
      }
    );

  /** Number of unverified contacts */
  const unverifiedCount = contactsList.unverifiedContacts.length;
  /** Number of verified contacts */
  const verifiedCount = contactsList.verifiedContacts.length;

  /** Number of selected recipients */
  const selectedCount = Object.values(recipients)
    .flat()
    .filter(value => value).length;

  const { verifiedContacts, unverifiedContacts } = useRef(contactsList).current;

  /**
   * Additional contacts not already included in initial list of contacts
   * */
  const additionalContacts = contacts.data.additionalContacts.filter(
    ({ id }) => !verifiedContacts.find(contact => contact.id === id)
  );

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

  // Number of contacts to hide behind view more button
  // Subtract defaultRecipientsCount from total number of possible default recipients to show how many are below view more button
  const hiddenContactsCount = verifiedCount + (3 - defaultRecipientsCount);

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
      {unverifiedCount > 0 && flags.notifyMultipleRecipients && (
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
            id={`${requester.euaUserId}-requester`}
            name={`${requester.euaUserId}-requester`}
            label={`${requester.commonName}, ${requester.component} (Requester)`}
            value={requester.email}
            onChange={e => updateRecipients(e.target.value)}
            onBlur={() => null}
            checked={recipients.regularRecipientEmails.includes(
              requester.email
            )}
            disabled={!requester.email} // Disable if no email provided - only applies to test data
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
            unverifiedContacts
              .filter(({ role }) => role !== 'Requester') // filter out requester
              .map((contact, index) => (
                <Recipient
                  key={`unverified-${index}`} // eslint-disable-line react/no-array-index-key
                  contact={contact as SystemIntakeContactProps}
                  recipients={recipients.regularRecipientEmails}
                  updateRecipients={updateRecipients}
                  activeContact={activeContact}
                  setActiveContact={setActiveContact}
                  createContact={createContact}
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
              {[...verifiedContacts, ...additionalContacts].map(
                (contact, index) => (
                  <Recipient
                    key={`verified-${index}`} // eslint-disable-line react/no-array-index-key
                    contact={contact as SystemIntakeContactProps}
                    recipients={recipients.regularRecipientEmails}
                    updateRecipients={updateRecipients}
                    activeContact={activeContact}
                    setActiveContact={setActiveContact}
                    createContact={createContact}
                  />
                )
              )}
              {/* Additional Contacts button/form */}
              <AdditionalContacts
                systemIntakeId={systemIntakeId}
                activeContact={activeContact}
                setActiveContact={setActiveContact}
                onCreateContact={(contact: AugmentedSystemIntakeContact) => {
                  if (
                    // Check if response from CEDAR includes email
                    contact.email &&
                    // Check if recipient is already selected
                    !recipients.regularRecipientEmails.includes(contact.email)
                  ) {
                    // If recipient is not already selected, add email to recipients array
                    setRecipients({
                      ...recipients,
                      regularRecipientEmails: [
                        ...recipients.regularRecipientEmails,
                        contact.email
                      ]
                    });
                  }
                }}
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
