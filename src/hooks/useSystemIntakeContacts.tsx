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

  // Reformats contacts object for use in intake form
  const contacts = useMemo<FormattedContacts | null>(() => {
    // Get systemIntakeContacts
    const systemIntakeContacts: AugmentedSystemIntakeContact[] | undefined =
      data?.systemIntakeContacts?.systemIntakeContacts;

    // Return null if no systemIntakeContacts
    if (!systemIntakeContacts) return null;

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
      initialContactsObject
    );
  }, [data?.systemIntakeContacts?.systemIntakeContacts]);

  const [
    createSystemIntakeContact
  ] = useMutation<CreateSystemIntakeContactInput>(CreateSystemIntakeContact);
  const [
    updateSystemIntakeContact
  ] = useMutation<UpdateSystemIntakeContactInput>(UpdateSystemIntakeContact);
  const [
    deleteSystemIntakeContact
  ] = useMutation<DeleteSystemIntakeContactInput>(DeleteSystemIntakeContact);

  // Create system intake contact
  const createContact = async (contact: SystemIntakeContactProps) => {
    const { euaUserId, component, role } = contact;
    return createSystemIntakeContact({
      variables: {
        input: {
          euaUserId,
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

  // Update system intake contact
  const updateContact = async (contact: SystemIntakeContactProps) => {
    const { id, euaUserId, component, role } = contact;
    return updateSystemIntakeContact({
      variables: {
        input: {
          id,
          euaUserId,
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

  // Delete system intake contact
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

  return [contacts, { createContact, updateContact, deleteContact }];
}

export default useSystemIntakeContacts;
