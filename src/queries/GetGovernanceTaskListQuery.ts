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
        targetForm
      }
      submittedAt
      updatedAt
      grtDate
      grbDate

      step

      businessCase {
        id
      }
    }
  }
`;
