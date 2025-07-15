import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetGovernanceTaskList($id: UUID!) {
    systemIntake(id: $id) {
      id
      contractName
      decisionState
      grbDate
      grtDate
      lcid
      lcidRetiresAt
      relationType
      requestName
      state
      statusAdmin
      step
      submittedAt
      updatedAt

      businessCase {
        id
      }

      contractNumbers {
        contractNumber
      }

      governanceRequestFeedbacks {
        id
        targetForm
      }

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
      grbReviewStartedAt
      grbReviewAsyncEndDate
      grbReviewAsyncManualEndDate
      grbReviewAsyncRecordingTime

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
      grbPresentationLinks {
        presentationDeckFileName
        presentationDeckFileStatus
        presentationDeckFileURL
      }
    }
  }
`);
