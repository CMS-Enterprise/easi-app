import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetCedarSystemIDs {
    cedarSystems {
      id
      name
    }
  }
`);
