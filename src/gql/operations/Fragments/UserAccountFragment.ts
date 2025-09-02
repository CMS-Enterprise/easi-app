import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  fragment UserAccount on UserAccount {
    id
    username
    commonName
    email
  }
`);
