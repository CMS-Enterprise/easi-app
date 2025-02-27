import { gql } from '@apollo/client';

export const GetSystemIntakeContacts = gql(/* GraphQL */ `
  query GetSystemIntakeContacts($id: UUID!) {
    systemIntakeContacts(id: $id) {
      systemIntakeContacts {
        ...SystemIntakeContactFragment
      }
    }
  }
`);

export const CreateSystemIntakeContact = gql(/* GraphQL */ `
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
`);

export const UpdateSystemIntakeContact = gql(/* GraphQL */ `
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
`);

export const DeleteSystemIntakeContact = gql(/* GraphQL */ `
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
`);
