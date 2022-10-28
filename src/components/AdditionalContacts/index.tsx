import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dropdown, Label } from '@trussworks/react-uswds';
import classNames from 'classnames';

import CedarContactSelect from 'components/CedarContactSelect';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import contactRoles from 'constants/enums/contactRoles';
import { initialContactDetails } from 'constants/systemIntake';
import useSystemIntakeContacts from 'hooks/useSystemIntakeContacts';
import {
  CreateContactType,
  DeleteContactType,
  SystemIntakeContactProps,
  UpdateContactType
} from 'types/systemIntake';

import cmsDivisionsAndOfficesOptions from './cmsDivisionsAndOfficesOptions';

const Contact = ({
  contact,
  deleteContact,
  setActiveContact,
  type
}: {
  contact: SystemIntakeContactProps;
  deleteContact: DeleteContactType;
  setActiveContact: (activeContact: SystemIntakeContactProps | null) => void;
  type: 'contact' | 'recipient';
}) => {
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

const ContactForm = ({
  activeContact,
  setActiveContact,
  onSubmit,
  type
}: {
  activeContact: SystemIntakeContactProps;
  setActiveContact: (contact: SystemIntakeContactProps | null) => void;
  onSubmit: CreateContactType | UpdateContactType;
  type: 'contact' | 'recipient';
}) => {
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
          {contactRoles.map(({ label }) => (
            <option key={label} value={label}>
              {t(label)}
            </option>
          ))}
        </Dropdown>
      </FieldGroup>

      {/* Action Buttons */}
      <div className="margin-top-2">
        <Button type="button" outline onClick={() => setActiveContact(null)}>
          Cancel
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
  systemIntakeId: string;
  activeContact: SystemIntakeContactProps | null;
  setActiveContact: (contact: SystemIntakeContactProps | null) => void;
  type?: 'recipient' | 'contact';
  className?: string;
};

export default function AdditionalContacts({
  systemIntakeId,
  activeContact,
  setActiveContact,
  type = 'contact',
  className
}: AdditionalContactsProps) {
  const { t } = useTranslation('intake');
  const {
    contacts: {
      data: { additionalContacts },
      loading
    },
    createContact,
    updateContact,
    deleteContact
  } = useSystemIntakeContacts(systemIntakeId);

  // Wait for contacts to load
  if (loading) return null;

  return (
    <div className={classNames('system-intake-contacts', className)}>
      {type === 'contact' && (
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

      {activeContact && !activeContact.id && !activeContact.systemIntakeId && (
        <ContactForm
          activeContact={activeContact}
          setActiveContact={setActiveContact}
          onSubmit={createContact}
          type={type}
        />
      )}

      {(!activeContact || activeContact?.systemIntakeId) && (
        <Button
          type="button"
          outline
          onClick={() => setActiveContact(initialContactDetails)}
          disabled={!!activeContact?.id}
        >
          {t('contactDetails.additionalContacts.add', { type })}
        </Button>
      )}
    </div>
  );
}
