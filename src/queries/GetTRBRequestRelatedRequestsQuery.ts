import { gql } from '@apollo/client';

const GetTRBRequestRelatedRequestsQuery = gql`
  query GetTRBRequestRelatedRequests($trbRequestID: UUID!) {
    trbRequest(id: $trbRequestID) {
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
`;

export default GetTRBRequestRelatedRequestsQuery;
