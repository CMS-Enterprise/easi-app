import { gql } from '@apollo/client';

export default gql`
  query GetSystemProfileAto($cedarSystemId: String!) {
    cedarAuthorityToOperate(cedarSystemID: $cedarSystemId) {
      uuid
      tlcPhase
      dateAuthorizationMemoExpires
      countOfOpenPoams
      lastAssessmentDate
    }
    cedarThreat(cedarSystemId: $cedarSystemId) {
      id
      parentId
      alternativeId
      type
      weaknessRiskLevel
      daysOpen
      controlFamily
    }
  }
`;
