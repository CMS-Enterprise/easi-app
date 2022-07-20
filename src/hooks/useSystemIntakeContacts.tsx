import { useMemo } from 'react';
import { useMutation, useQuery } from '@apollo/client';

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

export type CreateContactType = (
  contact: SystemIntakeContactProps
) => Promise<AugmentedSystemIntakeContact | undefined>;

export type UpdateContactType = (
  contact: SystemIntakeContactProps
) => Promise<AugmentedSystemIntakeContact[] | undefined>;

export type DeleteContactType = (
  id: string
) => Promise<AugmentedSystemIntakeContact[] | undefined>;

type UseSystemIntakeContactsType = [
  FormattedContacts | null,
  {
    createContact: CreateContactType;
    updateContact: UpdateContactType;
    deleteContact: DeleteContactType;
  }
];

export function useSystemIntakeContacts(
  systemIntakeId: string
): UseSystemIntakeContactsType {
  const { data, refetch } = useQuery<GetSystemIntakeContacts>(
    GetSystemIntakeContactsQuery,
    {
      variables: { id: systemIntakeId }
    }
  );

  const contacts = useMemo(() => {
    const systemIntakeContacts =
      data?.systemIntakeContacts?.systemIntakeContacts;
    const contactsObject = systemIntakeContacts
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
    return contactsObject;
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
      .then(response =>
        response?.data?.systemIntakeContacts?.systemIntakeContacts.find(
          obj => obj.role === role
        )
      );
  };

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
        response => response?.data?.systemIntakeContacts?.systemIntakeContacts
      );
  };

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
        response => response?.data?.systemIntakeContacts?.systemIntakeContacts
      );
  };

  return [contacts, { createContact, updateContact, deleteContact }];
}
