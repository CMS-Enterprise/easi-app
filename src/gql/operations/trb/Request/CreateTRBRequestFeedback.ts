import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateTRBRequestFeedback($input: CreateTRBRequestFeedbackInput!) {
    createTRBRequestFeedback(input: $input) {
      id
    }
  }
`);
