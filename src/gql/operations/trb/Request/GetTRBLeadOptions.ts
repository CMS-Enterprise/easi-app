import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetTRBLeadOptions {
    trbLeadOptions {
      euaUserId
      commonName
    }
  }
`);
