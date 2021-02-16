import { gql } from '@apollo/client';

export default gql`
  query GetAccessibilityRequest($id: UUID!) {
    accessibilityRequest(id: $id) {
      id
      submittedAt
      name
      system {
        name
        lcid
        businessOwner {
          name
          component
        }
      }
      documents @client {
        name
        uploadedAt
      }
    }
  }
`;
