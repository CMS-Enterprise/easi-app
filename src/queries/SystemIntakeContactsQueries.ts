import { gql } from '@apollo/client';

export const GetSystemIntakeContactsQuery = gql`
  query GetSystemIntakeContactsQuery($id: UUID!) {
    systemIntakeContacts(id: $id) {
      systemIntakeContacts {
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

export const UpdateSystemIntakeContacts = '';
