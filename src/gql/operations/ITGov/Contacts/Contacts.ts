import { gql } from '@apollo/client';

export const GetSystemIntakeContacts = gql(/* GraphQL */ `
  query GetSystemIntakeContacts($id: UUID!) {
    systemIntakeContacts(id: $id) {
      ...SystemIntakeContact
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
        roles
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
        roles
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
        roles
      }
    }
  }
`);
