import { gql } from '@apollo/client';

const GetSystemIntakeRelatedRequestsQuery = gql`
  query GetSystemIntakeRelatedRequestsQuery($systemIntakeID: UUID!) {
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
`;

export default GetSystemIntakeRelatedRequestsQuery;
