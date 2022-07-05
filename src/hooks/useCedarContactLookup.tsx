import { useEffect, useMemo, useState } from 'react';
import { useApolloClient } from '@apollo/client';

import GetCedarContactsQuery from 'queries/GetCedarContactsQuery';
import { CedarContactProps } from 'types/systemIntake';

function useCedarContactLookup(
  query: string
): { [id: string]: CedarContactProps };

// eslint-disable-next-line no-redeclare
function useCedarContactLookup(
  query: string,
  euaUserId: string
): CedarContactProps | undefined;

// eslint-disable-next-line no-redeclare
function useCedarContactLookup(
  query: string,
  euaUserId?: string
): { [id: string]: CedarContactProps } | CedarContactProps | undefined {
  const client = useApolloClient();
  const [cedarContacts, setCedarContacts] = useState<CedarContactProps[]>([]);
  const contactByEuaUserId = useMemo(() => {
    return cedarContacts.find(contact => contact.euaUserId === euaUserId);
  }, [euaUserId, cedarContacts]);

  useEffect(() => {
    fetchCedarContacts(client, query).then((contacts: CedarContactProps[]) => {
      setCedarContacts(contacts);
    });
  }, [query, client]);

  return euaUserId ? contactByEuaUserId : formatCedarContacts(cedarContacts);
}

// GQL CEDAR API fetch of users based on first/last name text search
const fetchCedarContacts = (client: any, value: string) => {
  return client
    .query({
      query: GetCedarContactsQuery,
      variables: { commonName: value }
    })
    .then((result: any) => {
      return result.data.cedarPersonsByCommonName;
    })
    .catch((err: any) => {
      return [];
    });
};

// Formatting of user obj to reference when selecting user from dropdown
const formatCedarContacts = (contacts: CedarContactProps[]) => {
  const contactObj: { [id: string]: CedarContactProps } = {};

  contacts.forEach((contact: CedarContactProps) => {
    contactObj[`${contact.commonName}, ${contact.euaUserId}`] = contact;
  });

  return contactObj;
};

export default useCedarContactLookup;
