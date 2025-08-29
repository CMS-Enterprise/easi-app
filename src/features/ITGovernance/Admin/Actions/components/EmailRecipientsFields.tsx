import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonGroup, Icon, Label } from '@trussworks/react-uswds';
import classnames from 'classnames';
import {
  ExternalRecipientAlert,
  RecipientLabel
} from 'features/TechnicalAssistance/Admin/_components/ActionFormWrapper/Recipients';
import {
  EmailNotificationRecipients,
  SystemIntakeContactFragment
} from 'gql/generated/graphql';

import AdditionalContacts from 'components/AdditionalContacts';
import Alert from 'components/Alert';
import CedarContactSelect from 'components/CedarContactSelect';
import CheckboxField from 'components/CheckboxField';
import FieldErrorMsg from 'components/FieldErrorMsg';
import FieldGroup from 'components/FieldGroup';
import HelpText from 'components/HelpText';
import TruncatedContent from 'components/TruncatedContent';
import { IT_GOV_EMAIL, IT_INVESTMENT_EMAIL } from 'constants/externalUrls';
import useSystemIntakeContacts from 'hooks/useSystemIntakeContacts';
import { FormattedContacts } from 'types/systemIntake';
import isExternalEmail from 'utils/externalEmail';
import { getPersonNameAndComponentAcronym } from 'utils/getPersonNameAndComponent';

type RecipientProps = {
  contact: SystemIntakeContactFragment;
  checked: boolean;
  updateRecipients: (value: string) => void;
  activeContact: SystemIntakeContactFragment | null;
  setActiveContact: (value: SystemIntakeContactFragment | null) => void;
  verifyContact: () => Promise<void>;
};

/**
 * Individual recipient component with verify recipient form
 */
const Recipient = ({
  contact,
  /** Whether or not the contact has been added as a recipient */
  checked,
  updateRecipients,
  activeContact,
  setActiveContact,
  /** Creates a new system intake contact and adds it to the recipients list */
  verifyContact
}: RecipientProps) => {
  const { t } = useTranslation('action');

  const {
    userAccount: { commonName, username, email },
    component,
    roles,
    id
  } = contact;

  // Whether or not to show verify recipient form
  const [isActive, setActive] = useState(false);

  return (
    <div
      className="recipient-container"
      data-testid={`recipient-${roles[0]?.replaceAll(' ', '')}-${username}`}
    >
      {/* Checkbox with label */}
      <CheckboxField
        id={`${username || 'contact'}-${roles[0]?.replaceAll(' ', '')}`}
        name={`${username || 'contact'}-${roles[0]?.replaceAll(' ', '')}`}
        label={
          <RecipientLabel
            name={`${getPersonNameAndComponentAcronym(
              commonName,
              component
            )} (${contact?.roles[0]})`}
            email={email}
          />
        }
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
            <Icon.Warning aria-hidden className="text-warning margin-right-1" />
            {t('emailRecipients.unverifiedRecipient')}
          </p>
          {/* Button to open form to verify recipient */}
          <Button
            type="button"
            className="margin-top-0"
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
          <HelpText className="margin-bottom-1 margin-top-05">
            {t('technicalAssistance:emailRecipientFields.newRecipientHelpText')}
          </HelpText>
          <CedarContactSelect
            id="IntakeForm-ContactCommonName"
            name="systemIntakeContact.commonName"
            value={
              activeContact
                ? {
                    euaUserId: activeContact.userAccount.username,
                    commonName: activeContact.userAccount.commonName,
                    email: activeContact.userAccount.email
                  }
                : null
            }
            onChange={cedarContact => {
              // If contact is selected, add commonName and euaUserId to activeContact
              if (cedarContact) {
                setActiveContact({
                  ...activeContact!,
                  userAccount: {
                    ...activeContact!.userAccount,
                    username: cedarContact.euaUserId || '',
                    commonName: cedarContact.commonName || '',
                    email: cedarContact.email || ''
                  }
                });
              } else {
                // If select field is cleared, reset commonName and euaUserId
                setActiveContact({
                  ...activeContact!,
                  userAccount: {
                    ...activeContact!.userAccount,
                    username: '',
                    commonName: '',
                    email: ''
                  }
                });
              }
            }}
            autoSearch
          />

          <ExternalRecipientAlert email={activeContact?.userAccount.email} />

          <ButtonGroup className="margin-top-2">
            {/* Save recipient */}
            <Button
              type="button"
              // Disable if contact object does not include EUA or email
              disabled={
                !(
                  activeContact?.userAccount.username &&
                  activeContact?.userAccount.email
                )
              }
              onClick={() => {
                verifyContact().then(() => {
                  setActive(false);
                  setActiveContact(null);
                });
              }}
              className="margin-top-0"
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
              className="margin-top-0"
            >
              {t('Cancel')}
            </Button>
          </ButtonGroup>
        </FieldGroup>
      )}
    </div>
  );
};

