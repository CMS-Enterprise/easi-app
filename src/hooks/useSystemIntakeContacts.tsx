import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';

import {
  CreateSystemIntakeContact,
  DeleteSystemIntakeContact,
  GetSystemIntakeContactsQuery
} from 'queries/SystemIntakeContactsQueries';
import { GetSystemIntakeContacts } from 'queries/types/GetSystemIntakeContacts';
import { SystemIntakeContactProps } from 'types/systemIntake';

export default function useSystemIntakeContacts(
  systemIntakeId: string
): [
  SystemIntakeContactProps[],
  {
    createContact: (
      contact: SystemIntakeContactProps,
      callback?: () => any
    ) => void;
    deleteContact: (id: string, callback?: () => any) => void;
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

  const [createSystemIntakeContact] = useMutation(CreateSystemIntakeContact);

  const [deleteSystemIntakeContact] = useMutation(DeleteSystemIntakeContact);

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

  return [contacts, { createContact, deleteContact }];
}
