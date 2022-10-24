import { gql } from '@apollo/client';

export const GetSystemIntakeContactsQuery = gql`
  query GetSystemIntakeContactsQuery($id: UUID!) {
    systemIntakeContacts(id: $id) {
      systemIntakeContacts {
        id
        euaUserId
        systemIntakeId
        component
        role
        commonName
        email
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
