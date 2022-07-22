import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxPopover
} from '@reach/combobox';
import classNames from 'classnames';

import useCedarContactLookup from 'hooks/useCedarContactLookup';
import { CedarContactProps } from 'types/systemIntake';

import '@reach/combobox/styles.css';
import './index.scss';

type CedarContactSelectProps = {
  className?: string;
  id: string;
  name: string;
  ariaDescribedBy?: string;
  value?: CedarContactProps;
  onChange: (contact: CedarContactProps | null) => void;
  disabled?: boolean;
};

export default function CedarContactSelect({
  className,
  id,
  name,
  ariaDescribedBy,
  value,
  onChange,
  disabled
}: CedarContactSelectProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [contacts, getCedarContacts] = useCedarContactLookup();
  const formattedContact = value
    ? `${value.commonName}, ${value.euaUserId}`
    : '';

  const selectedContact = useRef(value?.euaUserId);

  const updateContact = (contact: CedarContactProps) => {
    onChange(contact);
    selectedContact.current = contact.euaUserId;
    setSearchTerm(null);
  };

  useEffect(() => {
    if (searchTerm) getCedarContacts(searchTerm);
  }, [searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (value && value?.euaUserId !== selectedContact.current) {
      updateContact(value);
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Combobox
      id={id}
      className={classNames('cedar-contact-select', className)}
      aria-describedby={ariaDescribedBy}
      aria-disabled={disabled}
      aria-label="Cedar-Users"
      onSelect={(item: string) => {
        const contact = contacts.find(obj => obj.euaUserId === item.slice(-4));
        if (contact) updateContact(contact);
      }}
    >
      <ComboboxInput
        name={name}
        disabled={disabled}
        className="usa-select"
        selectOnClick
        value={searchTerm ?? formattedContact}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setSearchTerm(e.target.value);
        }}
      />
      {searchTerm && searchTerm.length > 1 && (
        <ComboboxPopover>
          {contacts.length > 0 ? (
            <ComboboxList>
              {contacts.map((contact, index) => (
                <ComboboxOption
                  index={index}
                  key={contact.euaUserId}
                  value={`${contact.commonName}, ${contact.euaUserId}`}
                />
              ))}
            </ComboboxList>
          ) : (
            <span className="display-block margin-1">{t('No results')}</span>
          )}
        </ComboboxPopover>
      )}
    </Combobox>
  );
}
