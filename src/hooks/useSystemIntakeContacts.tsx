import { useMemo } from 'react';
import { FetchResult } from '@apollo/client';
import {
  CreateSystemIntakeContactMutation,
  UpdateSystemIntakeContactMutation,
  useCreateSystemIntakeContactMutation,
  useDeleteSystemIntakeContactMutation,
  useGetSystemIntakeContactsQuery,
  useUpdateSystemIntakeContactMutation
} from 'gql/generated/graphql';

import {
  CreateContactType,
  DeleteContactType,
  FormattedContacts,
  UpdateContactType,
  UseSystemIntakeContactsType
} from 'types/systemIntake';

/**
 * Custom hook for creating, updating, and deleting system intake contacts
 * */
// TODO EASI-4937 - remove this hook and use the actual queries and mutations.
function useSystemIntakeContacts(
  systemIntakeId: string
): UseSystemIntakeContactsType {
  const { data, loading } = useGetSystemIntakeContactsQuery({
    variables: { id: systemIntakeId }
  });

  const { systemIntakeContacts } = data || {};

  // Reformatting contacts data to return primary business owner and product manager.
  // Additional business owners and product managers are added to additionalContacts array.
  // This is a temporary fix to work with existing form.
  const contacts: FormattedContacts = useMemo(() => {
    const [businessOwner, ...additionalBusinessOwners] =
      systemIntakeContacts?.businessOwners || [];

    const [productManager, ...additionalProductManagers] =
      systemIntakeContacts?.productManagers || [];

    return {
      // Overriding nullable requester type in schema for now to work with form since it will be refactored later
      requester: systemIntakeContacts?.requester!,
      businessOwner,
      productManager,
      additionalContacts: [
        ...(systemIntakeContacts?.additionalContacts || []),
        ...additionalBusinessOwners,
        ...additionalProductManagers
      ]
    };
  }, [systemIntakeContacts]);

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

  const createContact: CreateContactType = async contact => {
    const { component, roles, isRequester, username } = contact;

    return (
      // Create system intake contact
      createSystemIntakeContact({
        variables: {
          input: {
            // Temp overriding nullable username
            euaUserId: username!,
            component,
            roles,
            systemIntakeId,
            isRequester
          }
        }
      }).then(
        (response: FetchResult<CreateSystemIntakeContactMutation>) =>
          response.data?.createSystemIntakeContact?.systemIntakeContact
      )
    );
  };

  const updateContact: UpdateContactType = async contact => {
    const { id, component, roles, isRequester } = contact;

    /** Updated contact response from mutation */
    return updateSystemIntakeContact({
      variables: {
        input: {
          id: id || '',
          component,
          roles,
          isRequester
        }
      }
    }).then(
      (response: FetchResult<UpdateSystemIntakeContactMutation>) =>
        response.data?.updateSystemIntakeContact?.systemIntakeContact
    );
  };

  const deleteContact: DeleteContactType = async id => {
    return (
      // Delete contact
      deleteSystemIntakeContact({
        variables: {
          input: {
            id
          }
        }
      }).then(() => contacts)
    );
  };

  return {
    contacts: {
      data: contacts,
      loading
    },
    createContact,
    updateContact,
    deleteContact
  };
}

export default useSystemIntakeContacts;
