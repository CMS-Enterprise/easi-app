import React, { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { ComboBox } from '@trussworks/react-uswds';

import GetCedarContactsQuery from 'queries/GetCedarContactsQuery';
import { GetCedarContacts } from 'queries/types/GetCedarContacts';
import { CedarContactProps } from 'types/systemIntake';

import { getContactByEUA } from './utilities';

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
  const { data, loading } = useQuery<GetCedarContacts>(GetCedarContactsQuery, {
    variables: { commonName: '' }
  });

  const contacts = useMemo(() => data?.cedarPersonsByCommonName || [], [
    data?.cedarPersonsByCommonName
  ]);

  const contactOptions = useMemo(() => {
    return (data?.cedarPersonsByCommonName || []).map(
      (contact: CedarContactProps) => ({
        label: contact.commonName || '',
        value: contact.euaUserId || ''
      })
    );
  }, [data?.cedarPersonsByCommonName]);

  if (loading) return null;

  return (
    <ComboBox
      className={className}
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
        const contact = euaUserId ? getContactByEUA(contacts, euaUserId) : null;
        onChange(contact);
      }}
      defaultValue={defaultValue}
      disabled={disabled}
    />
  );
}
