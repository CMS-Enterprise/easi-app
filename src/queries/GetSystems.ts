import { gql } from '@apollo/client';

export default gql`
  query GetSystems($openRequests: Boolean!) {
    systemIntakes(openRequests: $openRequests) {
      id
      lcid
      businessOwner {
        name
        component
      }
    }
  }
`;
