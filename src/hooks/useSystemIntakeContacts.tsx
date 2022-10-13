import { useMemo } from 'react';
import { ApolloQueryResult, useMutation, useQuery } from '@apollo/client';

import { initialContactsObject } from 'constants/systemIntake';
import {
  CreateSystemIntakeContact,
  DeleteSystemIntakeContact,
  GetSystemIntakeContactsQuery,
  UpdateSystemIntakeContact
} from 'queries/SystemIntakeContactsQueries';
import {
  GetSystemIntakeContacts,
  GetSystemIntakeContacts_systemIntakeContacts_systemIntakeContacts as AugmentedSystemIntakeContact
} from 'queries/types/GetSystemIntakeContacts';
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
  Requester: 'requester',
  'Business Owner': 'businessOwner',
  'Product Manager': 'productManager',
  ISSO: 'isso'
} as const;
type Role = keyof typeof rolesMap;

/**
 * Custom hook for creating, updating, and deleting system intake contacts
 * */
function useSystemIntakeContacts(
  systemIntakeId: string
): UseSystemIntakeContactsType {
  // GQL query to get intake contacts
  const { data, refetch, loading } = useQuery<GetSystemIntakeContacts>(
    GetSystemIntakeContactsQuery,
    {
      fetchPolicy: 'cache-first',
      variables: { id: systemIntakeId }
    }
  );

  // Get system intake from Apollo cache
  const { systemIntake } = useSystemIntake(systemIntakeId);

  /**
   * Formatted system intake contacts object
   * */
  const contacts = useMemo<FormattedContacts>(() => {
    /** Array of system intake contacts */
    const systemIntakeContacts = data?.systemIntakeContacts
      ?.systemIntakeContacts as SystemIntakeContactProps[];

    // Return null if no systemIntakeContacts
    if (!systemIntakeContacts || !systemIntake) return initialContactsObject;

    /**
     * Merge initial contacts object with possible legacy data from system intake
     */
    const mergedContactsObject = {
      ...initialContactsObject,
      requester: {
        ...initialContactsObject.requester,
        euaUserId: systemIntake.euaUserId,
        commonName: systemIntake.requester.name,
        component: systemIntake.requester.component || '',
        email: systemIntake.requester.email || '',
        systemIntakeId
      },
      businessOwner: {
        ...initialContactsObject.businessOwner,
        commonName: systemIntake.businessOwner.name || '',
        component: systemIntake.businessOwner.component || '',
        systemIntakeId
      },
      productManager: {
        ...initialContactsObject.productManager,
        commonName: systemIntake.productManager.name || '',
        component: systemIntake.productManager.component || '',
        systemIntakeId
      },
      isso: {
        ...initialContactsObject.isso,
        commonName: systemIntake.isso.name || '',
        systemIntakeId
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
          additionalContacts: [
            ...contactsObject.additionalContacts,
            { ...contact, systemIntakeId }
          ]
        };
      },
      mergedContactsObject
    );
  }, [
    data?.systemIntakeContacts?.systemIntakeContacts,
    systemIntake,
    systemIntakeId
  ]);

  const [
    createSystemIntakeContact
  ] = useMutation<CreateSystemIntakeContactInput>(CreateSystemIntakeContact);
  const [
    updateSystemIntakeContact
  ] = useMutation<UpdateSystemIntakeContactInput>(UpdateSystemIntakeContact);
  const [
    deleteSystemIntakeContact
  ] = useMutation<DeleteSystemIntakeContactInput>(DeleteSystemIntakeContact);

  /**
   * Create system intake contact in database
   * */
  const createContact = async (contact: SystemIntakeContactProps) => {
    const { euaUserId, component, role } = contact;
    return (
      createSystemIntakeContact({
        variables: {
          input: {
            euaUserId: euaUserId.toUpperCase(),
            component,
            role,
            systemIntakeId
          }
        }
      })
        // Refetch contacts
        .then(refetch)
        // Return new contact
        .then((response: ApolloQueryResult<GetSystemIntakeContacts>) =>
          response?.data?.systemIntakeContacts?.systemIntakeContacts.find(
            obj => obj.role === role
          )
        )
        // If error, return initial contact
        .catch(() => contact as AugmentedSystemIntakeContact)
    );
  };

  /**
   * Update system intake contact in database
   * */
  const updateContact = async (contact: SystemIntakeContactProps) => {
    const { id, euaUserId, component, role } = contact;
    return (
      updateSystemIntakeContact({
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
        // Refetch contacts
        .then(refetch)
        // Return updated contacts
        .then(
          (response: ApolloQueryResult<GetSystemIntakeContacts>) =>
            response?.data?.systemIntakeContacts?.systemIntakeContacts
        )
        // If error, return existing contacts
        .catch(() => data?.systemIntakeContacts?.systemIntakeContacts)
    );
  };

  /**
   * Delete system intake contact from database
   * */
  const deleteContact = async (id: string) => {
    return (
      deleteSystemIntakeContact({
        variables: {
          input: {
            id
          }
        }
      })
        // Refetch contacts
        .then(refetch)
        // Return updated contacts
        .then(
          (response: ApolloQueryResult<GetSystemIntakeContacts>) =>
            response?.data?.systemIntakeContacts?.systemIntakeContacts
        )
        // If error, return existing contacts
        .catch(() => data?.systemIntakeContacts?.systemIntakeContacts)
    );
  };

  return {
    contacts: { data: contacts, loading },
    createContact,
    updateContact,
    deleteContact
  };
}

export default useSystemIntakeContacts;
