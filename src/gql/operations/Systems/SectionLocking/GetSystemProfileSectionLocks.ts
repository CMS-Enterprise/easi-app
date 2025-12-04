import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetSystemProfileSectionLocks($cedarSystemId: String!) {
    systemProfileSectionLocks(cedarSystemId: $cedarSystemId) {
      cedarSystemId
      section
      lockedByUserAccount {
        id
        username
        commonName
      }
    }
  }
`);
