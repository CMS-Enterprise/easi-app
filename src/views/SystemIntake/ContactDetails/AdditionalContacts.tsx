import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Button, ComboBox, Dropdown, Label } from '@trussworks/react-uswds';

import FieldGroup from 'components/shared/FieldGroup';
import {
  CreateSystemIntakeContact,
  GetSystemIntakeContactsQuery
} from 'queries/SystemIntakeContactsQueries';
import { GetSystemIntakeContacts } from 'queries/types/GetSystemIntakeContacts';
import { CedarContactProps } from 'types/systemIntake';

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

type ContactProps = {
  euaUserId: string | null;
  commonName: string | null;
  role: string | null;
  component: string | null;
  // email: string | null;
};

const Contact = ({ euaUserId, commonName, role, component }: ContactProps) => {
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
        <Button type="button" unstyled className="text-error margin-left-2">
          Delete Contact
        </Button>
      </div>
    </li>
  );
};

const initialContact = {
  euaUserId: '',
  commonName: '',
  // email: '',
  component: '',
  role: ''
};

export default function AdditionalContacts({
  systemIntakeId,
  contacts
}: {
  systemIntakeId: string;
  contacts: CedarContactProps[];
  // contacts: { label: string; value: string }[];
}) {
  const [createFormActive, setCreateFormActive] = useState(true);
  const [newContact, setNewContact] = useState<ContactProps>(initialContact);

  const { data, loading } = useQuery<GetSystemIntakeContacts>(
    GetSystemIntakeContactsQuery,
    {
      variables: { id: systemIntakeId }
    }
  );

  const [mutate] = useMutation(CreateSystemIntakeContact);

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

  const addNewContact = () => {
    if (newContact.euaUserId) {
      const { euaUserId, component, role } = newContact;
      mutate({
        variables: {
          input: {
            euaUserId,
            component,
            role,
            systemIntakeId
          }
        }
      });
    }
  };

  const resetNewContact = () => {
    setNewContact(initialContact);
    setCreateFormActive(false);
  };

  const additionalContacts =
    data?.systemIntakeContacts?.systemIntakeContacts || null;
  console.log(additionalContacts);

  return (
    <div className="system-intake-contacts">
      {/* {additionalContacts && (
        <>
          <h4>Additional contacts</h4>
          <ul className="system-intake-contacts__contacts-list usa-list--unstyled">
            {additionalContacts.map(contact => (
              <Contact key={contact.euaUserId} {...contact} />
            ))}
          </ul>
        </>
      )} */}
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
            <Button type="button" onClick={() => addNewContact()}>
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
