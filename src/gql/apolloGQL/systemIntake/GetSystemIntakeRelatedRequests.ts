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
        statusAdmin
        statusRequester
        submittedAt
        lcid
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
