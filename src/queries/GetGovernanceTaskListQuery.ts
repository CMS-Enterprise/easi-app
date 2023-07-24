import { gql } from '@apollo/client';

export default gql`
  query GetGovernanceTaskList($id: UUID!) {
    systemIntake(id: $id) {
      id
      itGovTaskStatuses {
        intakeFormStatus
        feedbackFromInitialReviewStatus
        bizCaseDraftStatus
        grtMeetingStatus
        bizCaseFinalStatus
        grbMeetingStatus
        decisionAndNextStepsStatus
      }
      governanceRequestFeedbacks {
        id
      }
      submittedAt
      updatedAt
      grtDate
    }
  }
`;
