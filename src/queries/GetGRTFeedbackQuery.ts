import { gql } from '@apollo/client';

export default gql`
  query GetGRTFeedback($intakeID: UUID!) {
    grtFeedbacks(intakeID: $intakeID) {
      feedback
      feedbackType
      createdAt
    }
  }
`;
