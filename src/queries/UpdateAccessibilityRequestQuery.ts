import { gql } from '@apollo/client';

export default gql`
  mutation UpdateAccessibilityRequest(
    $input: UpdateAccessibilityRequestCedarSystemInput!
  ) {
    updateAccessibilityRequestCedarSystem(input: $input) {
      id
      accessibilityRequest {
        id
        name
      }
    }
  }
`;
