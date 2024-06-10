import { gql } from '@apollo/client';

export default gql`
  query GetCedarSystemIsBookmarked($id: String!) {
    cedarSystem(cedarSystemId: $id) {
      id
      isBookmarked
    }
  }
`;
