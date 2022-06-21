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

const contactDetails: SystemIntakeContactProps = {
  id: '',
  euaUserId: '',
  systemIntakeId: '',
  component: '',
  role: '',
  commonName: '',
  email: ''
};

type FormattedContacts = {
  businessOwner: SystemIntakeContactProps;
  productManager: SystemIntakeContactProps;
  isso: SystemIntakeContactProps;
  additionalContacts: SystemIntakeContactProps[];
};

const initialContactsObject: FormattedContacts = {
  businessOwner: { ...contactDetails, role: 'Business Owner' },
  productManager: { ...contactDetails, role: 'Product Manager' },
  isso: { ...contactDetails, role: 'ISSO' },
  additionalContacts: []
};

type Roles = {
  'Business Owner': 'businessOwner';
  'Product Manager': 'productManager';
  ISSO: 'isso';
};

const rolesMap: Roles = {
  'Business Owner': 'businessOwner',
  'Product Manager': 'productManager',
  ISSO: 'isso'
};

export default function useSystemIntakeContacts(
  systemIntakeId: string
): [
  FormattedContacts | null,
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
  const { data, refetch } = useQuery<GetSystemIntakeContacts>(
    GetSystemIntakeContactsQuery,
    {
      variables: { id: systemIntakeId }
    }
  );

  const contacts = useMemo(() => {
    const systemIntakeContacts =
      data?.systemIntakeContacts?.systemIntakeContacts;
    return systemIntakeContacts
      ? systemIntakeContacts.reduce((acc, contact: any) => {
          if (rolesMap[contact.role as keyof Roles]) {
            return {
              ...acc,
              [rolesMap[contact.role as keyof Roles]]: contact
            };
          }
          return {
            ...acc,
            additionalContacts: [...acc.additionalContacts, contact]
          };
        }, initialContactsObject)
      : null;
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

  return [contacts, { createContact, updateContact, deleteContact }];
}
