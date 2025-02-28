import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetCedarSubSystems($cedarSystemId: String!) {
    cedarSubSystems(cedarSystemId: $cedarSystemId) {
      id
      name
      acronym
      description
    }
  }
`);
