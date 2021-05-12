import { gql } from '@apollo/client';

export const CreateAccessibilityRequestQuery = gql`
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

export const DeleteAccessibilityRequestQuery = gql`
  mutation DeleteAccessibilityRequest(
    $input: DeleteAccessibilityRequestInput!
  ) {
    deleteAccessibilityRequest(input: $input) {
      id
    }
  }
`;
