import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  fragment SystemIntakeContact on SystemIntakeContact {
    systemIntakeId
    id
    euaUserId
    userAccount {
      id
      username
      commonName
      email
    }
    component
    roles
  }
`);
