import { gql } from '@apollo/client';

export default gql`
  query GetAccessibilityRequest($id: UUID!) {
    accessibilityRequest(id: $id) {
      id
      name
      submittedAt
    }
  }
`;
