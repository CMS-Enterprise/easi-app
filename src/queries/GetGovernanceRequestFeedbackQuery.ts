import { gql } from '@apollo/client';

export const GovernanceRequestFeedback = gql`
  fragment GovernanceRequestFeedback on GovernanceRequestFeedback {
    id
    feedback
    targetForm
    type
    author {
      commonName
    }
    createdAt
  }
`;

export default gql`
  ${GovernanceRequestFeedback}
  query GetGovernanceRequestFeedback($intakeID: UUID!) {
    systemIntake(id: $intakeID) {
      id
      requestName

      governanceRequestFeedbacks {
        ...GovernanceRequestFeedback
      }
    }
  }
`;
