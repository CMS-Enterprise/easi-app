import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Label, Select } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { ExternalRecipientAlert } from 'features/TechnicalAssistance/Admin/_components/ActionFormWrapper/Recipients';
import {
  PersonRole,
  SystemIntakeContactFragment,
  SystemIntakeContactRole
} from 'gql/generated/graphql';
import i18next from 'i18next';

import Alert from 'components/Alert';
import CedarContactSelect from 'components/CedarContactSelect';
import FieldErrorMsg from 'components/FieldErrorMsg';
import FieldGroup from 'components/FieldGroup';
import HelpText from 'components/HelpText';
import Spinner from 'components/Spinner';
import useSystemIntakeContacts from 'hooks/useSystemIntakeContacts';
import { ContactInputType, DeleteContactType } from 'types/systemIntake';

import cmsDivisionsAndOfficesOptions from './cmsDivisionsAndOfficesOptions';

export const initialContactDetails: SystemIntakeContactFragment = {
  __typename: 'SystemIntakeContact',
  id: '',
  systemIntakeId: '',
  userAccount: {
    __typename: 'UserAccount',
    id: '',
    username: '',
    commonName: '',
    email: ''
  },
  component: undefined,
  roles: [],
  isRequester: false
};

type ContactProps = {
  /** Contact object for display */
  contact: SystemIntakeContactFragment;
  /** Delete contact from database */
  deleteContact: DeleteContactType;
  /** Set active contact when editing */
  setActiveContact: (activeContact: SystemIntakeContactFragment | null) => void;
  /** Type of display */
  type: 'contact' | 'recipient';
};

/**
 * Component to display additional contact
 */
const Contact = ({
  contact,
  deleteContact,
  setActiveContact,
  type
}: ContactProps) => {
  const [
    /** Whether to hide the contact in the UI */
    hideContact,
    /** Used to automatically hide contact when deleted instead of waiting for deleteContact mutation to complete */
    setHideContact
  ] = useState(false);
  const {
    userAccount: { commonName },
    component,
    roles,
    id
  } = contact;
  const { t } = useTranslation('intake');

  if (hideContact) return null;
  return (
    <>
      <p className="text-bold">
        {commonName}, {component}
      </p>
      <p>{roles[0]}</p>
      <p>{contact.userAccount.email}</p>
      <div className="system-intake-contacts__contact-actions">
        <Button
          type="button"
          unstyled
          className="margin-top-0"
          onClick={() => {
            setActiveContact(contact);
          }}
        >
          {t('Edit', { type })}
        </Button>
        <Button
          type="button"
          unstyled
          className="text-error margin-left-2 margin-top-0"
          onClick={() => {
            // Hide contact in UI
            setHideContact(true);
            // Delete contact mutation
            deleteContact(id!)
              .then(() => {
                // Set active contact to null
                setActiveContact(null);
              })
              .catch(() => {
                // Show contact in UI
                setHideContact(false);
              });
          }}
        >
          {t('contactDetails.additionalContacts.delete', { type })}
        </Button>
      </div>
    </>
  );
};

type ContactFormProps = {
  /** Contact being created or edited */
  activeContact: SystemIntakeContactFragment;
  /** Set active contact */
  setActiveContact: (contact: SystemIntakeContactFragment | null) => void;
  /** Create or update contact on form submission */
  onSubmit: (contact: ContactInputType) => any;
  /** Type of form */
  type: 'contact' | 'recipient';
};

/**
 * Form to create or update additional contacts
 */
