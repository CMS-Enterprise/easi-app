import { gql } from '@apollo/client';

export default gql`
  query GetSystemProfileAto($cedarSystemId: String!) {
    cedarThreat(cedarSystemId: $cedarSystemId) {
      weaknessRiskLevel
    }
  }
`;
