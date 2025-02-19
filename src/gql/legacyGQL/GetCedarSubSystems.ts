import { gql } from '@apollo/client';

export default gql`
  query GetCedarSubSystems($cedarSystemId: String!) {
    cedarSubSystems(cedarSystemId: $cedarSystemId) {
      id
      name
      acronym
      description
    }
  }
`;
