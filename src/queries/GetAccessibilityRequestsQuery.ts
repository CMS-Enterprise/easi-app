import { gql } from '@apollo/client';

export default gql`
  query GetAccessibilityRequests {
    accessibilityRequests {
      id
      name
    }
  }
`;
