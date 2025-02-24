import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetTRBRequestFeedback($id: UUID!) {
    trbRequest(id: $id) {
      id
      feedback {
        id
        action
        feedbackMessage
        author {
          commonName
        }
        createdAt
      }
    }
  }
`);
