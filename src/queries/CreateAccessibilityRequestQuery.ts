import { gql } from '@apollo/client';

export default gql`
  mutation CreateAccessibilityRequest(
    $input: CreateAccessibilityRequestInput!
  ) {
    createAccessibilityRequest(input: $input) {
      accessibilityRequest {
        id
        name
      }
      userErrors {
        message
        path
      }
    }
  }
`;