const ContactForm = ({
  activeContact,
  setActiveContact,
  onSubmit,
  type
}: ContactFormProps) => {
  const { t } = useTranslation('intake');

  const [errors, setErrors] = useState({
    commonName: '',
    component: '',
    role: ''
  });

  const contactRoles: Record<PersonRole, string> = i18next.t(
    'technicalAssistance:attendees.contactRoles',
    {
      returnObjects: true
    }
  );

  /** Error handling and save contact */
  const handleSubmit = () => {
    const {
      userAccount: { username, commonName, email },
      ...submittedContact
    } = activeContact;

    const submitErrors = {
      commonName: commonName
        ? ''
        : t('contactDetails.additionalContacts.errors.commonName', { type }),
      component: submittedContact.component
        ? ''
        : t('contactDetails.additionalContacts.errors.component', { type }),
      role: submittedContact.roles[0]
        ? ''
        : t('contactDetails.additionalContacts.errors.role', { type })
    };

    setErrors(submitErrors);

    if (
      !submitErrors.commonName &&
      !submitErrors.component &&
      !submitErrors.role
    ) {
      onSubmit({
        ...submittedContact,
        username,
        commonName,
        email
      });
    }
  };

  return (
    <div
      className="systemIntakeContactForm"
      data-testid="systemIntakeContactForm"
    >
      <h4 className="margin-bottom-2 margin-top-0">
        {t(
          activeContact?.id
            ? 'contactDetails.additionalContacts.edit'
            : 'contactDetails.additionalContacts.add',
          { type }
        )}
      </h4>

      {/* Contact Name */}
      <FieldGroup className="margin-top-2" error={!!errors.commonName}>
        <Label className="text-normal" htmlFor="systemIntakeContact.commonName">
          {t('contactDetails.additionalContacts.name', { type })}
        </Label>
        <HelpText className="margin-top-1">
          {t('technicalAssistance:emailRecipientFields.newRecipientHelpText')}
        </HelpText>
        <FieldErrorMsg>{errors.commonName}</FieldErrorMsg>
        <CedarContactSelect
          id="IntakeForm-ContactCommonName"
          name="systemIntakeContact.commonName"
          ariaDescribedBy="IntakeForm-BusinessOwnerHelp"
          value={
            activeContact.userAccount.username.length > 0
              ? {
                  euaUserId: activeContact.userAccount.username,
                  commonName: activeContact.userAccount.commonName,
                  email: activeContact.userAccount.email
                }
              : undefined
          }
          onChange={cedarContact =>
            setActiveContact({
              ...activeContact,
              userAccount: {
                ...activeContact.userAccount,
                ...(cedarContact
                  ? {
                      username: cedarContact.euaUserId || '',
                      commonName: cedarContact.commonName || '',
                      email: cedarContact.email || ''
                    }
                  : {})
              }
            })
          }
        />
      </FieldGroup>

      {/* Contact Component */}
      <FieldGroup className="margin-top-2" error={!!errors.component}>
        <Label className="text-normal" htmlFor="systemIntakeContact.component">
          {t('contactDetails.additionalContacts.component', { type })}
        </Label>
        <FieldErrorMsg>{errors.component}</FieldErrorMsg>
        <Select
          id="IntakeForm-ContactComponent"
          name="systemIntakeContact.component"
          data-testid="IntakeForm-ContactComponent"
          value={activeContact.component}
          onChange={e =>
            setActiveContact({
              ...activeContact,
              component: e.target.value
            })
          }
        >
          <option value="" disabled>
            {t('contactDetails.additionalContacts.select')}
          </option>
          {cmsDivisionsAndOfficesOptions('systemIntakeContact')}
        </Select>
      </FieldGroup>

      {/* Contact Role */}
      <FieldGroup className="margin-top-2" error={!!errors.role}>
        <Label className="text-normal" htmlFor="systemIntakeContact.role">
          {t('contactDetails.additionalContacts.role', { type })}
        </Label>
        <FieldErrorMsg>{errors.role}</FieldErrorMsg>
        <Select
          id="IntakeForm-ContactRole"
          name="systemIntakeContact.role"
          data-testid="IntakeForm-ContactRole"
          value={activeContact.roles[0]}
          onChange={e =>
            setActiveContact({
              ...activeContact,
              roles: [e.target.value as SystemIntakeContactRole]
            })
          }
        >
          <option value="" disabled>
            {t('contactDetails.additionalContacts.select')}
          </option>
          {Object.keys(PersonRole).map(role => (
            <option key={role} value={role as PersonRole}>
              {contactRoles[role as PersonRole]}
            </option>
          ))}
        </Select>
      </FieldGroup>

      <ExternalRecipientAlert email={activeContact.userAccount.email} />

      {/* Action Buttons */}
      <div className="margin-top-2">
        <Button
          className="margin-top-0"
          type="button"
          outline
          onClick={() => setActiveContact(null)}
        >
          {t('Cancel')}
        </Button>
        <Button
          className="margin-top-0"
          type="button"
          onClick={() => handleSubmit()}
        >
          {t(
            activeContact?.id
              ? 'contactDetails.additionalContacts.save'
              : 'contactDetails.additionalContacts.addContact',
            { type }
          )}
        </Button>
      </div>
    </div>
  );
};

type AdditionalContactsProps = {
  systemIntakeId: string;
  contacts?: SystemIntakeContactFragment[];
  /** Contact being created or edited */
  activeContact: SystemIntakeContactFragment | null;
  /** Set active contact */
  setActiveContact: (contact: SystemIntakeContactFragment | null) => void;
  showExternalUsersWarning?: boolean;
  createContactCallback?: (contact: SystemIntakeContactFragment) => any;
  /** Type of form - Recipient type does not display contacts */
  type?: 'recipient' | 'contact';
  className?: string;
};

