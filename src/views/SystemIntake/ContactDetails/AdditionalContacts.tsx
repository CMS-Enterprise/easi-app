import React, { useState } from 'react';
import { Button, ComboBox, Dropdown, Label } from '@trussworks/react-uswds';

import FieldGroup from 'components/shared/FieldGroup';
import useSystemIntakeContacts from 'hooks/useSystemIntakeContacts';
import {
  CedarContactProps,
  SystemIntakeContactProps
} from 'types/systemIntake';

import { cmsDivionsAndOfficesOptions, getContactByEUA } from './utilities';

const contactRoles = [
  'Product Owner',
  'System Owner',
  'System Maintainer',
  "Contracting Officer's Representative (COR)",
  'Cloud Navigator',
  'Privacy Advisor',
  'CRA',
  'Other',
  'and Unknown'
];

const Contact = ({
  contact,
  deleteContact,
  resetNewContact
}: {
  contact: SystemIntakeContactProps;
  deleteContact: (id: string, callback?: () => any) => void;
  resetNewContact: () => void;
}) => {
  const { commonName, component, role, id } = contact;

  return (
    <li>
      <p className="text-bold">
        {commonName}, {component}
      </p>
      <p>{role}</p>
      {/* <p>{contact.email}</p> */}
      <div className="system-intake-contacts__contact-actions">
        <Button type="button" unstyled>
          Edit
        </Button>
        <Button
          type="button"
          unstyled
          className="text-error margin-left-2"
          onClick={() => deleteContact(id as string, resetNewContact)}
        >
          Delete Contact
        </Button>
      </div>
    </li>
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

export default function AdditionalContacts({
  systemIntakeId,
  contacts
}: {
  systemIntakeId: string;
  contacts: CedarContactProps[];
}) {
  const [
    additionalContacts,
    { createContact, deleteContact }
  ] = useSystemIntakeContacts(systemIntakeId);
  const [createFormActive, setCreateFormActive] = useState(true);
  const [newContact, setNewContact] = useState<SystemIntakeContactProps>({
    ...initialContact,
    systemIntakeId
  });

  const handleSelectContact = (euaUserId: string) => {
    const { commonName, email } = getContactByEUA(
      contacts,
      euaUserId
    ) as CedarContactProps;
    setNewContact({
      ...newContact,
      euaUserId,
      // email,
      commonName
    });
  };

  const resetNewContact = () => {
    setNewContact({
      ...initialContact,
      systemIntakeId
    });
    setCreateFormActive(false);
  };

  return (
    <div className="system-intake-contacts">
      {additionalContacts && (
        <>
          <h4>Additional contacts</h4>
          <ul className="system-intake-contacts__contacts-list usa-list--unstyled">
            {additionalContacts.map(contact => {
              return (
                <Contact
                  key={contact.euaUserId}
                  contact={contact}
                  deleteContact={deleteContact}
                  resetNewContact={resetNewContact}
                />
              );
            })}
          </ul>
        </>
      )}
      {createFormActive && (
        <>
          <h4 className="margin-bottom-2">Add another contact</h4>
          {/* Contact name */}
          <FieldGroup className="margin-top-2">
            <Label
              className="text-normal"
              htmlFor="systemIntakeContact.commonName"
            >
              New contact name
            </Label>
            <ComboBox
              id="systemIntakeContact.commonName"
              name="systemIntakeContact.commonName"
              inputProps={{
                id: 'systemIntakeContact.commonName',
                name: 'systemIntakeContact.commonName',
                'aria-describedby': 'IntakeForm-BusinessOwnerHelp'
              }}
              options={contacts.map(contact => ({
                label: contact.commonName || '',
                value: contact.euaUserId || ''
              }))}
              onChange={euaUserId =>
                euaUserId ? handleSelectContact(euaUserId) : null
              }
            />
          </FieldGroup>
          {/* Contact Component */}
          <FieldGroup className="margin-top-2">
            <Label
              className="text-normal"
              htmlFor="systemIntakeContact.component"
            >
              New contact component
            </Label>
            <Dropdown
              id="systemIntakeContact.component"
              name="systemIntakeContact.component"
              value={newContact.component || ''}
              onChange={e =>
                setNewContact({ ...newContact, component: e.target.value })
              }
            >
              <option value="" disabled>
                Select an option
              </option>
              {cmsDivionsAndOfficesOptions('systemIntakeContact')}
            </Dropdown>
          </FieldGroup>
          {/* Contact Role */}
          <FieldGroup className="margin-top-2">
            <Label className="text-normal" htmlFor="systemIntakeContact.role">
              New contact role
            </Label>
            <Dropdown
              id="systemIntakeContact.role"
              name="systemIntakeContact.role"
              value={newContact.role || ''}
              onChange={e =>
                setNewContact({ ...newContact, role: e.target.value })
              }
            >
              <option value="" disabled>
                Select an option
              </option>
              {contactRoles.map(role => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </Dropdown>
          </FieldGroup>
          <div className="margin-top-2">
            <Button type="button" outline onClick={() => resetNewContact()}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => createContact(newContact, resetNewContact)}
            >
              Add contact
            </Button>
          </div>
        </>
      )}

      {!createFormActive && (
        <Button type="button" outline onClick={() => setCreateFormActive(true)}>
          Add another contact
        </Button>
      )}
    </div>
  );
}
