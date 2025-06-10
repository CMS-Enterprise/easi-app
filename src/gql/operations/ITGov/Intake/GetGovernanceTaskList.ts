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

      systems {
        id
        name
        acronym
      }
    }
  }
`);
