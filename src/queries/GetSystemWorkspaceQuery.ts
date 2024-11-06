import { gql } from '@apollo/client';

import { CedarRole } from './GetSystemProfileQuery';

export default gql`
  ${CedarRole}
  query GetSystemWorkspace($cedarSystemId: String!) {
    cedarAuthorityToOperate(cedarSystemID: $cedarSystemId) {
      uuid
      tlcPhase
      dateAuthorizationMemoExpires
      countOfOpenPoams
      lastAssessmentDate
    }
    cedarSystemDetails(cedarSystemId: $cedarSystemId) {
      isMySystem
      cedarSystem {
        id
        name
        isBookmarked
        linkedTrbRequests(state: OPEN) {
          id
        }
        linkedSystemIntakes(state: OPEN) {
          id
        }
      }
      roles {
        ...CedarRole
      }
    }
  }
`;
