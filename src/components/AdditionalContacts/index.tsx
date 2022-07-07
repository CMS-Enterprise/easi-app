import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dropdown, Label } from '@trussworks/react-uswds';

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
  setActiveContact
}: {
  contact: SystemIntakeContactProps;
  deleteContact: DeleteContactType;
  setActiveContact: (activeContact: SystemIntakeContactProps | null) => void;
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
          {t('Edit')}
        </Button>
        <Button
          type="button"
          unstyled
          className="text-error margin-left-2"
          onClick={() => deleteContact(id!).then(() => setActiveContact(null))}
        >
          {t('contactDetails.additionalContacts.delete')}
        </Button>
      </div>
    </div>
  );
};

const ContactForm = ({
  activeContact,
  setActiveContact,
  onSubmit
}: {
  activeContact: SystemIntakeContactProps;
  setActiveContact: (contact: SystemIntakeContactProps | null) => void;
  onSubmit: CreateContactType | UpdateContactType;
}) => {
  const { t } = useTranslation('intake');

  const [errors, setErrors] = useState({
    commonName: '',
    component: '',
    role: ''
  });
  const handleSubmit = () => {
    const submitErrors = {
      commonName: activeContact.commonName
        ? ''
        : t('contactDetails.additionalContacts.errors.commonName'),
      component: activeContact.component
        ? ''
        : t('contactDetails.additionalContacts.errors.component'),
      role: activeContact.role
        ? ''
        : t('contactDetails.additionalContacts.errors.role')
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
            : 'contactDetails.additionalContacts.add'
        )}
      </h4>

      {/* Contact Name */}
      <FieldGroup className="margin-top-2" error={!!errors.commonName}>
        <Label className="text-normal" htmlFor="systemIntakeContact.commonName">
          {t('contactDetails.additionalContacts.name')}
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
          {t('contactDetails.additionalContacts.component')}
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
          {t('contactDetails.additionalContacts.role')}
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
          Cancel
        </Button>
        <Button type="button" onClick={() => handleSubmit()}>
          {t(
            activeContact?.id
              ? 'contactDetails.additionalContacts.save'
              : 'contactDetails.additionalContacts.addContact'
          )}
        </Button>
      </div>
    </div>
  );
};

export default function AdditionalContacts({
  systemIntakeId,
  activeContact,
  setActiveContact
}: {
  systemIntakeId: string;
  activeContact: SystemIntakeContactProps | null;
  setActiveContact: (contact: SystemIntakeContactProps | null) => void;
}) {
  const { t } = useTranslation('intake');
  const [
    contacts,
    { createContact, updateContact, deleteContact }
  ] = useSystemIntakeContacts(systemIntakeId);

  if (!contacts?.additionalContacts) return null;

  return (
    <div className="system-intake-contacts margin-top-4">
      {contacts.additionalContacts.length > 0 && (
        <>
          <h4>{t('contactDetails.additionalContacts.title')}</h4>
          <div className="system-intake-contacts__contacts-list">
            {contacts.additionalContacts.map(contact => {
              // Show form if editing contact
              if (activeContact && activeContact?.id === contact.id) {
                return (
                  <div key={contact.euaUserId}>
                    <ContactForm
                      key={contact.euaUserId}
                      activeContact={activeContact}
                      setActiveContact={setActiveContact}
                      onSubmit={updateContact}
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
                      {t('contactDetails.additionalContacts.delete')}
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

      {activeContact && !activeContact.id && (
        <ContactForm
          activeContact={activeContact}
          setActiveContact={setActiveContact}
          onSubmit={createContact}
        />
      )}

      {(!activeContact || activeContact?.id) && (
        <Button
          type="button"
          outline
          onClick={() =>
            setActiveContact({
              ...(initialContactDetails as SystemIntakeContactProps),
              systemIntakeId
            })
          }
          disabled={!!activeContact?.id}
        >
          {t('contactDetails.additionalContacts.add')}
        </Button>
      )}
    </div>
  );
}
