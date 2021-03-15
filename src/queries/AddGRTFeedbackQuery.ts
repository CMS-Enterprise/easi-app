import { gql } from '@apollo/client';

export default gql`
  mutation AddGRTFeedback($input: AddGRTFeedbackInput!) {
    addGRTFeedback(input: $input) {
      id
    }
  }
`;
