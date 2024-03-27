import { gql } from '@apollo/client';

export default gql`
  query GetAccessibilityRequest($id: UUID!) {
    accessibilityRequest(id: $id) {
      id
      euaUserId
      submittedAt
      name
      documents {
        id
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
      statusRecord {
        status
      }
    }
  }
`;
