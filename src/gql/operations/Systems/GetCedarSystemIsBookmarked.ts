import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetCedarSystemIsBookmarked($id: String!) {
    cedarSystem(cedarSystemId: $id) {
      id
      isBookmarked
    }
  }
`);
