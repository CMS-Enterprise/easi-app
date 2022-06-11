import { gql } from '@apollo/client';

export default gql`
  query GetSystemProfileAto($cedarSystemId: String!) {
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
