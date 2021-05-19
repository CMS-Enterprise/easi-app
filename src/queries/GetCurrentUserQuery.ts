import { gql } from '@apollo/client';

export default gql`
  query GetCurrentUser {
    currentUser {
      launchDarkly {
        userKey
        signedHash
      }
    }
  }
`;
