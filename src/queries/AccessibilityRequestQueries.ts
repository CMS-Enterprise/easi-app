import { gql } from '@apollo/client';

export const CreateAccessibilityRequest = gql`
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

export const DeleteAccessibilityRequest = gql`
  mutation DeleteAccessibilityRequest(
    $input: DeleteAccessibilityRequestInput!
  ) {
    deleteAccessibilityRequest(input: $input) {
      id
    }
  }
`;
