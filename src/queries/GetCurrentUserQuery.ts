import { gql } from '@apollo/client';

export default gql`
  query GetCurrentUser {
    currentUser {
      userKey
      signedHash
    }
  }
`;
