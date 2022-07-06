import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxPopover
} from '@reach/combobox';

import useCedarContactLookup from 'hooks/useCedarContactLookup';
import { CedarContactProps } from 'types/systemIntake';

import '@reach/combobox/styles.css';

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
  const contacts = useCedarContactLookup(searchTerm || '');
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
    if (value && value?.euaUserId !== selectedContact.current) {
      updateContact(value);
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Combobox
      id={id}
      className={className}
      aria-describedby={ariaDescribedBy}
      aria-disabled={disabled}
      aria-label="Cedar-Users"
      onSelect={item => updateContact(contacts[item])}
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
      {searchTerm && (
        <ComboboxPopover>
          {Object.values(contacts).length > 0 ? (
            <ComboboxList>
              {Object.values(contacts).map(contact => (
                <ComboboxOption
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
