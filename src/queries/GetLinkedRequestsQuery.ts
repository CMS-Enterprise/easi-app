import { gql } from '@apollo/client';

export default gql`
  query GetLinkedRequests($cedarSystemId: String!) {
    cedarSystemDetails(cedarSystemId: $cedarSystemId) {
      cedarSystem {
        linkedSystemIntakes: linkedSystemIntakes(state: OPEN) {
          id
          name: requestName
          submittedAt
          status: statusRequester
          # nextMeetingDate # tbd
          # requester
          requesterName
        }
        linkedTrbRequests(state: OPEN) {
          id
          name
          # submittedAt
          form {
            submittedAt
          }
          status
          # nextMeetingDate: consultMeetingTime # tbd
          # requester
          requesterInfo {
            commonName
          }
        }
      }
    }
  }
`;
