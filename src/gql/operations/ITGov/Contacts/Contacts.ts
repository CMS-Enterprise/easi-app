import { gql } from '@apollo/client';

export const GetSystemIntakeContacts = gql(/* GraphQL */ `
  query GetSystemIntakeContacts($id: UUID!) {
    systemIntakeContacts(id: $id) {
      requester {
        ...SystemIntakeContact
      }
      businessOwners {
        ...SystemIntakeContact
      }
      productManagers {
        ...SystemIntakeContact
      }
      additionalContacts {
        ...SystemIntakeContact
      }
    }
  }
`);

export const CreateSystemIntakeContact = gql(/* GraphQL */ `
  mutation CreateSystemIntakeContact($input: CreateSystemIntakeContactInput!) {
    createSystemIntakeContact(input: $input) {
      systemIntakeContact {
        ...SystemIntakeContact
      }
    }
  }
`);

export const UpdateSystemIntakeContact = gql(/* GraphQL */ `
  mutation UpdateSystemIntakeContact($input: UpdateSystemIntakeContactInput!) {
    updateSystemIntakeContact(input: $input) {
      systemIntakeContact {
        ...SystemIntakeContact
      }
    }
  }
`);

export const DeleteSystemIntakeContact = gql(/* GraphQL */ `
  mutation DeleteSystemIntakeContact($input: DeleteSystemIntakeContactInput!) {
    deleteSystemIntakeContact(input: $input) {
      systemIntakeContact {
        ...SystemIntakeContact
      }
    }
  }
`);
