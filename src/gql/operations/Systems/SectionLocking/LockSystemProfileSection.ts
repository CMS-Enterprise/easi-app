import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation LockSystemProfileSection(
    $cedarSystemId: UUID!
    $section: SystemProfileLockableSection!
  ) {
    lockSystemProfileSection(cedarSystemId: $cedarSystemId, section: $section)
  }
`);
