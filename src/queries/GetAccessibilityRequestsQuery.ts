import { gql } from '@apollo/client';

export default gql`
  query GetAccessibilityRequests($first: Int!) {
    accessibilityRequests(first: $first) {
      edges {
        node {
          id
          name
          relevantTestDate {
            date
          }
          submittedAt
          system {
            lcid
            businessOwner {
              name
              component
            }
          }
          statusRecord {
            status
          }
        }
      }
    }
  }
`;
