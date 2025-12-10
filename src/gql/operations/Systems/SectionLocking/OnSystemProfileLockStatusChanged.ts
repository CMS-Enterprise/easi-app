import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  subscription OnSystemProfileLockStatusChanged($cedarSystemId: String!) {
    onSystemProfileSectionLockStatusChanged(cedarSystemId: $cedarSystemId) {
      changeType
      lockStatus {
        cedarSystemId
        section
        lockedByUserAccount {
          id
          username
          commonName
        }
      }
    }
  }
`);
