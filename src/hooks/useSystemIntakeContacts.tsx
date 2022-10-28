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
import {
  CreateSystemIntakeContact as CreateSystemIntakeContactPayload,
  CreateSystemIntakeContact_createSystemIntakeContact_systemIntakeContact as SystemIntakeContact
} from 'queries/types/CreateSystemIntakeContact';
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
  ] = useMutation<CreateSystemIntakeContactPayload>(CreateSystemIntakeContact);
  const [
    updateSystemIntakeContact
  ] = useMutation<UpdateSystemIntakeContactPayload>(UpdateSystemIntakeContact);
  const [
    deleteSystemIntakeContact
  ] = useMutation<DeleteSystemIntakeContactPayload>(DeleteSystemIntakeContact);

  /**
   * Create system intake contact in database
   * */
  const createContact = async (
    contact: SystemIntakeContactProps
  ): Promise<AugmentedSystemIntakeContact | undefined> => {
    const { euaUserId, component, role } = contact;

    /** New contact response from mutation */
    const newContact:
      | SystemIntakeContact
      | null
      | undefined = await createSystemIntakeContact({
      variables: {
        input: {
          euaUserId: euaUserId.toUpperCase(),
          component,
          role,
          systemIntakeId
        }
      }
    })
      .then(response => {
        // Return new contact data
        return response?.data?.createSystemIntakeContact?.systemIntakeContact;
      })
      // If error, return null
      .catch(() => null);

    // If contact is undefined, return mutation input without verifying contact
    if (!newContact) {
      return contact as AugmentedSystemIntakeContact;
    }

    // Refetch contacts
    return (
      refetch()
        .then(response => {
          // Return new contact
          return response.data.systemIntakeContacts.systemIntakeContacts.find(
            obj => obj.id === newContact?.id
          );
        })
        // If error, return mutation input without verifying contact
        .catch(() => contact as AugmentedSystemIntakeContact)
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
    const updatedContact = await updateSystemIntakeContact({
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
      // If error, return null
      .catch(() => null);

    // If contact is undefined, return mutation input without updating
    if (!updatedContact) {
      return contact as AugmentedSystemIntakeContact;
    }

    // Refetch contacts
    return refetch()
      .then(() => contact as AugmentedSystemIntakeContact)
      .catch(() => contact as AugmentedSystemIntakeContact);
  };

  /**
   * Delete system intake contact from database
   * */
  const deleteContact = async (
    id: string
  ): Promise<FormattedContacts | undefined> => {
    const deletedContact = await deleteSystemIntakeContact({
      variables: {
        input: {
          id
        }
      }
    })
      // Return mutation response
      .then(response => response)
      // If error, return null
      .catch(() => null);

    // If deleted contact is undefined, return formatted contacts without deleting
    if (!deletedContact?.data) {
      return contacts;
    }

    // Refetch contacts
    return (
      refetch()
        // Return formatted contacts
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
