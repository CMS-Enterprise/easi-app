import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetSystemWorkspaceAto($cedarSystemId: UUID!) {
    cedarAuthorityToOperate(cedarSystemID: $cedarSystemId) {
      uuid
      tlcPhase
      dateAuthorizationMemoExpires
      countOfOpenPoams
      lastAssessmentDate
      oaStatus
    }
  }
`);
