import { useMemo } from 'react';
import { ApolloQueryResult, useMutation, useQuery } from '@apollo/client';

import { initialContactsObject } from 'constants/systemIntake';
import {
  CreateSystemIntakeContact,
  DeleteSystemIntakeContact,
  GetSystemIntakeContactsQuery,
  UpdateSystemIntakeContact
} from 'queries/SystemIntakeContactsQueries';
import { GetSystemIntakeContacts } from 'queries/types/GetSystemIntakeContacts';
import {
  CreateSystemIntakeContactInput,
  DeleteSystemIntakeContactInput,
  UpdateSystemIntakeContactInput
} from 'types/graphql-global-types';
import {
  FormattedContacts,
  SystemIntakeContactProps,
  UseSystemIntakeContactsType
} from 'types/systemIntake';

import useSystemIntake from './useSystemIntake';

const rolesMap = {
  'Business Owner': 'businessOwner',
  'Product Manager': 'productManager',
  ISSO: 'isso'
} as const;
type Role = keyof typeof rolesMap;

/** Custom hook for creating, updating, and deleting system intake contacts */
function useSystemIntakeContacts(
  systemIntakeId: string
): UseSystemIntakeContactsType {
  // GQL query to get intake contacts
  const { data, refetch } = useQuery<GetSystemIntakeContacts>(
    GetSystemIntakeContactsQuery,
    {
      fetchPolicy: 'cache-first',
      variables: { id: systemIntakeId }
    }
  );

  // Get system intake from Apollo cache
  const { systemIntake } = useSystemIntake(systemIntakeId);

  /** Formatted system intake contacts object */
  const contacts = useMemo<FormattedContacts | null>(() => {
    // Get systemIntakeContacts
    const systemIntakeContacts = data?.systemIntakeContacts
      ?.systemIntakeContacts as SystemIntakeContactProps[];

    // Return null if no systemIntakeContacts
    if (!systemIntakeContacts || !systemIntake) return null;

    // Merge initial contacts object with possible legacy data from system intake
    const mergedContactsObject = {
      ...initialContactsObject,
      businessOwner: {
        ...initialContactsObject.businessOwner,
        commonName: systemIntake.businessOwner.name || '',
        component: systemIntake.businessOwner.component || ''
      },
      productManager: {
        ...initialContactsObject.productManager,
        commonName: systemIntake.productManager.name || '',
        component: systemIntake.productManager.component || ''
      },
      isso: {
        ...initialContactsObject.isso,
        commonName: systemIntake.isso.name || ''
      }
    };

    // Return formatted contacts
    return systemIntakeContacts.reduce<FormattedContacts>(
      (contactsObject, contact) => {
        if (rolesMap[contact.role as Role]) {
          return {
            ...contactsObject,
            [rolesMap[contact.role as Role]]: contact
          };
        }
        return {
          ...contactsObject,
          additionalContacts: [...contactsObject.additionalContacts, contact]
        };
      },
      mergedContactsObject
    );
  }, [data?.systemIntakeContacts?.systemIntakeContacts, systemIntake]);

  const [
    createSystemIntakeContact
  ] = useMutation<CreateSystemIntakeContactInput>(CreateSystemIntakeContact);
  const [
    updateSystemIntakeContact
  ] = useMutation<UpdateSystemIntakeContactInput>(UpdateSystemIntakeContact);
  const [
    deleteSystemIntakeContact
  ] = useMutation<DeleteSystemIntakeContactInput>(DeleteSystemIntakeContact);

  /** Create system intake contact in database */
  const createContact = async (contact: SystemIntakeContactProps) => {
    const { euaUserId, component, role } = contact;
    return createSystemIntakeContact({
      variables: {
        input: {
          euaUserId: euaUserId.toUpperCase(),
          component,
          role,
          systemIntakeId
        }
      }
    })
      .then(refetch)
      .then((response: ApolloQueryResult<GetSystemIntakeContacts>) =>
        response?.data?.systemIntakeContacts?.systemIntakeContacts.find(
          obj => obj.role === role
        )
      );
  };

  /** Update system intake contact in database */
  const updateContact = async (contact: SystemIntakeContactProps) => {
    const { id, euaUserId, component, role } = contact;
    return updateSystemIntakeContact({
      variables: {
        input: {
          id,
          euaUserId: euaUserId.toUpperCase(),
          component,
          role,
          systemIntakeId
        }
      }
    })
      .then(refetch)
      .then(
        (response: ApolloQueryResult<GetSystemIntakeContacts>) =>
          response?.data?.systemIntakeContacts?.systemIntakeContacts
      );
  };

  /** Delete system intake contact from database */
  const deleteContact = async (id: string) => {
    return deleteSystemIntakeContact({
      variables: {
        input: {
          id
        }
      }
    })
      .then(refetch)
      .then(
        (response: ApolloQueryResult<GetSystemIntakeContacts>) =>
          response?.data?.systemIntakeContacts?.systemIntakeContacts
      );
  };

  return {
    contacts,
    createContact,
    updateContact,
    deleteContact
  };
}

export default useSystemIntakeContacts;
