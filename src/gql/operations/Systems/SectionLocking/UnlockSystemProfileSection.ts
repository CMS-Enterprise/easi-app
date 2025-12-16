import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UnlockSystemProfileSection(
    $cedarSystemId: String!
    $section: SystemProfileLockableSection!
  ) {
    unlockSystemProfileSection(cedarSystemId: $cedarSystemId, section: $section)
  }
`);
