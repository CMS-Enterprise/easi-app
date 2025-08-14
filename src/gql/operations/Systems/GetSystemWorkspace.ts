import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetSystemWorkspace($cedarSystemId: String!) {
    cedarAuthorityToOperate(cedarSystemID: $cedarSystemId) {
      uuid
      tlcPhase
      dateAuthorizationMemoExpires
      countOfOpenPoams
      lastAssessmentDate
      oaStatus
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
        ...CedarRoleFragment
      }
    }
  }
`);
