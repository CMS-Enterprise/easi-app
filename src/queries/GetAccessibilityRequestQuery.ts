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
      documents {
        name
        uploadedAt
        status
      }
      testDates {
        testType
        date
        score
      }
    }
  }
`;
