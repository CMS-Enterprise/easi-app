import { useMemo } from 'react';
import { useMutation, useQuery } from '@apollo/client';

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
  GetSystemIntakeContacts,
  GetSystemIntakeContacts_systemIntakeContacts_systemIntakeContacts as AugmentedSystemIntakeContact
} from 'queries/types/GetSystemIntakeContacts';
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
  const { data, loading, refetch } = useQuery<GetSystemIntakeContacts>(
    GetSystemIntakeContactsQuery,
    {
      fetchPolicy: 'cache-first',
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
      fetchPolicy: 'cache-first',
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
    refetchQueries: [
      { query: GetSystemIntakeContactsQuery, variables: { id: systemIntakeId } }
    ],
    awaitRefetchQueries: true
  });
  const [
    updateSystemIntakeContact
  ] = useMutation<UpdateSystemIntakeContactPayload>(UpdateSystemIntakeContact, {
    refetchQueries: [
      { query: GetSystemIntakeContactsQuery, variables: { id: systemIntakeId } }
    ],
    awaitRefetchQueries: true
  });
  const [
    deleteSystemIntakeContact
  ] = useMutation<DeleteSystemIntakeContactPayload>(DeleteSystemIntakeContact, {
    refetchQueries: [
      { query: GetSystemIntakeContactsQuery, variables: { id: systemIntakeId } }
    ],
    awaitRefetchQueries: true
  });

  /**
   * Create system intake contact in database
   * */
  const createContact = async (
    contact: SystemIntakeContactProps
  ): Promise<AugmentedSystemIntakeContact | undefined> => {
    const { euaUserId, component, role } = contact;

    /** New contact response from mutation */
    const createContactResponse = await createSystemIntakeContact({
      variables: {
        input: {
          euaUserId: euaUserId.toUpperCase(),
          component,
          role,
          systemIntakeId
        }
      }
    });

    // New contact ID
    const { id } =
      createContactResponse?.data?.createSystemIntakeContact
        ?.systemIntakeContact || {};

    /** Updated contacts data */
    const updatedContacts = await refetch();

    // If errors, return initial contact data
    if (createContactResponse.errors || updatedContacts.errors) {
      return contact as AugmentedSystemIntakeContact;
    }

    // Return new contact by ID
    return updatedContacts.data.systemIntakeContacts.systemIntakeContacts.find(
      obj => obj.id === id
    );
  };

  /**
   * Update system intake contact in database
   * */
  const updateContact = async (
    contact: SystemIntakeContactProps
  ): Promise<AugmentedSystemIntakeContact | undefined> => {
    const { id, component, euaUserId, role } = contact;

    /** Updated contact response from mutation */
    const updateContactResponse = await updateSystemIntakeContact({
      variables: {
        input: {
          id,
          euaUserId: euaUserId.toUpperCase(),
          component,
          role,
          systemIntakeId
        }
      }
    });

    /** Updated contacts data */
    const updatedContacts = await refetch();

    // If errors, return initial contact data
    if (updateContactResponse.errors || updatedContacts.errors) {
      return contact as AugmentedSystemIntakeContact;
    }

    // Return updated contact by ID
    return updatedContacts?.data.systemIntakeContacts.systemIntakeContacts.find(
      obj => obj.id === id
    );
  };

  /**
   * Delete system intake contact from database
   * */
  const deleteContact = async (
    id: string
  ): Promise<AugmentedSystemIntakeContact[] | undefined> => {
    /** Deleted contact response from mutation */
    const deleteContactResponse = await deleteSystemIntakeContact({
      variables: {
        input: {
          id
        }
      }
    });

    /** Updated contacts data */
    const updatedContacts = await refetch();

    // If errors, return initial contacts data
    if (deleteContactResponse.errors || updatedContacts.errors) {
      return systemIntakeContacts;
    }

    // Return updated contacts after deleting contact
    return updatedContacts?.data?.systemIntakeContacts?.systemIntakeContacts;
  };

  return {
    contacts: { data: contacts, loading },
    createContact,
    updateContact,
    deleteContact
  };
}

export default useSystemIntakeContacts;
