import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation LockSystemProfileSection(
    $cedarSystemId: String!
    $section: SystemProfileLockableSection!
  ) {
    lockSystemProfileSection(cedarSystemId: $cedarSystemId, section: $section)
  }
`);
