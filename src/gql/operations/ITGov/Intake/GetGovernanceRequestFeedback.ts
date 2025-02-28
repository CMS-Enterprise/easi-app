import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetGovernanceRequestFeedback($intakeID: UUID!) {
    systemIntake(id: $intakeID) {
      id
      requestName

      governanceRequestFeedbacks {
        ...GovernanceRequestFeedbackFragment
      }
    }
  }
`);
