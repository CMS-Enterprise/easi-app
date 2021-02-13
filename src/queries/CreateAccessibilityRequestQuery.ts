import { gql } from '@apollo/client';

export default gql`
  mutation CreateAccessibilityRequest(
    $input: CreateAccessibilityRequestInput!
  ) {
    createAccessibilityRequest(input: $input) {
      accessibilityRequest {
        id
        system {
          name
        }
      }
      userErrors {
        message
        path
      }
    }
  }
`;
