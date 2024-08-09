import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetSystemIntakeRelatedRequests($systemIntakeID: UUID!) {
    systemIntake(id: $systemIntakeID) {
      id
      relatedIntakes {
        id
        requestName
        contractNumbers {
          contractNumber
        }
        decisionState
        submittedAt
      }
      relatedTRBRequests {
        id
        name
        contractNumbers {
          contractNumber
        }
        status
        createdAt
      }
    }
  }
`);
