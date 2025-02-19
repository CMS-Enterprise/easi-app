import { gql } from '@apollo/client';

export const SystemIntakeContact = gql`
  fragment SystemIntakeContact on AugmentedSystemIntakeContact {
    systemIntakeId
    id
    euaUserId
    component
    role
    commonName
    email
  }
`;

export const GetSystemIntakeContactsQuery = gql`
  ${SystemIntakeContact}
  query GetSystemIntakeContactsQuery($id: UUID!) {
    systemIntakeContacts(id: $id) {
      systemIntakeContacts {
        ...SystemIntakeContact
      }
    }
  }
`;

export const CreateSystemIntakeContact = gql`
  mutation CreateSystemIntakeContact($input: CreateSystemIntakeContactInput!) {
    createSystemIntakeContact(input: $input) {
      systemIntakeContact {
        id
        euaUserId
        systemIntakeId
        component
        role
      }
    }
  }
`;

export const UpdateSystemIntakeContact = gql`
  mutation UpdateSystemIntakeContact($input: UpdateSystemIntakeContactInput!) {
    updateSystemIntakeContact(input: $input) {
      systemIntakeContact {
        id
        euaUserId
        systemIntakeId
        component
        role
      }
    }
  }
`;

export const DeleteSystemIntakeContact = gql`
  mutation DeleteSystemIntakeContact($input: DeleteSystemIntakeContactInput!) {
    deleteSystemIntakeContact(input: $input) {
      systemIntakeContact {
        id
        euaUserId
        systemIntakeId
        component
        role
      }
    }
  }
`;
