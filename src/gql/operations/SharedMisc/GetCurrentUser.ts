import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetCurrentUser {
    currentUser {
      launchDarkly {
        userKey
        signedHash
      }
    }
  }
`);
