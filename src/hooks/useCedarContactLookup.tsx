import { useEffect, useMemo, useState } from 'react';
import { useApolloClient } from '@apollo/client';

import GetCedarContactsQuery from 'queries/GetCedarContactsQuery';
import { CedarContactProps } from 'types/systemIntake';

function useCedarContactLookup(query: string): CedarContactProps[];

function useCedarContactLookup(
  query: string,
  euaUserId: string
): CedarContactProps | undefined;

function useCedarContactLookup(
  query: string,
  euaUserId?: string
): CedarContactProps[] | CedarContactProps | undefined {
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

  return euaUserId ? contactByEuaUserId : cedarContacts;
}

// GQL CEDAR API fetch of users based on first/last name text search
const fetchCedarContacts = (client: any, value: string) => {
  return client
    .query({
      query: GetCedarContactsQuery,
      variables: { commonName: value }
    })
    .then((result: any) => {
      return sortCedarContacts(result.data.cedarPersonsByCommonName, value);
    })
    .catch((err: any) => {
      return [];
    });
};

const sortCedarContacts = (contacts: CedarContactProps[], query: string) => {
  return [...contacts].sort((a, b) => {
    const result =
      a.commonName.toLowerCase().search(query) -
      b.commonName.toLowerCase().search(query);
    if (result > 0) return 1;
    if (result < 0) return -1;
    return 0;
  });
};

export default useCedarContactLookup;
