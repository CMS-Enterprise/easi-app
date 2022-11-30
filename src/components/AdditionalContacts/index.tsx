import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dropdown, Label } from '@trussworks/react-uswds';
import classNames from 'classnames';

import CedarContactSelect from 'components/CedarContactSelect';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import Spinner from 'components/Spinner';
import contactRoles from 'constants/enums/contactRoles';
import { initialContactDetails } from 'constants/systemIntake';
import useSystemIntakeContacts from 'hooks/useSystemIntakeContacts';
import { GetSystemIntakeContacts_systemIntakeContacts_systemIntakeContacts as AugmentedSystemIntakeContact } from 'queries/types/GetSystemIntakeContacts';
import {
  DeleteContactType,
  SystemIntakeContactProps
} from 'types/systemIntake';

import cmsDivisionsAndOfficesOptions from './cmsDivisionsAndOfficesOptions';

type ContactProps = {
  /** Contact object for display */
  contact: SystemIntakeContactProps;
  /** Delete contact from database */
  deleteContact: DeleteContactType;
  /** Set active contact when editing */
  setActiveContact: (activeContact: SystemIntakeContactProps | null) => void;
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
  const { commonName, component, role, id } = contact;
  const { t } = useTranslation('intake');

  if (hideContact) return null;
  return (
    <div>
      <p className="text-bold">
        {commonName}, {component}
      </p>
      <p>{role}</p>
      <p>{contact.email}</p>
      <div className="system-intake-contacts__contact-actions">
        <Button
          type="button"
          unstyled
          onClick={() => {
            setActiveContact(contact);
          }}
        >
          {t('Edit', { type })}
        </Button>
        <Button
          type="button"
          unstyled
          className="text-error margin-left-2"
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
    </div>
  );
};

type ContactFormProps = {
  /** Contact being created or edited */
  activeContact: SystemIntakeContactProps;
  /** Set active contact */
  setActiveContact: (contact: SystemIntakeContactProps | null) => void;
  /** Create or update contact on form submission */
  onSubmit: (contact: SystemIntakeContactProps) => any;
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

  /** Error handling and save contact */
  const handleSubmit = () => {
    const submitErrors = {
      commonName: activeContact.commonName
        ? ''
        : t('contactDetails.additionalContacts.errors.commonName', { type }),
      component: activeContact.component
        ? ''
        : t('contactDetails.additionalContacts.errors.component', { type }),
      role: activeContact.role
        ? ''
        : t('contactDetails.additionalContacts.errors.role', { type })
    };
    setErrors(submitErrors);
    if (
      !submitErrors.commonName &&
      !submitErrors.component &&
      !submitErrors.role
    ) {
      onSubmit(activeContact);
    }
  };

  return (
    <div className="systemIntakeContactForm">
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
        <FieldErrorMsg>{errors.commonName}</FieldErrorMsg>
        <CedarContactSelect
          id="IntakeForm-ContactCommonName"
          name="systemIntakeContact.commonName"
          ariaDescribedBy="IntakeForm-BusinessOwnerHelp"
          value={activeContact.euaUserId ? activeContact : undefined}
          onChange={cedarContact =>
            setActiveContact({ ...activeContact, ...cedarContact })
          }
        />
      </FieldGroup>

      {/* Contact Component */}
      <FieldGroup className="margin-top-2" error={!!errors.component}>
        <Label className="text-normal" htmlFor="systemIntakeContact.component">
          {t('contactDetails.additionalContacts.component', { type })}
        </Label>
        <FieldErrorMsg>{errors.component}</FieldErrorMsg>
        <Dropdown
          id="IntakeForm-ContactComponent"
          name="systemIntakeContact.component"
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
        </Dropdown>
      </FieldGroup>

      {/* Contact Role */}
      <FieldGroup className="margin-top-2" error={!!errors.role}>
        <Label className="text-normal" htmlFor="systemIntakeContact.role">
          {t('contactDetails.additionalContacts.role', { type })}
        </Label>
        <FieldErrorMsg>{errors.role}</FieldErrorMsg>
        <Dropdown
          id="IntakeForm-ContactRole"
          name="systemIntakeContact.role"
          value={activeContact.role}
          onChange={e =>
            setActiveContact({ ...activeContact, role: e.target.value })
          }
        >
          <option value="" disabled>
            {t('contactDetails.additionalContacts.select')}
          </option>
          {contactRoles.map(option => (
            <option key={option} value={option}>
              {t(option)}
            </option>
          ))}
        </Dropdown>
      </FieldGroup>

      {/* Action Buttons */}
      <div className="margin-top-2">
        <Button type="button" outline onClick={() => setActiveContact(null)}>
          {t('Cancel')}
        </Button>
        <Button type="button" onClick={() => handleSubmit()}>
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
  /** System intake ID */
  systemIntakeId: string;
  /** System intake additional contacts - used to render contacts list */
  contacts?: SystemIntakeContactProps[];
  /** Contact being created or edited */
  activeContact: SystemIntakeContactProps | null;
  /** Set active contact */
  setActiveContact: (contact: SystemIntakeContactProps | null) => void;
  /** Function called after contact is created */
  createContactCallback?: (contact: AugmentedSystemIntakeContact) => any;
  /** Type of form - Recipient type does not display contacts */
  type?: 'recipient' | 'contact';
  /** Outer div class */
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
  createContactCallback,
  type = 'contact',
  className
}: AdditionalContactsProps) {
  const { t } = useTranslation('intake');
  const {
    createContact,
    updateContact,
    deleteContact
  } = useSystemIntakeContacts(systemIntakeId);

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
    contact: SystemIntakeContactProps
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
    contact: SystemIntakeContactProps
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
      {contacts && (
        // Only display list of additional contacts if type is set to 'contact'
        <>
          <h4>
            {t(
              type === 'contact'
                ? 'contactDetails.additionalContacts.titleContacts'
                : 'contactDetails.additionalContacts.titleRecipients'
            )}
          </h4>
          <div className="system-intake-contacts__contacts-list">
            {contacts.map(contact => {
              // Show form if editing contact
              if (
                activeContact &&
                activeContact?.id === contact.id &&
                activeContact?.systemIntakeId
              ) {
                if (loading) {
                  return (
                    <div className="margin-bottom-205">
                      <Spinner />
                    </div>
                  );
                }
                return (
                  <div key={contact.euaUserId}>
                    <ContactForm
                      key={contact.euaUserId}
                      activeContact={activeContact}
                      setActiveContact={setActiveContact}
                      onSubmit={handleUpdateContact}
                      type={type}
                    />
                    <Button
                      type="button"
                      unstyled
                      className="text-error margin-top-2"
                      onClick={() =>
                        deleteContact(activeContact.id!).then(() =>
                          setActiveContact(null)
                        )
                      }
                    >
                      {t('contactDetails.additionalContacts.delete', { type })}
                    </Button>
                  </div>
                );
              }
              return (
                <Contact
                  key={contact.euaUserId}
                  contact={contact as SystemIntakeContactProps}
                  deleteContact={deleteContact}
                  setActiveContact={setActiveContact}
                  type={type}
                />
              );
            })}
          </div>
        </>
      )}

      {activeContact && !activeContact.id && !activeContact.systemIntakeId && (
        <>
          {loading ? (
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
      )}

      {(!activeContact || activeContact?.systemIntakeId) && (
        // Button to add additional contact
        <Button
          type="button"
          outline
          onClick={() => setActiveContact(initialContactDetails)}
          disabled={!!activeContact?.id || loading}
        >
          {t('contactDetails.additionalContacts.add', { type })}
        </Button>
      )}
    </div>
  );
}
