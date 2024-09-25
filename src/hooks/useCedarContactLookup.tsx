import { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';

import GetCedarContactsQuery from 'queries/GetCedarContactsQuery';
import { GetCedarContacts } from 'queries/types/GetCedarContacts';
import { CedarContactProps } from 'types/systemIntake';

function useCedarContactLookup(query?: string | null): {
  contacts: CedarContactProps[];
  queryCedarContacts: (commonName: string) => void;
  loading: boolean;
};

function useCedarContactLookup(
  query: string,
  euaUserId: string
): CedarContactProps | undefined;

/**
 * Custom hook for retrieving contacts from Cedar by common name
 * */
function useCedarContactLookup(
  query?: string | null,
  euaUserId?: string
):
  | {
      contacts: CedarContactProps[];
      queryCedarContacts: (commonName: string) => void;
      loading: boolean;
    }
  | CedarContactProps
  | undefined {
  const [searchTerm, setSearchTerm] = useState<string | null | undefined>(
    query
  );

  const { data, previousData, loading } = useQuery<GetCedarContacts>(
    GetCedarContactsQuery,
    {
      variables: { commonName: searchTerm },
      skip: !query || query.length < 2
    }
  );

  /**
   * Update search term if query is more than 2 characters long
   */
  const updateQuery = (nameQuery: string) => {
    if (nameQuery.length > 1) setSearchTerm(nameQuery);
  };

  /**
   * Sorted list of contacts from CEDAR
   * */
  const contacts = useMemo<CedarContactProps[]>(() => {
    // Prevent 'no results' message when loading
    if (loading) return previousData?.cedarPersonsByCommonName || [];
    // Sort and return contacts from query results
    return sortCedarContacts(
      data?.cedarPersonsByCommonName || [],
      searchTerm || ''
    );
  }, [searchTerm, previousData, data?.cedarPersonsByCommonName, loading]);

  /**
   * CEDAR lookup by EUA user id
   * */
  const contactByEuaUserId = useMemo<CedarContactProps | undefined>(() => {
    return data?.cedarPersonsByCommonName.find(
      contact => contact.euaUserId === euaUserId
    );
  }, [data?.cedarPersonsByCommonName, euaUserId]);

  return euaUserId
    ? contactByEuaUserId
    : { contacts, queryCedarContacts: updateQuery, loading };
}

/**
 * Sort contacts based on query
 * */
const sortCedarContacts = (
  contacts: CedarContactProps[],
  query: string
): CedarContactProps[] => {
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
