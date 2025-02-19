import { gql } from '@apollo/client';

export default gql`
  query GetTrbRequestFeedback($id: UUID!) {
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
`;