/**
 * Additional contacts/recipients component for system intakes
 */
export default function AdditionalContacts({
  systemIntakeId,
  contacts,
  activeContact,
  setActiveContact,
  showExternalUsersWarning,
  createContactCallback,
  type = 'contact',
  className
}: AdditionalContactsProps) {
  const { t } = useTranslation('intake');

  // Contact mutations from custom hook
  const { createContact, updateContact, deleteContact } =
    useSystemIntakeContacts(systemIntakeId);

  // Separate loading state to enable more control of loading spinner rendering
  const [
    /** Whether to show loading spinner */
    loading,
    /** Show or hide loading spinner */
    setLoading
  ] = useState(false);

  /**
   * Creates contact, handles loading state, and executes createContactCallback
   */
  const handleCreateContact = async (
    contact: ContactInputType
  ): Promise<void> => {
    // Show loading spinner
    setLoading(true);

    // Create contact mutation
    const response = await createContact(contact);

    // Hide loading spinner after mutation is completed
    setLoading(false);

    // Check for response
    if (response) {
      // Reset active contact
      setActiveContact(null);
      // Execute callback
      if (createContactCallback) {
        createContactCallback(response);
      }
    }
  };

  /**
   * Updates contact and handles loading state
   */
  const handleUpdateContact = async (
    contact: ContactInputType
  ): Promise<void> => {
    // Show loading spinner
    setLoading(true);

    // Update contact mutation
    const response = await updateContact(contact);

    // Hide loading spinner after mutation is completed
    setLoading(false);

    // Check for response
    if (response) {
      // Reset active contact
      setActiveContact(null);
    }
  };

  return (
    <div className={classNames('system-intake-contacts', className)}>
      {
        /**
         * Additional Contacts List
         * Only displayed if type prop is set to 'contact'
         */
        contacts && (
          <>
            <h4>{t('contactDetails.additionalContacts.titleContacts')}</h4>
            <div
              className="system-intake-contacts__contacts-list"
              data-testid="systemIntakeContacts__contactsList"
            >
              {contacts.map(contact => {
                /** Whether or not the contact is being edited */
                const isEditing =
                  // Active contact object exists
                  activeContact &&
                  // Active contact ID is equal to current contact ID
                  activeContact?.id === contact.id &&
                  // Active contact object includes system intake ID
                  !!activeContact?.systemIntakeId;

                // If loading, return spinner
                if (loading) {
                  return (
                    <div key={contact.id} className="margin-bottom-205">
                      <Spinner />
                    </div>
                  );
                }

                return (
                  <div
                    id={`systemIntakeContact-${contact.id}`}
                    data-testid={`systemIntakeContact-${contact.id}`}
                    key={contact.id}
                  >
                    {isEditing ? (
                      // If editing, return contact form
                      <>
                        <ContactForm
                          activeContact={activeContact}
                          setActiveContact={setActiveContact}
                          onSubmit={handleUpdateContact}
                          type={type}
                        />
                        <Button
                          type="button"
                          unstyled
                          className="text-error margin-top-2"
                          onClick={() => {
                            // Delete contact and reset active contact to null
                            deleteContact(activeContact.id!).then(() =>
                              setActiveContact(null)
                            );
                          }}
                        >
                          {t('contactDetails.additionalContacts.delete', {
                            type
                          })}
                        </Button>
                      </>
                    ) : (
                      <Contact
                        contact={contact}
                        deleteContact={deleteContact}
                        setActiveContact={setActiveContact}
                        type={type}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )
      }

      {
        /**
         * Contact Form
         * Displayed when creating new additional contact
         */
        activeContact && !activeContact.id && !activeContact.systemIntakeId && (
          <>
            {loading ? (
              // If loading, return spinner
              <div className="margin-bottom-205">
                <Spinner />
              </div>
            ) : (
              <ContactForm
                activeContact={activeContact}
                setActiveContact={setActiveContact}
                onSubmit={handleCreateContact}
                type={type}
              />
            )}
          </>
        )
      }

      {showExternalUsersWarning && (
        <Alert type="warning" className="margin-bottom-3" slim>
          {t('action:selectExternalRecipientWarning')}
        </Alert>
      )}

      {
        /** Button to add additional contact */
        (!activeContact || activeContact?.systemIntakeId) && (
          <Button
            type="button"
            outline
            // On button click, set initial active contact object
            onClick={() => {
              setActiveContact(initialContactDetails);
            }}
            className="margin-top-0"
            // Disable button if editing or loading
            disabled={!!activeContact?.id || loading}
          >
            {t('contactDetails.additionalContacts.add', { type })}
          </Button>
        )
      }
    </div>
  );
}
