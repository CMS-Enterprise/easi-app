import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';

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
import { SystemIntakeContactProps } from 'types/systemIntake';

export default function useSystemIntakeContacts(
  systemIntakeId: string
): [
  SystemIntakeContactProps[],
  {
    createContact: (
      contact: SystemIntakeContactProps,
      callback?: () => void
    ) => void;
    updateContact: (
      contact: SystemIntakeContactProps,
      callback?: () => void
    ) => void;
    deleteContact: (id: string, callback?: () => void) => void;
  }
] {
  const [contacts, setContacts] = useState<SystemIntakeContactProps[]>([]);

  const { data, refetch } = useQuery<GetSystemIntakeContacts>(
    GetSystemIntakeContactsQuery,
    {
      variables: { id: systemIntakeId }
    }
  );

  const systemIntakeContacts = useMemo(
    () => data?.systemIntakeContacts?.systemIntakeContacts || [],
    [data?.systemIntakeContacts?.systemIntakeContacts]
  ) as SystemIntakeContactProps[];

  const [
    createSystemIntakeContact
  ] = useMutation<CreateSystemIntakeContactInput>(CreateSystemIntakeContact);
  const [
    updateSystemIntakeContact
  ] = useMutation<UpdateSystemIntakeContactInput>(UpdateSystemIntakeContact);
  const [
    deleteSystemIntakeContact
  ] = useMutation<DeleteSystemIntakeContactInput>(DeleteSystemIntakeContact);

  const createContact = (
    contact: SystemIntakeContactProps,
    callback?: () => any
  ) => {
    const { euaUserId, component, role } = contact;
    createSystemIntakeContact({
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
      .then(callback || null);
  };

  const updateContact = (
    contact: SystemIntakeContactProps,
    callback?: () => any
  ) => {
    const { id, euaUserId, component, role } = contact;
    updateSystemIntakeContact({
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
      .then(callback || null);
  };

  const deleteContact = (id: string, callback?: () => any) => {
    deleteSystemIntakeContact({
      variables: {
        input: {
          id
        }
      }
    })
      .then(refetch)
      .then(callback || null);
  };

  useEffect(() => {
    setContacts(systemIntakeContacts);
  }, [systemIntakeContacts]);

  return [contacts, { createContact, updateContact, deleteContact }];
}
