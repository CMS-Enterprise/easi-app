import { useCallback, useMemo } from 'react';
import { useQuery } from '@apollo/client';

import GetCedarContactsQuery from 'queries/GetCedarContactsQuery';
import { GetCedarContacts } from 'queries/types/GetCedarContacts';
import { CedarContactProps } from 'types/systemIntake';

export default function useCedarContacts(): {
  contacts: CedarContactProps[] | null;
  getContactByEua: (euaUserId: string) => CedarContactProps | null;
} {
  const { data } = useQuery<GetCedarContacts>(GetCedarContactsQuery, {
    variables: { commonName: '' }
  });
  const contacts = useMemo(() => data?.cedarPersonsByCommonName || null, [
    data?.cedarPersonsByCommonName
  ]);
  const getContactByEua = useCallback(
    (euaUserId: string) => {
      return (
        (contacts || []).find(contact => contact.euaUserId === euaUserId) ??
        null
      );
    },
    [contacts]
  );
  return { contacts, getContactByEua };
}
