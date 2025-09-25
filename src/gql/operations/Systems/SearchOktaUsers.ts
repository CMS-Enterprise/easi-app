import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetOktaUsers($searchTerm: String!) {
    searchOktaUsers(searchTerm: $searchTerm) {
      commonName
      email
      euaUserId
    }
  }
`);
