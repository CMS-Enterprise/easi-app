import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  fragment GovernanceRequestFeedbackFragment on GovernanceRequestFeedback {
    id
    feedback
    targetForm
    type
    author {
      commonName
    }
    createdAt
  }
`);
