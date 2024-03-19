import { useMemo } from 'react';
import { FetchResult, useMutation, useQuery } from '@apollo/client';

import { initialContactsObject } from 'constants/systemIntake';
import GetSystemIntakeQuery from 'queries/GetSystemIntakeQuery';
import {
  CreateSystemIntakeContact,
  DeleteSystemIntakeContact,
  GetSystemIntakeContactsQuery,
  UpdateSystemIntakeContact
} from 'queries/SystemIntakeContactsQueries';
import { CreateSystemIntakeContact as CreateSystemIntakeContactPayload } from 'queries/types/CreateSystemIntakeContact';
import { DeleteSystemIntakeContact as DeleteSystemIntakeContactPayload } from 'queries/types/DeleteSystemIntakeContact';
import {
  GetSystemIntake,
  GetSystemIntakeVariables
} from 'queries/types/GetSystemIntake';
import {
  GetSystemIntakeContactsQuery as GetSystemIntakeContactsQueryType,
  GetSystemIntakeContactsQuery_systemIntakeContacts_systemIntakeContacts as AugmentedSystemIntakeContact
} from 'queries/types/GetSystemIntakeContactsQuery';
import { UpdateSystemIntakeContact as UpdateSystemIntakeContactPayload } from 'queries/types/UpdateSystemIntakeContact';
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
  const { data, loading } = useQuery<GetSystemIntakeContactsQueryType>(
    GetSystemIntakeContactsQuery,
    {
      variables: { id: systemIntakeId }
    }
  );

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

  /**
   * Formatted system intake contacts object
   * */
  const contacts = useMemo<FormattedContacts>(() => {
    // Return empty values if no systemIntakeContacts
    if (!systemIntakeContacts || !systemIntake) return initialContactsObject;

    const {
      requester,
      euaUserId,
      businessOwner,
      productManager,
      isso
    } = systemIntake;

    /**
     * Merge initial contacts object with possible legacy data from system intake
     */
    const mergedContactsObject: FormattedContacts = {
      ...initialContactsObject,
      requester: {
        ...initialContactsObject.requester,
        euaUserId,
        commonName: requester.name,
        component: requester?.component || '',
        email: requester?.email || '',
        systemIntakeId
      },
      businessOwner: {
        ...initialContactsObject.businessOwner,
        commonName: businessOwner?.name || '',
        component: businessOwner?.component || '',
        systemIntakeId
      },
      productManager: {
        ...initialContactsObject.productManager,
        commonName: productManager?.name || '',
        component: productManager?.component || '',
        systemIntakeId
      },
      isso: {
        ...initialContactsObject.isso,
        commonName: isso?.name || '',
        systemIntakeId
      }
    };

    // Return formatted contacts
    return systemIntakeContacts.reduce<FormattedContacts>(
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
      mergedContactsObject
    );
  }, [systemIntakeContacts, systemIntake, systemIntakeId]);

  const [
    createSystemIntakeContact
  ] = useMutation<CreateSystemIntakeContactPayload>(CreateSystemIntakeContact, {
    refetchQueries: ['GetSystemIntakeContactsQuery'],
    awaitRefetchQueries: true
  });
  const [
    updateSystemIntakeContact
  ] = useMutation<UpdateSystemIntakeContactPayload>(UpdateSystemIntakeContact, {
    refetchQueries: ['GetSystemIntakeContactsQuery'],
    awaitRefetchQueries: true
  });
  const [
    deleteSystemIntakeContact
  ] = useMutation<DeleteSystemIntakeContactPayload>(DeleteSystemIntakeContact, {
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
        .then((response: FetchResult<CreateSystemIntakeContactPayload>) => {
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
            id,
            euaUserId: euaUserId?.toUpperCase() || '',
            component,
            role,
            systemIntakeId
          }
        }
      })
        .then((response: FetchResult<UpdateSystemIntakeContactPayload>) => {
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
    contacts: { data: contacts, loading },
    createContact,
    updateContact,
    deleteContact
  };
}

export default useSystemIntakeContacts;
