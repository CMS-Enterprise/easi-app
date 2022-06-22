import React, { useMemo } from 'react';
import { ComboBox } from '@trussworks/react-uswds';
import classNames from 'classnames';

import useCedarContacts from 'hooks/useCedarContacts';
import { CedarContactProps } from 'types/systemIntake';

type CedarContactSelectProps = {
  className?: string;
  id: string;
  name: string;
  ariaDescribedBy?: string;
  defaultValue?: string;
  onChange: (contact: CedarContactProps | null) => void;
  disabled?: boolean;
};

export default function CedarContactSelect({
  className,
  id,
  name,
  ariaDescribedBy,
  defaultValue,
  onChange,
  disabled
}: CedarContactSelectProps) {
  const { contacts, getContactByEua } = useCedarContacts();

  const contactOptions = useMemo(() => {
    return (contacts || []).map((contact: CedarContactProps) => ({
      label: contact.commonName || '',
      value: contact.euaUserId || ''
    }));
  }, [contacts]);

  return (
    <ComboBox
      className={classNames('cedarContactSelect', className)}
      id={id}
      name={name}
      inputProps={{
        id,
        name,
        'aria-describedby': ariaDescribedBy
      }}
      options={contactOptions}
      onChange={euaUserId => {
        // Lookup user object by eua id
        const contact = euaUserId ? getContactByEua(euaUserId) : null;
        onChange(contact);
      }}
      defaultValue={defaultValue}
      disabled={disabled}
    />
  );
}
