import React, { useEffect, useState } from 'react';
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
  FormattedContacts,
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
  const { commonName, component, role, id } = contact;
  const { t } = useTranslation('intake');

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
          onClick={() => setActiveContact(contact)}
        >
          {t('Edit', { type })}
        </Button>
        <Button
          type="button"
          unstyled
          className="text-error margin-left-2"
          onClick={() => deleteContact(id!).then(() => setActiveContact(null))}
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
      setActiveContact(null);
    }
  };

  return (
    <div className="systemIntakeContactForm">
      <h4 className="margin-bottom-2">
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
  /** System intake contacts */
  contacts: {
    /** Formatted contacts object */
    data: FormattedContacts;
    /** System intake contacts query loading state */
    loading: boolean;
  };
  /** Contact being created or edited */
  activeContact: SystemIntakeContactProps | null;
  /** Set active contact */
  setActiveContact: (contact: SystemIntakeContactProps | null) => void;
  /** Function called after contact is created */
  onCreateContact?: (contact: AugmentedSystemIntakeContact) => any;
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
  onCreateContact,
  type = 'contact',
  className
}: AdditionalContactsProps) {
  const { t } = useTranslation('intake');
  const {
    createContact,
    updateContact,
    deleteContact
  } = useSystemIntakeContacts(systemIntakeId);

  // Loading state to control spinner component rendering
  const [loading, setLoading] = useState(contacts.loading);

  const { additionalContacts } = contacts.data;

  // Keep loading state in sync with contacts query loading state
  useEffect(() => {
    setLoading(contacts.loading);
  }, [contacts.loading]);

  // if (contacts.loading) return null;

  return (
    <div className={classNames('system-intake-contacts', className)}>
      {type === 'contact' && (
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
            {additionalContacts.map(contact => {
              // Show form if editing contact
              if (
                activeContact &&
                activeContact?.id === contact.id &&
                activeContact?.systemIntakeId
              ) {
                return (
                  <div key={contact.euaUserId}>
                    <ContactForm
                      key={contact.euaUserId}
                      activeContact={activeContact}
                      setActiveContact={setActiveContact}
                      onSubmit={updateContact}
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

      {loading && (
        <div className="margin-bottom-205">
          <Spinner />
        </div>
      )}
      {activeContact &&
        !activeContact.id &&
        !activeContact.systemIntakeId &&
        !loading && (
          <ContactForm
            activeContact={activeContact}
            setActiveContact={setActiveContact}
            onSubmit={contact => {
              // Handle loading state when contact is created
              setLoading(true);
              createContact(contact).then(response => {
                if (response) {
                  // Set loading as false after mutation is completed
                  setLoading(false);
                  // Handle response after contact is created
                  if (onCreateContact) {
                    onCreateContact(response);
                  }
                }
              });
            }}
            type={type}
          />
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
