import { gql } from '@apollo/client';

export default gql`
  mutation CreateAccessibilityRequest($system: System!, $revision: String!) {
    createAccessibilityRequest(system: $system, revision: $revision) {
      ... on CreateAccessibilityRequestSuccess {
        accessibilityRequest {
          id
          name
        }
      }
      ... on CreateAccessibilityRequestFailure {
        message
      }
    }
  }
`;