type EmailRecipientsFieldsProps = {
  optional?: boolean;
  className?: string;
  alertClassName?: string;
  systemIntakeId: string;
  activeContact: SystemIntakeContactFragment | null;
  setActiveContact: (contact: SystemIntakeContactFragment | null) => void;
  contacts: FormattedContacts;
  recipients: EmailNotificationRecipients;
  setRecipients: (recipients: EmailNotificationRecipients) => void;
  error: string;
};

/**
 * Email recipient fields with functionality to verify and add recipients
 */
const EmailRecipientsFields = ({
  optional = true,
  className,
  alertClassName,
  systemIntakeId,
  activeContact,
  setActiveContact,
  contacts,
  recipients,
  setRecipients,
  error
}: EmailRecipientsFieldsProps) => {
  const { t } = useTranslation('action');

  const { createContact } = useSystemIntakeContacts(systemIntakeId);

  const { requester } = contacts;

  const { regularRecipientEmails } = recipients;

  const contactsArray = useMemo(() => {
    return [
      ...(contacts?.businessOwner ? [contacts.businessOwner] : []),
      ...(contacts?.productManager ? [contacts.productManager] : []),
      ...(contacts?.additionalContacts ? contacts.additionalContacts : [])
    ];
  }, [contacts]);

  /** Verified contacts - contains all initial verified contacts and any additional contacts */
  const [verifiedContacts, setVerifiedContacts] = useState<
    SystemIntakeContactFragment[]
  >(contactsArray.filter(contact => contact.id));

  /**
   * Unverified contacts - contains all initial unverified contacts
   *
   * Newly verified contacts remain in this array to preserve display order
   */
  const [unverifiedContacts, setUnverifiedContacts] = useState<
    SystemIntakeContactFragment[]
  >(contactsArray.filter(contact => !contact.id));

  /** Initial default recipients */
  const defaultRecipients: EmailNotificationRecipients =
    useRef(recipients).current;

  /** Number of selected recipients */
  const selectedCount = Object.values(recipients)
    .flat()
    .filter(value => value).length;

  /** Returns true if a recipient with an external email has been selected */
  const externalRecipients: boolean = useMemo(
    () => !!regularRecipientEmails.find(email => isExternalEmail(email)),
    [regularRecipientEmails]
  );

  /**
   * Updates email recipients in system intake
   */
  const updateRecipients = (value: string) => {
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
    contact: SystemIntakeContactFragment,
    /** Index of contact in unverifiedContacts array - used to preserve display order */
    index: number
  ): Promise<void> => {
    // Create system intake contact
    return createContact({
      ...contact,
      username: contact.userAccount.username,
      commonName: contact.userAccount.commonName,
      email: contact.userAccount.email
    }).then(response => {
      // Check for response
      if (response) {
        // Newly verified contacts should automatically be selected as recipients
        if (
          // Check if response from CEDAR includes email
          response?.userAccount.email &&
          // Check if contact is already selected as recipient
          !recipients.regularRecipientEmails.includes(
            response.userAccount.email
          )
        ) {
          // Add contact email to recipients array
          setRecipients({
            ...recipients,
            regularRecipientEmails: [
              ...recipients.regularRecipientEmails,
              response.userAccount.email
            ]
          });
        }

        /** Updated unverified contacts array */
        // Shallow copy unverifiedContacts state array so that it can be modified
        const updatedUnverifiedContacts = [...unverifiedContacts];
        // Overwrite existing contact with new data from mutation response
        updatedUnverifiedContacts[index] = response;
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
  const createContactCallback = (contact: SystemIntakeContactFragment) => {
    // Add contact to verified contacts array
    setVerifiedContacts([...verifiedContacts, contact]);

    // New contacts should automatically be selected as recipients
    if (
      // Check if response from CEDAR includes email
      contact.userAccount.email &&
      // Check if contact is already selected as recipient
      !recipients.regularRecipientEmails.includes(contact.userAccount.email)
    ) {
      // Add contact email to recipients array
      setRecipients({
        ...recipients,
        regularRecipientEmails: [
          ...recipients.regularRecipientEmails,
          contact.userAccount.email
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
      {/* Email required alert */}
      {!optional && (
        <Alert type="info" slim className={classnames(alertClassName)}>
          {t('emailRecipients.emailRequired')}
        </Alert>
      )}

      {/* Unverified recipients alert */}
      {unverifiedContacts.length > 0 && (
        <Alert type="warning" slim data-testid="alert_unverified-recipients">
          {t('emailRecipients.unverifiedRecipientsWarning')}
        </Alert>
      )}

      {/* Recipients list */}
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
        {requester && (
          <CheckboxField
            id={`${requester?.userAccount.username}-requester`}
            name={`${requester?.userAccount.username}-requester`}
            label={
              <RecipientLabel
                name={`${getPersonNameAndComponentAcronym(
                  requester.userAccount.commonName,
                  requester.component
                )} (Requester)`}
                email={requester.userAccount.email}
              />
            }
            value={requester?.userAccount.email || ''}
            onChange={e => updateRecipients(e.target.value)}
            onBlur={() => null}
            checked={
              !!requester?.userAccount.email &&
              recipients.regularRecipientEmails.includes(
                requester.userAccount.email
              )
            }
            disabled={!requester?.userAccount.email} // Disable if no email provided - only applies to test data
          />
        )}

        {/* IT Governance */}
        <CheckboxField
          label={
            <RecipientLabel name={t('itGovernance')} email={IT_GOV_EMAIL} />
          }
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
            label={
              <RecipientLabel
                name={t('itInvestment')}
                email={IT_INVESTMENT_EMAIL}
              />
            }
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
              contact={contact}
              updateRecipients={updateRecipients}
              activeContact={activeContact}
              setActiveContact={setActiveContact}
              verifyContact={() =>
                verifyContact({ ...contact, ...activeContact }, index)
              }
              checked={
                contact.userAccount.email
                  ? !!recipients.regularRecipientEmails.includes(
                      contact.userAccount.email
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
                label={
                  <RecipientLabel
                    name={t('itInvestment')}
                    email={IT_INVESTMENT_EMAIL}
                  />
                }
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
                      name={`${contact.userAccount.username}-${contact.roles[0]}`}
                      label={
                        <RecipientLabel
                          name={`${getPersonNameAndComponentAcronym(
                            contact.userAccount.commonName,
                            contact.component
                          )} (${contact?.roles[0]})`}
                          email={contact?.userAccount.email}
                        />
                      }
                      value={contact?.userAccount.email || ''}
                      onChange={e => updateRecipients(e.target.value)}
                      onBlur={() => null}
                      checked={
                        !!contact?.userAccount.email &&
                        recipients.regularRecipientEmails.includes(
                          contact.userAccount.email
                        )
                      }
                      disabled={!contact?.userAccount.email} // Disable if no email provided - only applies to test data
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
              showExternalUsersWarning={externalRecipients}
              createContactCallback={createContactCallback}
              type="recipient"
              className="margin-top-3"
            />
          </TruncatedContent>
        </div>
      </FieldGroup>
    </div>
  );
};

export default EmailRecipientsFields;
