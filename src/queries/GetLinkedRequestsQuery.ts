import { gql } from '@apollo/client';

export default gql`
  query GetLinkedRequests(
    $cedarSystemId: String!
    $systemIntakeState: SystemIntakeState!
    $trbRequestState: TRBRequestState!
  ) {
    cedarSystemDetails(cedarSystemId: $cedarSystemId) {
      cedarSystem {
        linkedSystemIntakes: linkedSystemIntakes(state: $systemIntakeState) {
          id
          name: requestName
          submittedAt
          status: statusRequester
          # nextMeetingDate # tbd
          # requester
          requesterName
        }
        linkedTrbRequests(state: $trbRequestState) {
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
