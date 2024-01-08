import { gql } from '@apollo/client';

export default gql`
  mutation AddGRTFeedbackProgressToFinal($input: AddGRTFeedbackInput!) {
    addGRTFeedbackAndProgressToFinalBusinessCase(input: $input) {
      id
    }
  }
`;
