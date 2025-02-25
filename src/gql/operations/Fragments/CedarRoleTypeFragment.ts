import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  fragment CedarRoleTypeFragment on CedarRoleType {
    id
    name
    description
  }
`);
