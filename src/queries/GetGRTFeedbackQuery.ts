import { gql } from '@apollo/client';

export default gql`
  query GetGRTFeedback($intakeID: UUID!) {
    grtFeedbacks(intakeID: $intakeID) @client {
      feedback
      feedbackType
      createdAt
    }
  }
`;
