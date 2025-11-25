import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetCedarSystemIsBookmarked($id: UUID!) {
    cedarSystem(cedarSystemId: $id) {
      id
      isBookmarked
    }
  }
`);
