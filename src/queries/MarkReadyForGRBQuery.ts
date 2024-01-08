import { gql } from '@apollo/client';

export default gql`
  mutation MarkSystemIntakeReadyForGRB($input: AddGRTFeedbackInput!) {
    markSystemIntakeReadyForGRB(input: $input) {
      id
    }
  }
`;
