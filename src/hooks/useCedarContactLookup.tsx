import { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';

import GetCedarContactsQuery from 'queries/GetCedarContactsQuery';
import { GetCedarContacts } from 'queries/types/GetCedarContacts';
import { CedarContactProps } from 'types/systemIntake';

function useCedarContactLookup(): [
  CedarContactProps[],
  (commonName: string) => void
];

function useCedarContactLookup(
  query: string,
  euaUserId: string
): CedarContactProps | undefined;

function useCedarContactLookup(
  query?: string,
  euaUserId?: string
):
  | [CedarContactProps[], (commonName: string) => void]
  | CedarContactProps
  | undefined {
  const { data, refetch } = useQuery<GetCedarContacts>(GetCedarContactsQuery, {
    variables: { commonName: query },
    skip: !query
  });
  const [contacts, setContacts] = useState<CedarContactProps[]>(
    data?.cedarPersonsByCommonName || []
  );

  const contactByEuaUserId = useMemo(() => {
    return data?.cedarPersonsByCommonName.find(
      contact => contact.euaUserId === euaUserId
    );
  }, [data?.cedarPersonsByCommonName, euaUserId]);

  const queryCedarContacts = (commonName: string) => {
    if (commonName.length > 1) {
      refetch({ commonName }).then(response => {
        setContacts(
          sortCedarContacts(
            response?.data?.cedarPersonsByCommonName,
            commonName
          )
        );
      });
    }
  };

  return euaUserId ? contactByEuaUserId : [contacts, queryCedarContacts];
}

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
