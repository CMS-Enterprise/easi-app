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
        url
        uploadedAt
        status
        documentType {
          commonType
          otherTypeDescription
        }
      }
      testDates {
        id
        testType
        date
        score
      }
    }
  }
`;
