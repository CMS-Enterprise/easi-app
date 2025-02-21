import { useCallback, useMemo } from 'react';
import { FetchResult, useQuery } from '@apollo/client';
import {
  AugmentedSystemIntakeContact,
  CreateSystemIntakeContactMutation,
  UpdateSystemIntakeContactMutation,
  useCreateSystemIntakeContactMutation,
  useDeleteSystemIntakeContactMutation,
  useGetSystemIntakeContactsQuery,
  useUpdateSystemIntakeContactMutation
} from 'gql/generated/graphql';
import GetSystemIntakeQuery from 'gql/legacyGQL/GetSystemIntakeQuery';
import {
  GetSystemIntake,
  GetSystemIntakeVariables
} from 'gql/legacyGQL/types/GetSystemIntake';

import { initialContactsObject } from 'constants/systemIntake';
import {
  FormattedContacts,
  SystemIntakeContactProps,
  UseSystemIntakeContactsType
} from 'types/systemIntake';

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
  const { data, loading: contactsLoading } = useGetSystemIntakeContactsQuery({
    variables: { id: systemIntakeId }
  });

  /** Array of system intake contacts */
  const systemIntakeContacts: AugmentedSystemIntakeContact[] | undefined =
    data?.systemIntakeContacts?.systemIntakeContacts;

  /** System intake query results */
  const intakeQuery = useQuery<GetSystemIntake, GetSystemIntakeVariables>(
    GetSystemIntakeQuery,
    {
      variables: {
        id: systemIntakeId
      }
    }
  );
  const { systemIntake } = intakeQuery?.data || {};

  /** Initial contacts object merged with possible legacy data from system intake */
  const legacyContacts = useMemo<FormattedContacts>(() => {
    if (!systemIntake) return initialContactsObject;

    return {
      ...initialContactsObject,
      requester: {
        ...initialContactsObject.requester,
        euaUserId: systemIntake.euaUserId,
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
      },
      isso: {
        ...initialContactsObject.isso,
        commonName: systemIntake.isso?.name || '',
        systemIntakeId
      }
    };
  }, [systemIntake, systemIntakeId]);

  /** Format system intake contacts array */
  const formatContacts = useCallback(
    (
      contactsArray: AugmentedSystemIntakeContact[] | undefined
    ): FormattedContacts => {
      // Return empty values if no systemIntakeContacts
      if (!contactsArray) return legacyContacts;

      return contactsArray.reduce<FormattedContacts>(
        (contactsObject, contact) => {
          // If contact is primary role, add to object
          if (rolesMap[contact.role as Role]) {
            return {
              ...contactsObject,
              [rolesMap[contact.role as Role]]: contact
            };
          }
          // If contact is additional contacts, add to additional contacts array
          return {
            ...contactsObject,
            additionalContacts: [
              ...contactsObject.additionalContacts,
              {
                ...contact,
                commonName: contact.commonName || '',
                email: contact.email || '',
                systemIntakeId
              }
            ]
          };
        },
        legacyContacts
      );
    },
    [legacyContacts, systemIntakeId]
  );

  /** Formatted system intake contacts object */
  const contacts = useMemo<FormattedContacts>(
    () => formatContacts(systemIntakeContacts),
    [systemIntakeContacts, formatContacts]
  );

  const [createSystemIntakeContact] = useCreateSystemIntakeContactMutation({
    refetchQueries: ['GetSystemIntakeContactsQuery'],
    awaitRefetchQueries: true
  });

  const [updateSystemIntakeContact] = useUpdateSystemIntakeContactMutation({
    refetchQueries: ['GetSystemIntakeContactsQuery'],
    awaitRefetchQueries: true
  });

  const [deleteSystemIntakeContact] = useDeleteSystemIntakeContactMutation({
    refetchQueries: ['GetSystemIntakeContactsQuery'],
    awaitRefetchQueries: true
  });

  /**
   * Create system intake contact in database
   * */
  const createContact = async (
    /** Contact field values submitted from form */
    contact: SystemIntakeContactProps
  ): Promise<AugmentedSystemIntakeContact> => {
    const { euaUserId, component, role } = contact;
    return (
      // Create system intake contact
      createSystemIntakeContact({
        variables: {
          input: {
            euaUserId: euaUserId?.toUpperCase() || '',
            component,
            role,
            systemIntakeId
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
          const mergedContact: AugmentedSystemIntakeContact = {
            euaUserId: euaUserIdUpdate || '',
            ...contactUpdate,
            ...systemIntakeContact,
            id: systemIntakeContact?.id || '',
            __typename: 'AugmentedSystemIntakeContact'
          };

          // Return merged contact data
          return mergedContact;
        })
        // If error, return submitted data
        .catch(() => contact as AugmentedSystemIntakeContact)
    );
  };

  /**
   * Update system intake contact in database
   * */
  const updateContact = async (
    /** Contact field values submitted from form */
    contact: SystemIntakeContactProps
  ): Promise<AugmentedSystemIntakeContact> => {
    const { id, component, euaUserId, role } = contact;

    /** Updated contact response from mutation */
    return (
      updateSystemIntakeContact({
        variables: {
          input: {
            id: id || '',
            euaUserId: euaUserId?.toUpperCase() || '',
            component,
            role,
            systemIntakeId
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
          const mergedContact: AugmentedSystemIntakeContact = {
            euaUserId: euaUserIdUpdate || '',
            ...contactUpdate,
            ...systemIntakeContact,
            id: contact?.id || '',
            __typename: 'AugmentedSystemIntakeContact'
          };

          // Return merged contact data
          return mergedContact;
        })
        // If error, return submitted data
        .catch(() => contact as AugmentedSystemIntakeContact)
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
