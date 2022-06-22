import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dropdown, Label } from '@trussworks/react-uswds';

import FieldGroup from 'components/shared/FieldGroup';
import { SystemIntakeContactProps } from 'types/systemIntake';

import CedarContactSelect from './CedarContactSelect';
import cmsDivisionsAndOfficesOptions from './utilities';

const contactRoleOptions = [
  'Product Owner',
  'System Owner',
  'System Maintainer',
  "Contracting Officer's Representative (COR)",
  'Cloud Navigator',
  'Privacy Advisor',
  'CRA',
  'Other',
  'Unknown'
];

const Contact = ({
  contact,
  deleteContact,
  setActiveContact
}: {
  contact: SystemIntakeContactProps;
  deleteContact: (id: string, callback?: () => any) => void;
  setActiveContact: (activeContact: SystemIntakeContactProps | null) => void;
}) => {
  const { commonName, component, role, id } = contact;

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
          Edit
        </Button>
        <Button
          type="button"
          unstyled
          className="text-error margin-left-2"
          onClick={() =>
            deleteContact(id as string, () => setActiveContact(null))
          }
        >
          Delete Contact
        </Button>
      </div>
    </div>
  );
};

const initialContact = {
  euaUserId: '',
  commonName: '',
  email: '',
  component: '',
  role: '',
  id: ''
};

const ContactForm = ({
  activeContact,
  setActiveContact,
  onSubmit
}: {
  activeContact: SystemIntakeContactProps;
  setActiveContact: (contact: SystemIntakeContactProps | null) => void;
  onSubmit: (
    contact: SystemIntakeContactProps,
    callback?: (() => any) | undefined
  ) => void;
}) => {
  const { t } = useTranslation();

  return (
    <div className="systemIntakeContactForm">
      <h4 className="margin-bottom-2">
        {t(activeContact?.id ? 'Edit contact' : 'Add another contact')}
      </h4>

      {/* Contact Name */}
      <FieldGroup className="margin-top-2">
        <Label className="text-normal" htmlFor="systemIntakeContact.commonName">
          {t('New contact name')}
        </Label>
        <CedarContactSelect
          id="systemIntakeContact.commonName"
          name="systemIntakeContact.commonName"
          ariaDescribedBy="IntakeForm-BusinessOwnerHelp"
          defaultValue={activeContact.euaUserId}
          onChange={cedarContact =>
            setActiveContact({ ...activeContact, ...cedarContact })
          }
        />
      </FieldGroup>

      {/* Contact Component */}
      <FieldGroup className="margin-top-2">
        <Label className="text-normal" htmlFor="systemIntakeContact.component">
          {t('New contact component')}
        </Label>
        <Dropdown
          id="systemIntakeContact.component"
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
            {t('Select an option')}
          </option>
          {cmsDivisionsAndOfficesOptions('systemIntakeContact')}
        </Dropdown>
      </FieldGroup>

      {/* Contact Role */}
      <FieldGroup className="margin-top-2">
        <Label className="text-normal" htmlFor="systemIntakeContact.role">
          {t('New contact role')}
        </Label>
        <Dropdown
          id="systemIntakeContact.role"
          name="systemIntakeContact.role"
          value={activeContact.role}
          onChange={e =>
            setActiveContact({ ...activeContact, role: e.target.value })
          }
        >
          <option value="" disabled>
            {t('Select an option')}
          </option>
          {contactRoleOptions.map(option => (
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
        <Button
          type="button"
          onClick={() => onSubmit(activeContact, () => setActiveContact(null))}
        >
          {t(activeContact?.id ? 'Save' : 'Add contact')}
        </Button>
      </div>
    </div>
  );
};

export default function AdditionalContacts({
  systemIntakeId,
  activeContact,
  setActiveContact,
  contacts,
  createContact,
  updateContact,
  deleteContact
}: {
  systemIntakeId: string;
  activeContact: SystemIntakeContactProps | null;
  setActiveContact: (contact: SystemIntakeContactProps | null) => void;
  contacts: SystemIntakeContactProps[] | [];
  createContact: (
    contact: SystemIntakeContactProps,
    callback?: () => any
  ) => void;
  updateContact: (
    contact: SystemIntakeContactProps,
    callback?: () => any
  ) => void;
  deleteContact: (id: string, callback?: () => any) => void;
}) {
  return (
    <div className="system-intake-contacts margin-top-4">
      {contacts.length > 0 && (
        <>
          <h4>Additional contacts</h4>
          <div className="system-intake-contacts__contacts-list">
            {contacts.map(contact => {
              // Show form if editing contact
              if (activeContact && activeContact?.id === contact.id) {
                return (
                  <div>
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
                        deleteContact(activeContact.id as string, () =>
                          setActiveContact(null)
                        )
                      }
                    >
                      Delete Contact
                    </Button>
                  </div>
                );
              }
              return (
                <Contact
                  key={contact.euaUserId}
                  contact={contact}
                  deleteContact={deleteContact}
                  setActiveContact={setActiveContact}
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
            setActiveContact({ ...initialContact, systemIntakeId })
          }
          disabled={!!activeContact?.id}
        >
          Add another contact
        </Button>
      )}
    </div>
  );
}
