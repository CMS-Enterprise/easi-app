import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetGovernanceTaskList($id: UUID!) {
    systemIntake(id: $id) {
      id
      requestName

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
      grbReviewType
      grbReviewAsyncRecordingTime
      grbReviewAsyncEndDate
      grbReviewStandardGRBMeetingTime
      grbReviewAsyncGRBMeetingTime

      step
      state
      decisionState

      businessCase {
        id
      }

      relationType
      contractName
      contractNumbers {
        contractNumber
      }
      systems {
        id
        name
        acronym
      }
    }
  }
`);
