import { useMemo, useState } from 'react';
import { useGetOktaUsersQuery } from 'gql/generated/graphql';

import { OktaUserProps } from 'types/systemIntake';

function useOktaUserLookup(query?: string | null): {
  contacts: OktaUserProps[];
  queryOktaUsers: (searchTerm: string) => void;
  loading: boolean;
};

function useOktaUserLookup(
  query: string,
  euaUserId: string
): OktaUserProps | undefined;

/**
 * Custom hook for retrieving contacts from Cedar by common name
 * */
function useOktaUserLookup(
  query?: string | null,
  euaUserId?: string
):
  | {
      contacts: OktaUserProps[];
      queryOktaUsers: (searchTerm: string) => void;
      loading: boolean;
    }
  | OktaUserProps
  | undefined {
  const [searchTerm, setSearchTerm] = useState<string | null | undefined>(
    query
  );

  const { data, previousData, loading } = useGetOktaUsersQuery({
    variables: { searchTerm: searchTerm || '' },
    skip: !query || query.length < 2
  });

  /**
   * Update search term if query is more than 2 characters long
   */
  const updateQuery = (nameQuery: string) => {
    if (nameQuery.length > 1) setSearchTerm(nameQuery);
  };

  /**
   * Sorted list of contacts from CEDAR
   * */
  const contacts = useMemo<OktaUserProps[]>(() => {
    // Prevent 'no results' message when loading
    if (loading) return previousData?.searchOktaUsers || [];
    // Sort and return contacts from query results
    return sortOktaUsers(data?.searchOktaUsers || [], searchTerm || '');
  }, [searchTerm, previousData, data?.searchOktaUsers, loading]);

  /**
   * CEDAR lookup by EUA user id
   * */
  const contactByEuaUserId = useMemo<OktaUserProps | undefined>(() => {
    return data?.searchOktaUsers.find(
      contact => contact.euaUserId === euaUserId
    );
  }, [data?.searchOktaUsers, euaUserId]);

  return euaUserId
    ? contactByEuaUserId
    : { contacts, queryOktaUsers: updateQuery, loading };
}

/**
 * Sort contacts based on query
 * */
const sortOktaUsers = (
  contacts: OktaUserProps[],
  query: string
): OktaUserProps[] => {
  return [...contacts].sort((a, b) => {
    const result =
      a.commonName.toLowerCase().search(query) -
      b.commonName.toLowerCase().search(query);
    if (result > 0) return 1;
    if (result < 0) return -1;
    return 0;
  });
};

export default useOktaUserLookup;
