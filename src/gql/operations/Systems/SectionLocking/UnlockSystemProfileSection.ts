import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UnlockSystemProfileSection(
    $cedarSystemId: UUID!
    $section: SystemProfileLockableSection!
  ) {
    unlockSystemProfileSection(cedarSystemId: $cedarSystemId, section: $section)
  }
`);
