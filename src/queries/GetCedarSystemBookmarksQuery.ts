import { gql } from '@apollo/client';

export default gql`
  query GetCedarSystemBookmarks {
    cedarSystemBookmarks {
      euaUserId
      cedarSystemId
    }
  }
`;
