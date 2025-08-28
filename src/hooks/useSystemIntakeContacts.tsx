import { useCallback, useMemo } from 'react';
import { FetchResult } from '@apollo/client';
import {
  CreateSystemIntakeContactMutation,
  SystemIntakeContactFragment,
  UpdateSystemIntakeContactMutation,
  useCreateSystemIntakeContactMutation,
  useDeleteSystemIntakeContactMutation,
  useGetSystemIntakeContactsQuery,
  useGetSystemIntakeQuery,
  useUpdateSystemIntakeContactMutation
} from 'gql/generated/graphql';

import { initialContactsObject } from 'constants/systemIntake';
import {
  FormattedContacts,
  SystemIntakeContactProps,
  UseSystemIntakeContactsType
} from 'types/systemIntake';

const rolesMap = {
  Requester: 'requester',
  'Business Owner': 'businessOwner',
  'Product Manager': 'productManager'
} as const;
type Role = keyof typeof rolesMap;

/**
 * Custom hook for creating, updating, and deleting system intake contacts
 * */
function useSystemIntakeContacts(
  systemIntakeId: string
): UseSystemIntakeContactsType {
  // GQL query to get intake contacts
  const { data, loading: contactsLoading } = useGetSystemIntakeContactsQuery({
    variables: { id: systemIntakeId }
  });

  /** Array of system intake contacts */
  const { systemIntakeContacts } = data || {};

  /** System intake query results */
  const intakeQuery = useGetSystemIntakeQuery({
    variables: {
      id: systemIntakeId
    }
  });
  const { systemIntake } = intakeQuery?.data || {};

  /** Initial contacts object merged with possible legacy data from system intake */
  const legacyContacts = useMemo<FormattedContacts>(() => {
    if (!systemIntake) return initialContactsObject;

    return {
      ...initialContactsObject,
      requester: {
        ...initialContactsObject.requester,
        euaUserId: systemIntake.euaUserId ?? null,
        commonName: systemIntake.requester?.name,
        component: systemIntake.requester?.component || '',
        email: systemIntake.requester?.email || '',
        systemIntakeId
      },
      businessOwner: {
        ...initialContactsObject.businessOwner,
        commonName: systemIntake.businessOwner?.name || '',
        component: systemIntake.businessOwner?.component || '',
        systemIntakeId
      },
      productManager: {
        ...initialContactsObject.productManager,
        commonName: systemIntake.productManager?.name || '',
        component: systemIntake.productManager?.component || '',
        systemIntakeId
      }
    };
  }, [systemIntake, systemIntakeId]);

  /** Format system intake contacts array */
  const formatContacts = useCallback(
    (
      contactsArray: SystemIntakeContactFragment[] | undefined
    ): FormattedContacts => {
      // Return empty values if no systemIntakeContacts
      if (!contactsArray) return legacyContacts;

      const test = contactsArray.reduce<FormattedContacts>(
        (contactsObject, contact) => {
          const role = contact.roles[0];
          // If contact is primary role, add to object
          if (rolesMap[role as Role]) {
            return {
              ...contactsObject,
              [rolesMap[role as Role]]: { ...contact, roles: [role] }
            };
          }
          // If contact is additional contacts, add to additional contacts array
          return {
            ...contactsObject,
            additionalContacts: [
              ...contactsObject.additionalContacts,
              {
                ...contact,
                roles: [role],
                commonName: contact.userAccount?.commonName || '',
                email: contact.userAccount?.email || '',
                systemIntakeId
              }
            ]
          };
        },
        legacyContacts
      );

      return test;
    },
    [legacyContacts, systemIntakeId]
  );

  /** Formatted system intake contacts object */
  const contacts = useMemo<FormattedContacts>(
    () => formatContacts(systemIntakeContacts),
    [systemIntakeContacts, formatContacts]
  );

  const [createSystemIntakeContact] = useCreateSystemIntakeContactMutation({
    refetchQueries: ['GetSystemIntakeContacts'],
    awaitRefetchQueries: true
  });

  const [updateSystemIntakeContact] = useUpdateSystemIntakeContactMutation({
    refetchQueries: ['GetSystemIntakeContacts'],
    awaitRefetchQueries: true
  });

  const [deleteSystemIntakeContact] = useDeleteSystemIntakeContactMutation({
    refetchQueries: ['GetSystemIntakeContacts'],
    awaitRefetchQueries: true
  });

  /**
   * Create system intake contact in database
   * */
  const createContact = async (
    /** Contact field values submitted from form */
    contact: SystemIntakeContactProps
  ): Promise<SystemIntakeContactProps> => {
    const { euaUserId, component, roles } = contact;
    return (
      // Create system intake contact
      createSystemIntakeContact({
        variables: {
          input: {
            euaUserId: euaUserId?.toUpperCase() || '',
            component,
            roles,
            systemIntakeId,
            // TODO: get actual isRequester value from contact
            isRequester: false
          }
        }
      })
        .then((response: FetchResult<CreateSystemIntakeContactMutation>) => {
          const {
            /** Contact data returned from mutation */
            systemIntakeContact
          } = response.data?.createSystemIntakeContact || {};

          const { euaUserId: euaUserIdUpdate, ...contactUpdate } = contact;

          /** Merged contact data with mutation response */
          const mergedContact: SystemIntakeContactProps = {
            euaUserId: euaUserIdUpdate || '',
            ...contactUpdate,
            ...systemIntakeContact,
            id: systemIntakeContact?.id || ''
          };

          // Return merged contact data
          return mergedContact;
        })
        // If error, return submitted data
        .catch(() => contact)
    );
  };

  /**
   * Update system intake contact in database
   * */
  const updateContact = async (
    /** Contact field values submitted from form */
    contact: SystemIntakeContactProps
  ): Promise<SystemIntakeContactProps> => {
    const { id, component, euaUserId, roles } = contact;

    /** Updated contact response from mutation */
    return (
      updateSystemIntakeContact({
        variables: {
          input: {
            id: id || '',
            euaUserId: euaUserId?.toUpperCase() || '',
            component,
            roles,
            systemIntakeId,
            // TODO: get actual isRequester value from contact
            isRequester: false
          }
        }
      })
        .then((response: FetchResult<UpdateSystemIntakeContactMutation>) => {
          const {
            /** Contact data returned from mutation */
            systemIntakeContact
          } = response.data?.updateSystemIntakeContact || {};

          const { euaUserId: euaUserIdUpdate, ...contactUpdate } = contact;

          /** Merged contact data with mutation response */
          const mergedContact: SystemIntakeContactProps = {
            euaUserId: euaUserIdUpdate || '',
            ...contactUpdate,
            ...systemIntakeContact,
            id: contact?.id || ''
          };

          // Return merged contact data
          return mergedContact;
        })
        // If error, return submitted data
        .catch(() => contact)
    );
  };

  /**
   * Delete system intake contact from database
   * */
  const deleteContact = async (
    /** ID of contact to delete */
    id: string
  ): Promise<FormattedContacts> => {
    return (
      // Delete contact
      deleteSystemIntakeContact({
        variables: {
          input: {
            id
          }
        }
      })
        .then(() => contacts)
        .catch(() => contacts)
    );
  };

  return {
    contacts: {
      data: contacts,
      loading: contactsLoading || intakeQuery.loading
    },
    createContact,
    updateContact,
    deleteContact
  };
}

export default useSystemIntakeContacts;
