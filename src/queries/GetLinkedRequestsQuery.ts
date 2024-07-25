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
          lcid # lcid is part of the intake's status display value
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
          state # status is another status display value
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
