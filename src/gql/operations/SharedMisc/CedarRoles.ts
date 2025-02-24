import { gql } from '@apollo/client';

export const GetCedarRoleTypes = gql(/* GraphQL */ `
  query GetCedarRoleTypes {
    roleTypes {
      ...CedarRoleTypeFragment
    }
  }
`);

export const SetRolesForUserOnSystem = gql(/* GraphQL */ `
  mutation SetRolesForUserOnSystem($input: SetRolesForUserOnSystemInput!) {
    setRolesForUserOnSystem(input: $input)
  }
`);
