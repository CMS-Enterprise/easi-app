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

      statusAdmin
      submittedAt
      updatedAt
      grtDate
      grbDate
      lcid
      lcidRetiresAt
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
