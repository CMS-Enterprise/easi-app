import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  fragment SystemIntakeContactFragment on AugmentedSystemIntakeContact {
    systemIntakeId
    id
    euaUserId
    component
    role
    commonName
    email
  }
`);
