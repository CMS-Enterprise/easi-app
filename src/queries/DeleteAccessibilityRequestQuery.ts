import { gql } from '@apollo/client';

export default gql`
  mutation DeleteAccessibilityRequest(
    $input: DeleteAccessibilityRequestInput!
  ) {
    deleteAccessibilityRequest(input: $input) {
      id
    }
  }
`;
