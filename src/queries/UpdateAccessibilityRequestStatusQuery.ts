import { gql } from '@apollo/client';

export default gql`
  mutation UpdateAccessibilityReqStatus(
    $input: UpdateAccessibilityRequestStatus!
  ) {
    updateAccessibilityRequestStatus(input: $input) {
      id
      requestID
      status
      euaUserId
      userErrors {
        message
        path
      }
    }
  }
`;
