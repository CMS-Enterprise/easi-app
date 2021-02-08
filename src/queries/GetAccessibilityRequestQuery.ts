import { gql } from '@apollo/client';

export default gql`
  query GetAccessibilityRequest($id: UUID!) {
    accessibilityRequest(id: $id) {
      id
      name
      submittedAt
      lcid @client
      businessOwner @client {
        name
        component
      }
    }
  }
`;
