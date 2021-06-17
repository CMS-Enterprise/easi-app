import { gql } from '@apollo/client';

export default gql`
  query GetAccessibilityRequest($id: UUID!) {
    accessibilityRequest(id: $id) {
      id
      euaUserId
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
      notes {
        id
        createdAt
        authorName
        note
      }
    }
  }
`;
