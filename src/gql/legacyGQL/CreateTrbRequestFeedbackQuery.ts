import { gql } from '@apollo/client';

export default gql`
  mutation CreateTrbRequestFeedback($input: CreateTRBRequestFeedbackInput!) {
    createTRBRequestFeedback(input: $input) {
      id
    }
  }
`;
