import { gql } from '@apollo/client';

export default gql`
  query GetLinkedRequests($cedarSystemId: String!) {
    cedarSystemDetails(cedarSystemId: $cedarSystemId) {
      cedarSystem {
        linkedTrbRequests(state: OPEN) {
          id
          name
          createdAt
          status
          nextMeetingDate: consultMeetingTime
        }
        linkedSystemIntakes(state: OPEN) {
          id
          requestName
          createdAt
          status: statusRequester
        }
      }
    }
  }
`;
