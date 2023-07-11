import { gql } from '@apollo/client';

export default gql`
  query GetGovernanceTaskList($id: UUID!) {
    systemIntake(id: $id) {
      id
      itGovTaskStatuses {
        intakeFormStatus
        feedbackFromInitialReviewStatus
        decisionAndNextStepsStatus
        bizCaseDraftStatus
        grtMeetingStatus
        bizCaseFinalStatus
        grbMeetingStatus
      }
      governanceRequestFeedbacks {
        id
        sourceAction
        targetForm
      }
      submittedAt
      updatedAt
    }
  }
`;
