import { useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client';

import GetCedarContactsQuery from 'queries/GetCedarContactsQuery';
import { CedarContactProps } from 'types/systemIntake';

// Custom hook for live fetching users based on text input
function useCedarContactLookup(query: string) {
  const client = useApolloClient();
  const [cedarContacts, setCedarContacts] = useState<CedarContactProps[]>([]);

  useEffect(() => {
    fetchCedarContacts(client, query).then((contacts: CedarContactProps[]) => {
      setCedarContacts(contacts);
    });
  }, [query, client]);

  return formatCedarContacts(cedarContacts);
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
