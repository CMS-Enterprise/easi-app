import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  fragment SystemIntakeContact on SystemIntakeContact {
    systemIntakeId
    id
    userAccount {
      ...UserAccount
    }
    component
    roles
    isRequester
  }
`);
