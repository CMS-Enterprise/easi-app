import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetTRBRequestRelatedRequests($trbRequestID: UUID!) {
    trbRequest(id: $trbRequestID) {
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
