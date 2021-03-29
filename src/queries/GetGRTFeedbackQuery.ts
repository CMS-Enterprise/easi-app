import { gql } from '@apollo/client';

export default gql`
  query GetGRTFeedback($intakeID: UUID!) {
    systemIntake(id: $intakeID) {
      grtFeedbacks {
        id
        feedbackType
        feedback
        createdAt
      }
    }
  }
`;
