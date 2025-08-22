import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  fragment SystemIntakeContact on AugmentedSystemIntakeContact {
    systemIntakeId
    id
    euaUserId
    component
    role
    commonName
    email
  }
`);
