import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetCedarSubSystems($cedarSystemId: UUID!) {
    cedarSubSystems(cedarSystemId: $cedarSystemId) {
      id
      name
      acronym
      description
    }
  }
`);
