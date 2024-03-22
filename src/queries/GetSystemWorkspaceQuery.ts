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
      cedarSystem {
        id
        name
      }
      roles {
        ...CedarRole
      }
    }
  }
`;
