import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetTrbLeadOptions {
    trbLeadOptions {
      euaUserId
      commonName
    }
  }
`);
